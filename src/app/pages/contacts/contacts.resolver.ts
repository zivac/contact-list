import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ContactsService } from './contacts.service';

@Injectable()
export class ContactsResolver implements Resolve<any> {

  constructor(
    private _contacts: ContactsService
  ) {}

  resolve(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this._contacts.loadContacts();
  }
}
