import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { StorageService } from './storage.service';
import { Contact } from '../classes/contact';
import * as _ from 'lodash';

@Injectable()
export class MockHttpClient {

  numContacts = 200;

  constructor(
    private _http: HttpClient,
    private _storage: StorageService
  ) { }

  request(method: 'GET' | 'POST' | 'DELETE', url: string, data?: any) {
    switch(method) {
      case 'GET':
        return this.get(url);
      case 'POST':
        return this.post(url, data);
      case 'DELETE':
        return this.delete(url);
    }
  }

  get(url: string, options?: any): Observable<Object> {
    return new Observable(obs => {
      switch(url) {

        //get contact list
        case 'contacts':
          let data = this._storage.get('savedData');
          let seed = data ? data.seed || "" : "";
          let favourites = data ? data.favourites || [] : [];
          let deleted = data ? data.deleted || [] : [];
          let contacts = data ? data.contacts || [] : [];
          this._http.get('https://randomuser.me/api/?results='+this.numContacts+'&seed='+seed).subscribe(
            res => {
              this._storage.update('savedData', {seed: res['info'].seed});
              obs.next(
                res['results'].map((user, index) => {
                  if(deleted.indexOf(index + 1) != -1) return null;
                  return new Contact(_.extend({
                    id: index + 1,
                    firstName: user.name.first,
                    lastName: user.name.last,
                    profilePhoto: user.picture.large,
                    email: user.email,
                    favourite: favourites.indexOf(index + 1) != -1,
                    phones: [
                      {
                        name: `${user.name.first}'s phone`,
                        label: 'phone',
                        number: user.phone
                      },
                      {
                        name: `${user.name.first}'s cell`,
                        label: 'cell',
                        number: user.cell
                      }
                    ]
                  }, contacts.find(contact => contact.id == index + 1)))
                })
                .filter(contact => contact)
                .concat(contacts.filter(contact => contact.id > this.numContacts).map(contact => new Contact(contact)))
              );
              obs.complete();
            }
          )
          break;

        default:
          obs.error({
            status: 404,
            message: 'Not Found'
          })
          obs.complete();

      }
    });
  }

  post(url: string, body: any, options?: any): Observable<Object> {
    return new Observable(obs => {
      let urlParts = url.split('/');
      let data = this._storage.get('savedData');
      switch(urlParts[0]) {

        //create or update contact
        case 'contacts':
          let contacts = data ? data.contacts || [] : [];
          let id = parseInt(urlParts[1]) || (Math.max(this.numContacts, Math.max(...contacts.map(contact => contact.id))) + 1);
          let contact = contacts.find(contact => contact.id == id);
          if (contact) Object.assign(contact, body);
          else {
            contact = _.extend(body, {id: id});
            contacts.push(contact);
          }
          this._storage.update('savedData', {contacts: contacts});
          obs.next(contact);
          obs.complete();
          break;

        //add contact to favourites
        case 'favourites':
          let favourites = data ? data.favourites || [] : [];
          favourites.push(parseInt(urlParts[1]));
          this._storage.update('savedData', {favourites: favourites});
          obs.next({success: true});
          obs.complete();
          break;

        default:
          obs.error({
            status: 404,
            message: 'Not Found'
          })
          obs.complete();

      };
    })
  }

  delete(url: string, options?: any): Observable<Object> {
    return new Observable(obs => {
      let urlParts = url.split('/');
      let data = this._storage.get('savedData');
      switch(urlParts[0]) {

        //delete contact
        case 'contacts':
          let id = parseInt(urlParts[1]);
          if(id && id <= this.numContacts) {
            let deleted = data ? data.deleted || [] : [];
            if (deleted.indexOf(id) == -1) {
              deleted.push(id);
              this._storage.update('savedData', { deleted: deleted });
            }
          } else if(id > this.numContacts) {
            let contacts = data ? data.contacts || [] : [];
            let contact = contacts.find(contact => contact.id == id);
            if(contact) contacts.splice(contacts.indexOf(contact), 1);
            this._storage.update('savedData', { contacts: contacts });
          }
          obs.next({success: true});
          obs.complete();
          break;

        //remove contact from favourites
        case 'favourites':
          let favourites = data ? data.favourites || [] : [];
          favourites.splice(favourites.indexOf(parseInt(urlParts[1])), 1);
          this._storage.update('savedData', {favourites: favourites});
          obs.next({success: true});
          obs.complete();
          break;

        default:
          obs.error({
            status: 404,
            message: 'Not Found'
          })
          obs.complete();

      };
    })
  }

}
