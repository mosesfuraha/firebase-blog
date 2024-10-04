import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildSignupForm();
    this.listenForValueChanges();
  }

  buildSignupForm(): void {
    this.signupForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        repeatPassword: ['', [Validators.required, Validators.minLength(6)]],
      },
      { validator: this.passwordsMatchValidator }
    );
  }

  listenForValueChanges(): void {
    this.signupForm.valueChanges.subscribe(() => {
      this.errorMessage = null;
    });
  }

  passwordsMatchValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const password = control.get('password');
    const repeatPassword = control.get('repeatPassword');

    if (password && repeatPassword && password.value !== repeatPassword.value) {
      return { passwordsMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const { username, email, password } = this.signupForm.getRawValue();
    this.loading = true;
    this.errorMessage = null;

    this.authService.register(email, password, username).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('auth');
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message;
      },
    });
  }

  signupWithGoogle(): void {
    this.loading = true;
    this.authService.createAcountWithGoogle().subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('auth');
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err.message || 'An error occurred with Google login';
      },
    });
  }

  navigateToLogin(): void {
    this.router.navigateByUrl('auth');
  }

  get username() {
    return this.signupForm.get('username');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }

  get repeatPassword() {
    return this.signupForm.get('repeatPassword');
  }
}
