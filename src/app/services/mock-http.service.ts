import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { StorageService } from './storage.service';
import { Contact } from '../classes/contact';

@Injectable()
export class MockHttpClient {

  constructor(
    private _http: HttpClient,
    private _storage: StorageService
  ) { }

  get(url: string, options?: any): Observable<Object> {
    return new Observable(obs => {
      switch(url) {

        //get contact list
        case 'contacts':
          let data = this._storage.get('savedData');
          let seed = data ? data.seed || "" : "";
          let favourites = data ? data.favourites || [] : [];
          let deleted = data ? data.deleted || [] : [];
          this._http.get('https://randomuser.me/api/?results=200&seed='+seed).subscribe(
            res => {
              this._storage.update('savedData', {seed: res['info'].seed});
              obs.next(
                res['results'].map((user, index) => {
                  if(deleted.indexOf(index + 1) != -1) return null;
                  return new Contact({
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
                  })
                })
                .filter(contact => contact)
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
      switch(urlParts[0]) {

        //add contact to favourites
        case 'favourites':
          let data = this._storage.get('savedData');
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
          let contact = parseInt(urlParts[1]);
          let deleted = data ? data.deleted || [] : [];
          if(contact && deleted.indexOf(contact) == -1) {
            deleted.push(contact);
            this._storage.update('savedData', {deleted: deleted});
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
