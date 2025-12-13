import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  standalone: true,
  template: `
    <main class="main-content">
      <ng-content></ng-content>
    </main>
  `,
  styleUrls: ['./main.sass']
})
export class Main {}
