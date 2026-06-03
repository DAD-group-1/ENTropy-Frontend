import { Component, inject, OnInit, signal } from '@angular/core';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgmMotionDirective } from '@scripttype/ng-motion';
import { AuthenticationService } from '../../core/data-services';
import { NavigationService } from '../../shared-modules/service/navigation.service';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../shared-modules/service/auth.service';
import { ProgressSpinner } from 'primeng/progressspinner';

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
    ProgressSpinner,
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly navigationService = inject(NavigationService);
  private readonly fb = inject(FormBuilder);

  loading = signal<boolean>(false);
  loginError = signal<string>('');

  loadingLogginYouBackIn = signal<boolean>(true);

  loginForm!: FormGroup;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.authService.isLoggedVerified().subscribe((isVerified) => {
      if (isVerified)
        setTimeout(() => {
          this.navigationService.navigate('/');
        }, 1000);
      else {
        this.loadingLogginYouBackIn.set(false);
      }
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

  onSubmit(): void {
    if (this.loginForm.invalid || this.loading()) return;

    this.loading.set(true);
    this.loginError.set('');

    const { email, password } = this.loginForm.value;

    this.authenticationService
      .authenticationLogin({
        email,
        password,
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.authService.setTokens(response?.data?.access_token, response?.data?.refresh_token);
          this.authService.updateTokenData();

          this.navigationService.navigate('/');
        },
        error: (err) => {
          this.loginError.set(err?.error?.message || 'Invalid email or password');
        },
      });
  }
}
