import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    Header,
    Footer
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.sass']
})
export class HomePage {
  private authService = inject(AuthService);
  
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
