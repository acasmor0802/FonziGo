import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer, BreadcrumbComponent],
  templateUrl: './privacy.html',
  styleUrls: ['./privacy.sass']
})
export class PrivacyPage {
  lastUpdated = '5 de enero de 2026';
}
