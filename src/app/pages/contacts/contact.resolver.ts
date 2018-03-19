import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Contact } from '../../interfaces/contact';
import { ContactsService } from './contacts.service';

@Injectable()
export class ContactResolver implements Resolve<Contact> {

  constructor(
    private _contacts: ContactsService
  ) {}

  resolve(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Contact {
      return this._contacts.contacts.find(contact => contact.id == parseInt(next.params.id));
  }
}
