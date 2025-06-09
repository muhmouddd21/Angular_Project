import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;
      this.authService.signIn(email, password).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.isLoading = false;
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Login error:', error);
          this.isLoading = false;
          this.handleError(error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  private handleError(error: any) {
    if (error.error && error.error.error) {
      const errorCode = error.error.error.message;
      switch (errorCode) {
        case 'EMAIL_NOT_FOUND':
          this.errorMessage = 'No account found with this email address.';
          break;
        case 'INVALID_PASSWORD':
          this.errorMessage = 'Incorrect password.';
          break;
        case 'USER_DISABLED':
          this.errorMessage = 'This account has been disabled.';
          break;
        case 'TOO_MANY_ATTEMPTS_TRY_LATER':
          this.errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        default:
          this.errorMessage = 'Login failed. Please try again.';
      }
    } else {
      this.errorMessage = 'Network error. Please check your connection and try again.';
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

}
