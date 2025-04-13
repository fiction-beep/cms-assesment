import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'contact-management-app';
}

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  emailAddresses: string[];
  phone: string;
  company?: string;
}

export interface ContactResponse {
  data: Contact[];
  total: number;
}
