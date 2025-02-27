import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
  private userSubject = new BehaviorSubject<UserProfile | null>({
    id: '1',
    firstName: 'Александр',
    lastName: 'Иванов',
    email: 'a.ivanov@company.com',
    position: 'DevOps Engineer',
    department: 'IT',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    phone: '+7 (999) 123-45-67',
    location: 'Москва',
    timezone: 'Europe/Moscow',
    bio: 'DevOps инженер с 5-летним опытом работы. Специализируюсь на автоматизации и оптимизации инфраструктуры.',
    joinDate: '2023-01-15',
    notifications: {
      email: true,
      push: true,
      telegram: false
    }
  });

  user$ = this.userSubject.asObservable();

  updateProfile(profile: Partial<UserProfile>) {
    const currentUser = this.userSubject.value;
    if (currentUser) {
      this.userSubject.next({ ...currentUser, ...profile });
    }
  }

  logout() {
    // Implement actual logout logic here
    this.userSubject.next(null);
  }
}
