import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  avatar: string;
  phone: string;
  location: string;
  timezone: string;
  bio: string;
  joinDate: string;
  notifications: {
    email: boolean;
    push: boolean;
    telegram: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<UserProfile | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.userSubject.next(JSON.parse(savedUser));
    }
  }

  login(email: string, password: string) {
    return this.http.post<any>('http://localhost:8080/api/auth/login', { username: email, password })
      .pipe(
        // Автоматически сохраняем и пушим юзера в поток
        map(res => {
          const user: UserProfile = {
            id: res.userId,
            firstName: res.firstName || '',
            lastName: res.lastName || '',
            email: res.username,
            position: res.position || '',
            department: res.department || '',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${res.username}`,
            phone: '',
            location: '',
            timezone: 'Europe/Moscow',
            bio: '',
            joinDate: new Date().toISOString(),
            notifications: {
              email: true,
              push: false,
              telegram: false
            }
          };
          this.userSubject.next(user);
          localStorage.setItem('user', JSON.stringify(user));
          return user;
        })
      );
  }


  logout() {
    this.userSubject.next(null);
    localStorage.removeItem('user');
  }

  register(registerData: any): Observable<UserProfile> {
    return this.http.post<any>('http://localhost:8080/api/auth/register', registerData)
      .pipe(
        map(res => {
          const user: UserProfile = {
            id: res.userId,
            firstName: registerData.name,
            lastName: registerData.lastName,
            email: registerData.email,
            position: registerData.position,
            department: registerData.department,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${registerData.email}`,
            phone: registerData.phone,
            location: `${registerData.country}, ${registerData.city}, ${registerData.street}, офис: ${registerData.office}, ${registerData.postalCode}`,
            timezone: 'Europe/Moscow',
            bio: '',
            joinDate: new Date().toISOString(),
            notifications: {
              email: true,
              push: false,
              telegram: false
            }
          };

          this.userSubject.next(user);
          localStorage.setItem('user', JSON.stringify(user));
          return user;
        })
      );
  }

  updateProfile(profile: Partial<UserProfile>) {
    const current = this.userSubject.value;
    if (current) {
      const updated = { ...current, ...profile };
      this.userSubject.next(updated);
      localStorage.setItem('user', JSON.stringify(updated));
    }
  }

  get currentUser(): UserProfile | null {
    return this.userSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.userSubject.value;
  }
}
