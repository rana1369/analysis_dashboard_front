import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { MessageService } from 'primeng/api';
import { I18nService } from '@shared/services/i18n.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container" [dir]="i18n.getCurrentLanguage() === 'ar' ? 'rtl' : 'ltr'">
      <div class="login-card">
        <div class="login-header">
          <h1>{{ i18n.translate('auth.welcome') }}</h1>
          <p>Rental Management Dashboard</p>
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="username">{{ i18n.translate('auth.username') }}</label>
            <input 
              pInputText 
              id="username" 
              formControlName="username"
              [placeholder]="i18n.translate('auth.username')"
              class="w-full"
            />
            <small class="p-error" *ngIf="loginForm.get('username')?.hasError('required') && loginForm.get('username')?.touched">
              Username is required
            </small>
          </div>

          <div class="form-group">
            <label for="password">{{ i18n.translate('auth.password') }}</label>
            <input 
              pInputText 
              type="password"
              id="password" 
              formControlName="password"
              [placeholder]="i18n.translate('auth.password')"
              class="w-full"
            />
            <small class="p-error" *ngIf="loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched">
              Password is required
            </small>
          </div>

          <button 
            pButton 
            type="submit" 
            label="{{ i18n.translate('auth.login') }}"
            [disabled]="loginForm.invalid || loading"
            class="w-full"
          ></button>
        </form>

        <div class="login-footer">
          <p>Demo: Use 'admin', 'finance', or 'viewer' as username</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1rem;
    }

    .login-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .login-header h1 {
      color: #333;
      margin-bottom: 0.5rem;
    }

    .login-header p {
      color: #666;
      font-size: 0.9rem;
    }

    .login-form {
      margin-bottom: 1rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
      font-weight: 500;
    }

    .login-footer {
      text-align: center;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }

    .login-footer p {
      color: #999;
      font-size: 0.85rem;
    }

    .w-full {
      width: 100%;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  returnUrl = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    public i18n: I18nService
  ) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Login successful'
          });
          this.router.navigate([this.returnUrl]);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Login failed. Please check your credentials.'
          });
          this.loading = false;
        }
      });
    }
  }
}

