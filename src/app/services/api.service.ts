import { Injectable } from '@angular/core';
import { MockHttpClient } from './mock-http.service';

@Injectable()
export class ApiService {

  constructor(
    private _http: MockHttpClient
  ) { }

  private request(method: 'GET' | 'POST' | 'DELETE', url: string, data?: any) {
    return this._http.request(method, url, data);
  }

  get(url: string) {
    return this.request('GET', url);
  }

  post(url: string, body: any) {
    return this.request('POST', url, body);
  }

  delete(url: string) {
    return this.request('DELETE', url);
  }

}
