import { Injectable } from '@angular/core';
import { Contact } from '../../classes/contact';
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

@Injectable()
export class ContactsService {

  public contacts: Contact[]

  public phoneLabels: string[] = ['phone', 'cell', 'home', 'work'];
  public phoneIcons: {[label: string]: string} = {
    phone: 'fa-phone',
    cell: 'fa-mobile-alt',
    home: 'fa-home',
    work: 'fa-building'
  }

  constructor(
    private _api: ApiService
  ) { }

  //loads list of contacts sorted by last name and first name
  loadContacts(): Observable<boolean> {
    return new Observable(obs => {
      this._api.get('contacts').subscribe(res => {
        this.contacts = this.sortContacts((<any[]>res).map(item => new Contact(item)));
        obs.next(true);
        obs.complete();
      }, err => {
        obs.error(err);
        obs.complete();
      })
    })
  }

  //sort contact alphabetically
  sortContacts(contacts: Contact[]) {
    return contacts.sort((a, b) => {
      if ((a.lastName.toLowerCase() + a.firstName.toLowerCase()) < (b.lastName.toLowerCase() + b.firstName.toLowerCase())) return -1;
      if ((a.lastName.toLowerCase() + a.firstName.toLowerCase()) > (b.lastName.toLowerCase() + b.firstName.toLowerCase())) return 1;
      return 0;
    });
  }

  //adds or removes contact from favourites
  toggleFavourite(contact: Contact, favourite: boolean) {
    if(favourite) return this._api.post('favourites/' + contact.id, {});
    else return this._api.delete('favourites/' + contact.id);
  }

  //deletes contact from list
  deleteContact(id: number) {
    return new Observable(obs => {
      this._api.delete('contacts/' + id).subscribe(res => {
        let contact = this.contacts.find(contact => contact.id == id);
        if(contact) this.contacts.splice(this.contacts.indexOf(contact), 1);
        obs.next({success: true});
        obs.complete();
      }, err => {
        obs.error(err);
        obs.complete();
      });
    })
  }

  //create new contact
  createContact(values: any): Observable<Contact> {
    return new Observable(obs => {
      this._api.post('contacts', values).subscribe(res => {
        let contact = new Contact(_.extend(values, { id: res['id'] }));
        this.contacts.push(contact);
        this.contacts = this.sortContacts(this.contacts);
        obs.next(contact);
        obs.complete();
      }, err => {
        obs.error(err);
        obs.complete();
      })
    })
  }

  //update existing contact
  updateContact(contact: Contact, values: any): Observable<Contact> {
    return new Observable(obs => {
      this._api.post('contacts/' + contact.id, values).subscribe(res => {
        _.assign(contact, values);
        obs.next(contact);
        obs.complete();
      }, err => {
        obs.error(err);
        obs.complete();
      })
    })
  }

}
