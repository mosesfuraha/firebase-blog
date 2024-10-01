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
    this.signupForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        repeatPassword: ['', [Validators.required, Validators.minLength(6)]],
      },
      { validator: this.passwordsMatchValidator }
    );

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

    const { email, password } = this.signupForm.getRawValue();
    this.loading = true;
    this.errorMessage = null;

    this.authService.register(email, password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('');
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message;
      },
    });
  }

  navigateToLogin(): void {
    this.router.navigateByUrl('');
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
