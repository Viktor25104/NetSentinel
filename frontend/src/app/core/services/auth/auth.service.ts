import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
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
  private sessionId: string | null = null
  private imgbbApiKey = '1eef90db341de0e59b09d3c8ee5374df';

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        this.userSubject.next(JSON.parse(savedUser));
      }
    }
  }

  login(email: string, password: string) {
    return this.http.post<any>(
      'http://localhost:8080/api/auth/login',
      { username: email, password },
      { observe: 'response', withCredentials: true }
    ).pipe(
      map(response => {
        const res = response.body;

        const user: UserProfile = {
          id: res.userId,
          firstName: res.firstName || '',
          lastName: res.lastName || '',
          email: res.username,
          position: res.position || '',
          department: res.department || '',
          avatar: res.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${res.username}`,
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
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(user));
        }

        // Сохраняем JSESSIONID из Set-Cookie (если доступно)
        const cookieHeader = response.headers.get('set-cookie');
        if (cookieHeader) {
          const match = cookieHeader.match(/JSESSIONID=([^;]+)/);
          if (match) {
            this.sessionId = match[1];
            console.log('🧠 JSESSIONID сохранён:', this.sessionId);
          }
        }

        return user;
      })
    );
  }

  logout() {
    this.userSubject.next(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
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
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(user));
          }

          return user;
        })
      );
  }

  refreshUserProfile(userId: string): Observable<UserProfile> {
    console.log('📡 Получаем профиль по ID:', userId);

    return this.http.get<any>(`http://localhost:8080/api/users/${userId}`).pipe(
      map(res => {
        const updatedUser: UserProfile = {
          id: res.userId,
          firstName: res.firstName || '',
          lastName: res.lastName || '',
          email: res.email,
          position: res.position || '',
          department: res.department || '',
          avatar: res.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${res.email}`,
          phone: res.phone || '',
          location: res.location || '',
          timezone: res.timezone || 'Europe/Moscow',
          bio: res.bio || '',
          joinDate: new Date().toISOString(),
          notifications: {
            email: res.notifyEmail,
            push: res.notifyPush,
            telegram: res.notifyTelegram
          }
        };

        console.log('📥 Профиль получен с сервера:', updatedUser);

        this.userSubject.next(updatedUser);

        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(updatedUser));
          console.log('💾 Профиль сохранён в localStorage');
        }

        return updatedUser;
      })
    );
  }


  uploadImageToImgBB(imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', imageFile);

    return this.http.post(`https://api.imgbb.com/1/upload?key=${this.imgbbApiKey}`, formData);
  }

  saveUserProfileChanges(profile: Partial<UserProfile>) {
    const formData = new FormData();
    formData.append('firstName', profile.firstName || '');
    formData.append('lastName', profile.lastName || '');
    formData.append('phone', profile.phone || '');
    formData.append('position', profile.position || '');
    formData.append('department', profile.department || '');
    formData.append('bio', profile.bio || '');
    formData.append('location', profile.location || '');
    formData.append('timezone', profile.timezone || '');
    formData.append('notifyEmail', String(profile.notifications?.email || false));
    formData.append('notifyPush', String(profile.notifications?.push || false));
    formData.append('notifyTelegram', String(profile.notifications?.telegram || false));
    formData.append('avatarUrl', profile.avatar || '');

    return this.http.put(`http://localhost:8080/api/users/${profile.id}/profile`, formData);
  }

  get currentUser(): UserProfile | null {
    return this.userSubject.value
  }

  getSessionId(): string | null {
    return this.sessionId;
  }

  isAuthenticated(): boolean {
    return !!this.userSubject.value;
  }
}
