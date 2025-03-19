import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, UserProfile } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
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

  changeAvatar() {
    // Implement avatar change functionality
    console.log('Change avatar');
  }

  saveChanges() {
    this.authService.updateProfile(this.editableUser);
  }

  cancelChanges() {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.editableUser = { ...user };
      }
    });
  }
}
