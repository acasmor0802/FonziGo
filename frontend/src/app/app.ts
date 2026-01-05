import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CookieBanner } from './components/cookie-banner/cookie-banner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CookieBanner],
  templateUrl: './app.html',
  styleUrl: './app.sass'
})
export class App {}
