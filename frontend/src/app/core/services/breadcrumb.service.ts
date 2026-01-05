import { Injectable, inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

export interface Breadcrumb {
  label: string;
  url: string;
}

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);
  readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const breadcrumbs: Breadcrumb[] = [];
        this.buildCrumbs(this.route.root, '', breadcrumbs);
        this._breadcrumbs$.next(breadcrumbs);
      });
  }

  private buildCrumbs(route: ActivatedRoute, url: string, crumbs: Breadcrumb[]): void {
    const children = route.children;
    if (!children || !children.length) return;

    for (const child of children) {
      const routeURL = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL) {
        url += `/${routeURL}`;
        const label = child.snapshot.data['breadcrumb'] as string | undefined;
        if (label) {
          crumbs.push({ label, url });
        }
      }
      this.buildCrumbs(child, url, crumbs);
    }
  }
}
