import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, UserProfile } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  avatarUrl: string = '';
  editableUser: UserProfile = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    department: '',
    avatar: '',
    phone: '',
    location: '',
    timezone: '',
    bio: '',
    joinDate: new Date().toISOString(),
    notifications: {
      email: false,
      push: false,
      telegram: false
    }
  };

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.editableUser = { ...user };
        this.avatarUrl = user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`;
      }
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.authService.uploadImageToImgBB(file).subscribe({
        next: res => {
          const url = res.data.url;
          this.editableUser.avatar = url;
          this.avatarUrl = url;
        },
        error: err => {
          console.error('Ошибка загрузки изображения:', err);
          alert('Ошибка загрузки изображения');
        }
      });
    }
  }

  saveChanges() {
    if (this.avatarUrl !== `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.editableUser.email}`) {
      this.editableUser.avatar = this.avatarUrl;
    }

    this.authService.saveUserProfileChanges(this.editableUser).subscribe({
      next: (res) => {
        console.log('✅ Сервер ответил:', res);

        this.authService.refreshUserProfile(this.editableUser.id).subscribe({
          next: (refreshedUser) => {
            console.log('🔄 Обновлённый профиль:', refreshedUser);
            alert('Изменения сохранены!');
          },
          error: (refreshErr) => {
            console.error('❌ Ошибка при получении обновлённого профиля:', refreshErr);
          }
        });
      },
      error: (err) => {
        console.error('❌ Ошибка при сохранении профиля:', err);

        if (err.status === 200) {
          console.warn('⚠️ Ответ 200, но Angular думает, что это ошибка — продолжаем как OK.');
          this.authService.refreshUserProfile(this.editableUser.id).subscribe({
            next: () => alert('Изменения сохранены! (восстановление после сбоя)'),
            error: () => alert('Ошибка при получении данных после сохранения')
          });
        } else {
          alert('Ошибка при сохранении профиля');
        }
      }
    });
  }




  cancelChanges() {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.editableUser = { ...user };
        this.avatarUrl = user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`;
      }
    });
  }
}
