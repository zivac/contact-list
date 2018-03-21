import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactsRoutingModule } from './contacts-routing.module';
import { ContactsComponent } from './contacts.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { ContactEditComponent } from './contact-edit/contact-edit.component';
import { ContactsService } from './contacts.service';
import { ContactsResolver } from './contacts.resolver';
import { ContactResolver } from './contact.resolver';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvatarComponent } from '../../components/avatar/avatar.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ContactsRoutingModule
  ],
  declarations: [
    ContactsComponent,
    ContactListComponent,
    ContactDetailsComponent,
    ContactEditComponent,
    AvatarComponent
  ],
  providers: [
    ContactsService,
    ContactsResolver, 
    ContactResolver
  ]
})
export class ContactsModule { }
