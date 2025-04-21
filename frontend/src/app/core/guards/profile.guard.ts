import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class ProfileCompletionGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    const user = this.auth.currentUser;

    const isIncomplete = !user?.firstName?.trim()
      || !user?.lastName?.trim()
      || !user?.phone?.trim();

    return isIncomplete
      ? this.router.parseUrl('/dashboard/profile') // редирект на профиль
      : true;
  }
}
