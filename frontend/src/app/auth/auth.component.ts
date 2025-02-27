import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
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
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      // Шаг 1: Личные данные
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', Validators.required],

      // Шаг 2: Данные компании
      companyName: ['', Validators.required],
      position: ['', Validators.required],

      // Шаг 3: Адрес
      country: ['', Validators.required],
      city: ['', Validators.required]
    });
  }

  setLoginMode(isLogin: boolean) {
    this.isLogin = isLogin;
    if (!isLogin) {
      this.currentStep = 1;
    }
  }

  nextStep() {
    if (this.canProceedToNextStep()) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  canProceedToNextStep(): boolean {
    if (this.currentStep === 1) {
      const step1Controls = ['email', 'password', 'name'];
      return step1Controls.every(control =>
        this.registerForm.get(control)?.valid
      );
    }
    if (this.currentStep === 2) {
      const step2Controls = ['companyName', 'position'];
      return step2Controls.every(control =>
        this.registerForm.get(control)?.valid
      );
    }
    return true;
  }

  onLogin() {
    if (this.loginForm.valid) {
      console.log('Login:', this.loginForm.value);
      this.router.navigate(['/dashboard']);
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      console.log('Register:', this.registerForm.value);
      this.router.navigate(['/dashboard']);
    }
  }

}
