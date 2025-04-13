import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactsRoutingModule } from './contacts-routing.module';
import { ContactsPageComponent } from './pages/contacts-page/contacts-page.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ContactsRoutingModule,
    ContactsPageComponent
  ]
})
export class ContactsModule { }
