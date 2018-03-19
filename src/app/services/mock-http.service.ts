import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { StorageService } from './storage.service';

@Injectable()
export class MockHttpClient {

  constructor(
    private _http: HttpClient,
    private _storage: StorageService
  ) { }

  get(url: string, options?: any): Observable<Object> {
    return new Observable(obs => {
      switch(url) {
        case 'contacts':
          let data = this._storage.get('savedData');
          let seed = data ? data.seed || "" : "";
          let favourites = data ? data.favourites || [] : [];
          this._http.get('https://randomuser.me/api/?results=200&seed='+seed).subscribe(
            res => {
              this._storage.update('savedData', {seed: res['info'].seed});
              obs.next(res['results'].map((user, index) => {
                return {
                  id: index + 1,
                  firstName: user.name.first,
                  lastName: user.name.last,
                  profilePhoto: user.picture.large,
                  email: user.email,
                  favourite: favourites.indexOf(index + 1) != -1,
                  phones: [
                    {
                      name: 'Phone',
                      label: 'phone',
                      number: user.phone
                    },
                    {
                      name: 'Cell',
                      label: 'cell',
                      number: user.cell
                    }
                  ]
                }
              }));
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
      switch(urlParts[0]) {
        case 'favourites':
          let data = this._storage.get('savedData');
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
