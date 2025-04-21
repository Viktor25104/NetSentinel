import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule
} from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-incomplete-profile-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  template: `
    <div class="modal-backdrop">
      <div class="modal-content">
        <h2>Заполните профиль</h2>
        <p>Чтобы продолжить работу, укажите необходимую информацию.</p>

        <form [formGroup]="profileForm" (ngSubmit)="save()" class="profile-form">
          <input formControlName="firstName" placeholder="Имя *">
          <input formControlName="lastName" placeholder="Фамилия *">
          <input formControlName="email" [disabled]="true" placeholder="Email">
          <input formControlName="phone" placeholder="Телефон *">

          <input formControlName="position" placeholder="Должность (необязательно)">
          <input formControlName="department" placeholder="Отдел (необязательно)">
          <input formControlName="location" placeholder="Локация (необязательно)">
          <input formControlName="timezone" placeholder="Часовой пояс (необязательно)">
          <textarea formControlName="bio" placeholder="О себе (необязательно)"></textarea>

          <h3>Смена пароля</h3>
          <input type="password" formControlName="newPassword" placeholder="Новый пароль *">
          <input type="password" formControlName="confirmPassword" placeholder="Повторите пароль *">
          <div *ngIf="profileForm.errors?.notMatch" class="error">Пароли не совпадают</div>

          <button class="cyber-button full" type="submit" [disabled]="profileForm.invalid">Сохранить</button>
          <button class="cyber-button danger full" type="button" (click)="logout()">Выйти из системы</button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.85);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-content {
      background: var(--card-bg, #1f1f1f);
      padding: 2rem;
      border-radius: 10px;
      width: 100%;
      max-width: 450px;
      box-shadow: 0 0 20px rgba(0,0,0,0.5);
      color: #fff;
    }

    .profile-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 1rem;
    }

    input, textarea {
      padding: 10px;
      font-size: 14px;
      border-radius: 6px;
      border: 1px solid #555;
      background: #2a2a2a;
      color: #fff;
    }

    textarea {
      resize: vertical;
      min-height: 60px;
    }

    h3 {
      margin-top: 1rem;
      font-size: 16px;
      color: #ccc;
    }

    .error {
      color: #ff5e5e;
      font-size: 13px;
      margin-top: -5px;
    }

    .cyber-button {
      padding: 10px;
      font-weight: bold;
      background: #0080ff;
      border: none;
      color: white;
      border-radius: 6px;
      cursor: pointer;
      transition: 0.2s ease;
    }

    .cyber-button.full {
      width: 100%;
    }

    .cyber-button:hover {
      background: #005fcc;
    }

    .cyber-button.danger {
      background: #d33;
    }

    .cyber-button.danger:hover {
      background: #b22;
    }
  `]
})
export class IncompleteProfileModalComponent implements OnInit {
  profileForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (!user) return;

      this.profileForm = this.fb.group({
        firstName: [user.firstName, Validators.required],
        lastName: [user.lastName, Validators.required],
        email: [{ value: user.email, disabled: true }, Validators.required],
        phone: [user.phone, Validators.required],
        position: [user.position],
        department: [user.department],
        location: [user.location],
        timezone: [user.timezone],
        bio: [user.bio],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      }, {
        validators: this.passwordsMatchValidator
      });
    });
  }

  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const pass = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { notMatch: true };
  }

  save() {
    if (this.profileForm.invalid) return;

    const data = this.profileForm.getRawValue();
    const profile = {
      ...data,
      avatar: this.authService.currentUser?.avatar
    };

    const passwordPayload = { password: data.newPassword };

    forkJoin([
      this.authService.saveUserProfileChanges(profile),
      this.http.post('http://localhost:8080/api/users/changePassword', passwordPayload)
    ]).subscribe({
      next: () => {
        alert("✅ Готово!");
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        alert("❌ Ошибка: " + err.message);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
