import { Injectable } from '@angular/core';
import { Contact } from '../../classes/contact';
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs/Observable';

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
        this.contacts = (<any[]>res).map(item => new Contact(item)).sort((a, b) => {
          if ((a.lastName + a.firstName) < (b.lastName + b.firstName)) return -1;
          if ((a.lastName + a.firstName) > (b.lastName + b.firstName)) return 1;
          return 0;
        });
        obs.next(true);
        obs.complete();
      })
    })
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
      });
    })
  }

}
