import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactsComponent } from './contacts.component';
import { ContactsResolver } from './contacts.resolver';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { ContactEditComponent } from './contact-edit/contact-edit.component';
import { ContactResolver } from './contact.resolver';

const routes: Routes = [
  {
    path: '', component: ContactsComponent, resolve: {contacts: ContactsResolver},
    children: [
      {
        path: '',
        component: ContactListComponent,
        data: {page: 'list'}
      },
      {
        resolve: {contact: ContactResolver},
        path: 'view/:id',
        component: ContactDetailsComponent,
        data: { page: 'details' }
      },
      {
        resolve: { contact: ContactResolver },
        path: 'edit/:id',
        component: ContactEditComponent,
        data: { page: 'edit' }
      },
      {
        path: 'create',
        component: ContactEditComponent,
        data: { page: 'edit' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactsRoutingModule { }
