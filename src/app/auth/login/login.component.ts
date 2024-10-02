import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildLoginForm();
    this.listenForValueChanges();
  }

  buildLoginForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  listenForValueChanges(): void {
    this.loginForm.valueChanges.subscribe(() => {
      this.errorMessage = null;
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.getRawValue();
    this.loading = true;
    this.errorMessage = null;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/home');
      },
      error: (err) => {
        this.loading = false;
        this.handleAuthError(err.code);
      },
    });
  }
  loginWithGoogle(): void {
    this.loading = true;
    this.authService.createAcountWithGoogle().subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/home');
      },
      error: (err) => {
        this.loading = false;
        if (err.message === 'Google login canceled by the user.') {
          this.errorMessage = 'Google login canceled. Please try again.';
        } else {
          this.errorMessage = err.message || 'Google login failed';
        }
      },
    });
  }

  handleAuthError(errorCode: string): void {
    switch (errorCode) {
      case 'auth/wrong-password':
        this.errorMessage = 'Incorrect password. Please try again.';
        break;
      case 'auth/user-not-found':
        this.errorMessage =
          'No user found with this email. Please check the email address.';
        break;
      case 'auth/invalid-email':
        this.errorMessage =
          'Invalid email address. Please enter a valid email.';
        break;
      default:
        this.errorMessage = 'Incorrect Password or Email. Please try again !';
        break;
    }
  }

  navigateToSignUp(): void {
    this.router.navigateByUrl('signup');
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
