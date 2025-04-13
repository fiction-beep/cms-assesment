import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'contacts',
    pathMatch: 'full'
  },
  {
    path: 'contacts',
    loadChildren: () => import('./features/contacts/contacts.module').then(m => m.ContactsModule)
  },
  {
    path: '**',
    redirectTo: 'contacts'
  }
];
