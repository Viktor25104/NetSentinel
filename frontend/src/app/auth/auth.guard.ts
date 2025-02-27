import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate() {
    const { data: { session } } = await this.authService.getSession();

    if (!session) {
      this.router.navigate(['/auth']);
      return false;
    }

    return true;
  }
}
