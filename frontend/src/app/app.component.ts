import { Component, OnInit } from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import { AuthService } from './core/services/auth/auth.service';
import { IncompleteProfileModalComponent } from './dashboard/components/incomplete-profile-modal.component';
import {filter} from 'rxjs';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, IncompleteProfileModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  showIncompleteProfileModal = false;
  title = 'NetSentinel';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.autoLogin();

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => this.checkProfileStatus());

    this.authService.user$.subscribe(() => {
      this.checkProfileStatus();
    });
  }

  private checkProfileStatus() {
    const user = this.authService.currentUser;
    const onProfilePage = this.router.url.includes('/profile');

    const isIncomplete =
      !user?.firstName?.trim() ||
      !user?.lastName?.trim() ||
      !user?.phone?.trim();

    this.showIncompleteProfileModal = !!user && isIncomplete && onProfilePage;
  }
}
