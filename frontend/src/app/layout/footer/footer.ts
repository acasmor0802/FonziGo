import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.sass']
})
export class Footer {
  readonly currentYear = new Date().getFullYear();
}
