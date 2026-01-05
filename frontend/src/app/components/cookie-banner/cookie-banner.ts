import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cookie-banner.html',
  styleUrls: ['./cookie-banner.sass']
})
export class CookieBanner implements OnInit {
  private readonly COOKIE_KEY = 'cookies_accepted';
  showBanner = signal(false);
  showDetails = signal(false);

  ngOnInit(): void {
    const accepted = localStorage.getItem(this.COOKIE_KEY);
    if (!accepted) {
      this.showBanner.set(true);
    }
  }

  acceptAll(): void {
    this.saveCookiePreferences({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    });
    this.showBanner.set(false);
  }

  acceptNecessary(): void {
    this.saveCookiePreferences({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    });
    this.showBanner.set(false);
  }

  toggleDetails(): void {
    this.showDetails.update(v => !v);
  }

  private saveCookiePreferences(preferences: object): void {
    localStorage.setItem(this.COOKIE_KEY, JSON.stringify({
      ...preferences,
      timestamp: new Date().toISOString()
    }));
  }
}
