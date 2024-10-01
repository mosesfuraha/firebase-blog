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

  // Build the login form
  buildLoginForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Listen for value changes to reset error messages
  listenForValueChanges(): void {
    this.loginForm.valueChanges.subscribe(() => {
      this.errorMessage = null;
    });
  }

  // Normal function to handle login when button is clicked
  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // Show validation errors
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
        this.errorMessage = err.message || 'An error occurred during login';
      },
    });
  }

  // Navigate to sign-up page
  navigateToSignUp(): void {
    this.router.navigateByUrl('signup');
  }

  // Getters for form controls to use in the template
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
