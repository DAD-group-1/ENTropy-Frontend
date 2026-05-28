import { Component, inject, OnInit } from '@angular/core';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgmMotionDirective } from '@scripttype/ng-motion';
import { AuthenticationService } from '../../core/data-services';

@Component({
  selector: 'app-login-page',
  imports: [
    PasswordModule,
    CardModule,
    ButtonModule,
    FormsModule,
    MessageModule,
    InputTextModule,
    ReactiveFormsModule,
    CommonModule,
    NgmMotionDirective,
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage implements OnInit {
  private readonly authenticationService = inject(AuthenticationService);
  fb = inject(FormBuilder);

  loginForm!: FormGroup;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.authenticationService.authenticationControllerLogin({
      email: 'student@example.com',
      password: 'password123',
    }).subscribe((response) => {
      console.log('Login response:', response);
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get emailInvalid() {
    return this.email?.invalid && this.email?.dirty;
  }

  get password() {
    return this.loginForm.get('password');
  }

  get passwordInvalid() {
    return this.password?.invalid && this.password?.dirty;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Form submitted:', this.loginForm.value);
      // TODO: Post the data to the service and redirect to homepage if good
    }
  }

  getEmailErrorMessage(): string {
    const emailControl = this.email;
    if (emailControl?.hasError('required')) {
      return 'Email is required';
    }
    if (emailControl?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    return '';
  }

  getPasswordErrorMessage(): string {
    const passwordControl = this.password;
    if (passwordControl?.hasError('required')) {
      return 'Password is required';
    }
    if (passwordControl?.hasError('minlength')) {
      return 'Password must be at least 8 characters';
    }
    return '';
  }
}
