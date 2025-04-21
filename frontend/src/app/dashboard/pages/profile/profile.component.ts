import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';
import { User } from '../users/interfaces/user.interface';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  editableForm!: FormGroup;
  passwordForm!: FormGroup;

  avatarUrl = '';
  loading = false;

  user!: User;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {

  }

  ngOnInit() {
    this.authService.fetchCurrentUser().subscribe({
      next: rawUser => {
        const raw = rawUser as any;

        const user: User = {
          ...raw,
          notifications: {
            email: raw.notifyEmail ?? false,
            push: raw.notifyPush ?? false,
            telegram: raw.notifyTelegram ?? false
          }
        };

        this.avatarUrl = user.avatar || this.generateDefaultAvatar(user.email);

        this.editableForm = this.fb.group({
          firstName: [user.firstName, Validators.required],
          lastName: [user.lastName, Validators.required],
          email: [user.email, [Validators.required, Validators.email]],
          phone: [user.phone, Validators.required],
          position: [user.position, Validators.required],
          department: [user.department, Validators.required],
          location: [user.location],
          timezone: [user.timezone],
          joinDate: [user.joinDate],
          bio: [user.bio],
          notifications: this.fb.group({
            email: [user.notifications.email],
            push: [user.notifications.push],
            telegram: [user.notifications.telegram]
          })
        });

        // 🔐 Создаём форму для смены пароля
        this.passwordForm = this.fb.group({
          oldPassword: ['', [Validators.required, Validators.minLength(6)]],
          newPassword: ['', [Validators.required, Validators.minLength(6)]],
          confirmPassword: ['', Validators.required]
        }, { validators: this.passwordsMatchValidator });
      },
      error: err => console.error('❌ Ошибка загрузки профиля:', err)
    });
  }

  submitPasswordChange() {
    if (this.passwordForm.invalid) return;

    const { oldPassword, newPassword } = this.passwordForm.value;

    this.http.post('http://localhost:8080/api/users/changePasswordWithCheck', {
      oldPassword,
      newPassword
    }, {
      withCredentials: true
    }).subscribe({
      next: () => {
        alert('✅ Пароль успешно изменён!');
        this.passwordForm.reset();
      },
      error: err => {
        alert('❌ Ошибка смены пароля: ' + (err.error?.message || err.message));
      }
    });
  }


  passwordsMatchValidator(group: FormGroup): { notMatch: true } | null {
    const newPass = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return newPass === confirm ? null : { notMatch: true };
  }


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.loading = true;

      this.authService.uploadImageToImgBB(file).subscribe({
        next: res => {
          const url = res.data.url;
          this.avatarUrl = url;
          this.loading = false;
        },
        error: err => {
          console.error('❌ Ошибка загрузки изображения:', err);
          alert('Ошибка загрузки изображения');
          this.loading = false;
        }
      });
    }
  }

  saveChanges() {
    if (!this.editableForm.valid) {
      alert('Пожалуйста, заполните обязательные поля');
      return;
    }

    const formValue = this.editableForm.value;
    const updatedUser: Partial<User> = {
      ...formValue,
      avatar: this.avatarUrl
    };

    this.authService.saveUserProfileChanges(updatedUser).subscribe({
      next: () => {
        this.authService.fetchCurrentUser().subscribe(); // Обновляем в памяти
        alert('✅ Профиль обновлён!');
      },
      error: err => {
        console.error('❌ Ошибка сохранения:', err);
        alert('Ошибка при сохранении профиля');
      }
    });
  }

  cancelChanges() {
    this.ngOnInit(); // Просто перезагрузим данные заново
  }

  private generateDefaultAvatar(email: string): string {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`;
  }

  get notificationsGroup(): FormGroup {
    return this.editableForm.get('notifications') as FormGroup;
  }


  protected readonly formatDate = formatDate;
  protected readonly FormGroup = FormGroup;
}
