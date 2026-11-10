import { Component, OnInit } from '@angular/core';
import { ApiDriverService } from '../../services/api-driver.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-driver-settings',
  templateUrl: './driver-settings.component.html',
  styleUrls: ['./driver-settings.component.scss']
})
export class DriverSettingsComponent implements OnInit {
  notificationEmail = true;
  notificationSms = false;
  timezone = 'UTC';
  preferredLanguage = 'English';
  userName = this.auth.getUser()?.name ?? 'Driver';
  username = this.auth.getUser()?.username ?? '';
  saving = false;

  constructor(private auth: AuthService, private apiDriverService: ApiDriverService) {}

  ngOnInit(): void {
    this.apiDriverService.getDriverPreferences().subscribe(preferences => {
      this.timezone = preferences.timezone;
      this.preferredLanguage = preferences.language === 'en' ? 'English' : preferences.language;
      this.notificationEmail = preferences.notificationMethod === 'EMAIL';
    });
  }

  saveSettings(): void {
    this.saving = true;
    this.apiDriverService.updateDriverPreferences({
      language: this.preferredLanguage === 'English' ? 'en' : this.preferredLanguage,
      timezone: this.timezone,
      notificationMethod: this.notificationEmail ? 'EMAIL' : 'SMS'
    }).subscribe(() => {
      this.saving = false;
    });
  }
}
