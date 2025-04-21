import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, tap} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../dashboard/pages/users/interfaces/user.interface';
import {switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  private imgbbApiKey = '1eef90db341de0e59b09d3c8ee5374df';

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        this.userSubject.next(JSON.parse(savedUser));
      }
    }
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<any>('http://localhost:8080/api/auth/login', {
      username: email,
      password
    }, { withCredentials: true }).pipe(
      tap(res => {
        const user: User = {
          ...res,
          email: res.email
        };
        console.log(user);
        this.setUser(user);
      })
    );
  }

  register(registerData: any): Observable<User> {
    return this.http.post<User>('http://localhost:8080/api/auth/register', registerData, {
      withCredentials: true
    }).pipe(
      tap(user => this.setUser(user))
    );
  }

  autoLogin(): Observable<User> {
    return this.http.get<any>('http://localhost:8080/api/users/current', { withCredentials: true })
      .pipe(
        tap(res => {
          const user: User = {
            ...res,
            email: res.email
          };
          this.setUser(user);
        })
      );
  }

  logout() {
    this.userSubject.next(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  fetchCurrentUser(): Observable<User> {
    return this.http.get<User>('http://localhost:8080/api/users/current', {
      withCredentials: true
    }).pipe(
      tap(user => {
        this.userSubject.next(user);
        localStorage.setItem('user', JSON.stringify(user));
      })
    );
  }

  isAuthenticated(): Observable<boolean> {
    return this.http.get<User>('http://localhost:8080/api/users/current', {
      withCredentials: true
    }).pipe(
      tap(user => {
        this.userSubject.next(user);
        localStorage.setItem('user', JSON.stringify(user));
      }),
      map(() => true),
      catchError(err => {
        this.userSubject.next(null);
        localStorage.removeItem('user');
        return of(false);
      })
    );
  }


  setUser(user: User): void {
    this.userSubject.next(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  uploadImageToImgBB(imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', imageFile);
    return this.http.post(`https://api.imgbb.com/1/upload?key=${this.imgbbApiKey}`, formData);
  }

  saveUserProfileChanges(profile: Partial<User>): Observable<User> {
    const formData = new FormData();
    const avatarUrl = profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.email}`;

    formData.append('email', profile.email || '');
    formData.append('firstName', profile.firstName || '');
    formData.append('lastName', profile.lastName || '');
    formData.append('phone', profile.phone || '');
    formData.append('position', profile.position || '');
    formData.append('department', profile.department || '');
    formData.append('bio', profile.bio || '');
    formData.append('location', profile.location || '');
    formData.append('timezone', profile.timezone || '');

    formData.append('notifyEmail', String(profile.notifications?.email ?? false));
    formData.append('notifyPush', String(profile.notifications?.push ?? false));
    formData.append('notifyTelegram', String(profile.notifications?.telegram ?? false));

    formData.append('avatarUrl', avatarUrl);

    return this.http.put(`http://localhost:8080/api/users/profileUpdate`, formData, {
      withCredentials: true
    }).pipe(
      switchMap(() => this.fetchCurrentUser())
    );
  }


}
