import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService, AppSettings, ThemeColors } from '../../../core/services/settings/settings.service';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  currentSettings!: AppSettings;
  availableThemes: ThemeColors[] = [];

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    this.settingsService.settings$.subscribe(settings => {
      this.currentSettings = settings;
    });
    this.availableThemes = this.settingsService.availableThemes;
  }

  updateTheme(themeName: string) {
    this.settingsService.updateSettings({ theme: themeName });
  }

  updateLanguage(language: string) {
    this.settingsService.updateSettings({ language });
  }

  toggleAIRecommendations() {
    this.settingsService.updateSettings({
      aiRecommendations: !this.currentSettings.aiRecommendations
    });
  }

  toggle2FA() {
    this.settingsService.updateSettings({
      securitySettings: {
        ...this.currentSettings.securitySettings,
        twoFactorAuth: !this.currentSettings.securitySettings.twoFactorAuth
      }
    });
  }

  updateSessionTimeout(event: Event) {
    const value = +(event.target as HTMLInputElement).value;
    this.settingsService.updateSettings({
      securitySettings: {
        ...this.currentSettings.securitySettings,
        sessionTimeout: value
      }
    });
  }

  updatePasswordExpiration(event: Event) {
    const value = +(event.target as HTMLInputElement).value;
    this.settingsService.updateSettings({
      securitySettings: {
        ...this.currentSettings.securitySettings,
        passwordExpiration: value
      }
    });
  }

  showChangePasswordDialog() {
    // Implement password change dialog
    console.log('Show password change dialog');
  }
}
