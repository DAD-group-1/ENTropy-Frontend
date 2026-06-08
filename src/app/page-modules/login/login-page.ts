import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
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
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgmMotionDirective } from '@scripttype/ng-motion';
import { AuthenticationService } from '../../core/data-services';
import { FrontNavigationService } from '../../shared-modules/service/front-navigation.service';
import { finalize } from 'rxjs/operators';
import { FrontAuthService } from '../../shared-modules/service/front-auth.service';
import { ProgressSpinner } from 'primeng/progressspinner';
import { FrontLayoutService } from '../../shared-modules/service/front-layout.service';
import { FrontWebsocketService } from '../../shared-modules/service/front-websocket.service';

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
    NgOptimizedImage,
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage implements OnInit, OnDestroy {
  private readonly frontLayoutService = inject(FrontLayoutService);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly frontNavigationService = inject(FrontNavigationService);
  public readonly frontAuthService = inject(FrontAuthService);
  private readonly frontWebsocketService = inject(FrontWebsocketService);
  private readonly fb = inject(FormBuilder);

  loading = signal<boolean>(false);
  loginError = signal<string>('');

  loginForm!: FormGroup;

  ngOnInit(): void {
    this.frontLayoutService.setLoggedLayout(false);

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    if (this.frontAuthService.loadingLogginYouBackIn())
      setTimeout(() => {
        this.frontNavigationService.navigate('/');
      }, 1000);
  }

  ngOnDestroy() {
    this.frontLayoutService.setLoggedLayout(true);
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
        loginDto: {
          email,
          password,
        },
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.frontAuthService.setTokens(
            response?.data?.access_token ?? '',
            response?.data?.refresh_token,
          );
          this.frontAuthService.updateTokenData();

          this.frontNavigationService.navigate('/');
          this.frontLayoutService.setLoggedLayout(true);
          this.frontAuthService.loadingLogginYouBackIn.set(true);
          this.frontWebsocketService.connect(this.frontAuthService.userId as string);
        },
        error: (err) => {
          this.loginError.set(err?.error?.message || 'Invalid email or password');
        },
      });
  }
}
