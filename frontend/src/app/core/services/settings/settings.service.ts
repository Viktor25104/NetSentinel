import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ThemeColors {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

export interface AppSettings {
  theme: string;
  language: string;
  aiRecommendations: boolean;
  securitySettings: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordExpiration: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly SETTINGS_KEY = 'app_settings';

  private themes: ThemeColors[] = [
    {
      name: 'default',
      primary: '#00f3ff',
      secondary: '#9d00ff',
      accent: '#00ff9d',
      background: '#0a0a12'
    },
    {
      name: 'dark-blue',
      primary: '#0066ff',
      secondary: '#00ffff',
      accent: '#ff00ff',
      background: '#000033'
    },
    {
      name: 'cyberpunk',
      primary: '#ff0066',
      secondary: '#00ff66',
      accent: '#ffff00',
      background: '#1a0033'
    }
  ];

  private defaultSettings: AppSettings = {
    theme: 'default',
    language: 'ru',
    aiRecommendations: true,
    securitySettings: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiration: 90
    }
  };

  private settingsSubject = new BehaviorSubject<AppSettings>(this.loadSettings());
  settings$ = this.settingsSubject.asObservable();

  constructor() {
    this.applyTheme(this.currentSettings.theme);
  }

  get currentSettings(): AppSettings {
    return this.settingsSubject.value;
  }

  get availableThemes(): ThemeColors[] {
    return this.themes;
  }

  updateSettings(settings: Partial<AppSettings>) {
    const newSettings = { ...this.currentSettings, ...settings };
    this.settingsSubject.next(newSettings);
    this.saveSettings(newSettings);

    if (settings.theme) {
      this.applyTheme(settings.theme);
    }
  }

  private loadSettings(): AppSettings {
    const savedSettings = localStorage.getItem(this.SETTINGS_KEY);
    return savedSettings ? { ...this.defaultSettings, ...JSON.parse(savedSettings) } : this.defaultSettings;
  }

  private saveSettings(settings: AppSettings) {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
  }

  private applyTheme(themeName: string) {
    const theme = this.themes.find(t => t.name === themeName);
    if (!theme) return;

    document.documentElement.style.setProperty('--primary-blue', theme.primary);
    document.documentElement.style.setProperty('--primary-purple', theme.secondary);
    document.documentElement.style.setProperty('--accent-green', theme.accent);
    document.documentElement.style.setProperty('--dark-bg', theme.background);
  }
}
