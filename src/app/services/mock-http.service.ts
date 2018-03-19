import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';

@Injectable()
export class MockHttpClient {

  constructor(
    private _http: HttpClient
  ) { }

  get(url: string, options?: any): Observable<Object> {
    return new Observable(obs => {
      switch(url) {
        case 'contacts':
          this._http.get('https://randomuser.me/api/?results=200').subscribe(
            res => {
              obs.next(res['results'].map((user, index) => {
                return {
                  id: index + 1,
                  firstName: user.name.first,
                  lastName: user.name.last,
                  profilePhoto: user.picture.large,
                  email: user.email,
                  favourite: false,
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
    return new Observable();
  }

}
