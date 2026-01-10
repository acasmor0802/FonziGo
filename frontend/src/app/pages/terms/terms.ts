import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer, BreadcrumbComponent],
  templateUrl: './terms.html',
  styleUrls: ['./terms.sass']
})
export class TermsPage {
  lastUpdated = '5 de enero de 2026';
}
