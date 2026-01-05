import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadcrumbService, Breadcrumb } from '../../core/services/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="breadcrumb" aria-label="Ruta de navegación" *ngIf="breadcrumbs.length > 0">
      <ol class="breadcrumb__list">
        <li class="breadcrumb__item">
          <a routerLink="/" class="breadcrumb__link">Inicio</a>
        </li>
        @for (crumb of breadcrumbs; track crumb.url; let last = $last) {
          <li class="breadcrumb__item" [class.breadcrumb__item--active]="last">
            <span class="breadcrumb__separator">›</span>
            @if (!last) {
              <a [routerLink]="crumb.url" class="breadcrumb__link">{{ crumb.label }}</a>
            } @else {
              <span class="breadcrumb__current" aria-current="page">{{ crumb.label }}</span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styleUrl: './breadcrumb.sass'
})
export class BreadcrumbComponent implements OnInit {
  private breadcrumbService = inject(BreadcrumbService);
  breadcrumbs: Breadcrumb[] = [];

  ngOnInit(): void {
    this.breadcrumbService.breadcrumbs$.subscribe(crumbs => {
      this.breadcrumbs = crumbs;
    });
  }
}
