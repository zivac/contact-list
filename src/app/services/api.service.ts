import { Injectable } from '@angular/core';
import { MockHttpClient } from './mock-http.service';

@Injectable()
export class ApiService {

  constructor(
    private _http: MockHttpClient
  ) { }

  get(url: string) {
    return this._http.get(url);
  }

  post(url: string, body: any) {
    return this._http.post(url, body);
  }

  delete(url: string) {
    return this._http.delete(url);
  }

}
