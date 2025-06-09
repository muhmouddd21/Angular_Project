import { CommonModule } from '@angular/common';
import { AuthService } from './../../services/auth.service';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  isSubmitted = false;

  private AuthService=inject(AuthService);

  constructor(private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validators: this.passwordMatchValidator
    });
  }


  passwordMatchValidator(control: AbstractControl): { [key: string]: any } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }


  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.isSubmitted = true;

    if (this.registerForm.invalid) {
      return;
    }


    const formValue = this.registerForm.value;
    this.AuthService.signUp(formValue.email,formValue.password).subscribe((res)=>{
      console.log(res);

    })
    console.log('Registration Data:', this.registerForm.value);
    alert('Registration successful!');

    this.isSubmitted = false;
    this.registerForm.reset();
  }
}
