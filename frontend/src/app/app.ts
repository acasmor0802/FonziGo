import { Component, inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CookieBanner } from './components/cookie-banner/cookie-banner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CookieBanner],
  templateUrl: './app.html',
  styleUrl: './app.sass'
})
export class App implements OnInit {
  private document = inject(DOCUMENT);

  ngOnInit(): void {
    this.document.documentElement.lang = 'es';
  }
}
