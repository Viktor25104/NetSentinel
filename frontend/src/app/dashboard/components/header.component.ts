import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
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
        <div class="user-profile">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" class="avatar">
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

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      border: 2px solid var(--primary-blue);
    }
  `]
})
export class HeaderComponent {}
