import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';

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
export class HomePage {}
