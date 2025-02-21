import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <nav class="sidebar-nav">
        <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
          <i>🏠</i>
          <span>Обзор</span>
        </a>
        <a routerLink="/dashboard/servers" routerLinkActive="active" class="nav-item">
          <i>🖥️</i>
          <span>Серверы</span>
        </a>
        <a routerLink="/dashboard/users" routerLinkActive="active" class="nav-item">
          <i>👥</i>
          <span>Пользователи</span>
        </a>
        <a routerLink="/dashboard/network" routerLinkActive="active" class="nav-item">
          <i>📊</i>
          <span>Сеть</span>
        </a>
        <a routerLink="/dashboard/advices" routerLinkActive="active" class="nav-item">
          <i>🤖</i>
          <span>AI Советы</span>
        </a>
        <a routerLink="/dashboard/settings" routerLinkActive="active" class="nav-item">
          <i>⚙️</i>
          <span>Настройки</span>
        </a>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 240px;
      height: 100vh;
      background: var(--card-bg);
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      padding: 1rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.1);
      color: var(--primary-blue);
    }

    .nav-item.active {
      background: rgba(0, 243, 255, 0.1);
      color: var(--primary-blue);
    }

    .nav-item i {
      font-size: 1.25rem;
    }
  `]
})
export class SidebarComponent {}
