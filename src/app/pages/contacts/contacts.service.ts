import { Injectable } from '@angular/core';
import { Contact } from '../../interfaces/contact';
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ContactsService {

  contacts: Contact[]

  constructor(
    private _api: ApiService
  ) { }

  loadContacts(): Observable<boolean> {
    return new Observable(obs => {
      this._api.get('contacts').subscribe(res => {
        this.contacts = (<Contact[]> res).sort((a, b) => {
          if ((a.lastName + a.firstName) < (b.lastName + b.firstName)) return -1;
          if ((a.lastName + a.firstName) > (b.lastName + b.firstName)) return 1;
          return 0;
        });
        obs.next(true);
        obs.complete();
      })
    })
  }

}
