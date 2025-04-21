import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth/auth.service';
import { User } from '../dashboard/pages/users/interfaces/user.interface';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('0.5s ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.5s ease-in', style({ transform: 'translateX(-100%)', opacity: 0 }))
      ])
    ])
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  isLogin = true;
  currentStep = 1;

  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      // Шаг 1
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],

      // Шаг 2
      companyName: ['', Validators.required],
      position: ['', Validators.required],
      department: ['', Validators.required],
      companyWebsite: ['', Validators.required],

      // Шаг 3
      country: ['', Validators.required],
      city: ['', Validators.required],
      street: ['', Validators.required],
      postalCode: ['', Validators.required],
      office: ['']
    });
  }

  setLoginMode(isLogin: boolean) {
    this.isLogin = isLogin;
    if (!isLogin) this.currentStep = 1;
  }

  nextStep() {
    if (this.canProceedToNextStep()) this.currentStep++;
  }

  previousStep() {
    if (this.currentStep > 1) this.currentStep--;
  }

  canProceedToNextStep(): boolean {
    const controls = {
      1: ['email', 'password', 'name', 'lastName', 'phone'],
      2: ['companyName', 'position', 'department', 'companyWebsite']
    }[this.currentStep];

    return controls?.every(c => this.registerForm.get(c)?.valid) ?? true;
  }

  onLogin() {
    if (!this.loginForm.valid) return;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (user: User) => {
        if (user) this.router.navigate(['/dashboard']);
      },
      error: err => {
        console.error('❌ Ошибка входа:', err);
        alert('Ошибка входа: ' + (err.error?.message || 'Попробуйте снова'));
      }
    });
  }

  onRegister() {
    if (!this.registerForm.valid) return;

    const registerData = this.registerForm.value;

    this.authService.register(registerData).subscribe({
      next: (user: User) => {
        if (user) this.router.navigate(['/dashboard']);
      },
      error: err => {
        console.error('❌ Ошибка регистрации:', err);
        alert('Ошибка регистрации: ' + (err.error?.message || 'Попробуйте снова'));
      }
    });
  }
}
