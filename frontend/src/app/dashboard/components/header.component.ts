import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { User} from '../pages/users/interfaces/user.interface';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="header">
      <div class="header-left">
        <h1 class="logo">Net Sentinel</h1>
      </div>
      <div class="header-right">
        <div class="search-bar">
          <input type="text" placeholder="Поиск..." class="cyber-input">
        </div>
        <div class="notifications">
          <span class="notification-badge">3</span>
          <i class="notification-icon">🔔</i>
        </div>
        <div class="user-profile" (click)="toggleProfileMenu()" #profileMenu>
          <img [src]="user?.avatar" [alt]="user?.firstName" class="avatar">

          <!-- Выпадающее меню профиля -->
          <div class="profile-menu" *ngIf="isProfileMenuOpen">
            <div class="menu-header">
              <img [src]="user?.avatar" [alt]="user?.firstName" class="menu-avatar">
              <div class="user-info">
                <div class="user-name">{{ user?.firstName }} {{ user?.lastName }}</div>
                <div class="user-email">{{ user?.email }}</div>
              </div>
            </div>
            <div class="menu-items">
              <a class="menu-item" routerLink="/dashboard/profile">
                <i>👤</i>
                <span>Мой профиль</span>
              </a>
              <a class="menu-item" routerLink="/dashboard/settings">
                <i>⚙️</i>
                <span>Настройки</span>
              </a>
              <button class="menu-item" (click)="showLogoutConfirmation()">
                <i>🚪</i>
                <span>Выйти</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Модальное окно подтверждения выхода -->
        <div class="modal-overlay" *ngIf="showLogoutModal" (click)="cancelLogout()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <h2>Подтверждение выхода</h2>
            <p>Вы действительно хотите выйти из системы?</p>
            <div class="modal-actions">
              <button class="cyber-button" (click)="cancelLogout()">Отмена</button>
              <button class="cyber-button warning" (click)="logout()">Выйти</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      height: 64px;
      background: var(--card-bg);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      position: relative;
    }

    .logo {
      color: var(--primary-blue);
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .search-bar {
      position: relative;
    }

    .search-bar input {
      width: 300px;
      padding-left: 2.5rem;
    }

    .notifications {
      position: relative;
      cursor: pointer;
    }

    .notification-badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background: var(--accent-red);
      color: white;
      border-radius: 50%;
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
    }

    .notification-icon {
      font-size: 1.5rem;
    }

    .user-profile {
      position: relative;
      cursor: pointer;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid var(--primary-blue);
      transition: transform 0.3s ease;
    }

    .avatar:hover {
      transform: scale(1.05);
    }

    .profile-menu {
      position: absolute;
      top: calc(100% + 1rem);
      right: 0;
      width: 280px;
      background: var(--card-bg);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
      z-index: 1000;
      overflow: hidden;
    }

    .menu-header {
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.05);
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .menu-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 2px solid var(--primary-blue);
    }

    .user-info {
      flex: 1;
    }

    .user-name {
      color: #fff;
      font-weight: 500;
      margin-bottom: 0.25rem;
    }

    .user-email {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9rem;
    }

    .menu-items {
      padding: 0.5rem;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1rem;
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.3s ease;
      cursor: pointer;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      font: inherit;
    }

    .menu-item:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .menu-item i {
      font-size: 1.25rem;
    }

    /* Модальное окно */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
    }

    .modal-content {
      background: var(--card-bg);
      padding: 2rem;
      border-radius: 12px;
      width: 100%;
      max-width: 400px;
      text-align: center;
    }

    .modal-content h2 {
      margin: 0 0 1rem 0;
      color: #fff;
    }

    .modal-content p {
      margin: 0 0 2rem 0;
      color: rgba(255, 255, 255, 0.7);
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .cyber-button.warning {
      background: rgba(255, 77, 77, 0.1);
      color: var(--accent-red);
    }

    @media (max-width: 768px) {
      .header {
        padding: 0 1rem;
      }

      .search-bar {
        display: none;
      }

      .header-right {
        gap: 1rem;
      }
    }
  `]
})
export class HeaderComponent {
  user: User | null = null;
  isProfileMenuOpen = false;
  showLogoutModal = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  showLogoutConfirmation() {
    this.isProfileMenuOpen = false;
    this.showLogoutModal = true;
  }

  cancelLogout() {
    this.showLogoutModal = false;
  }

  logout() {
    this.authService.logout();
    this.showLogoutModal = false;
    this.router.navigate(['/auth']);
  }
}
