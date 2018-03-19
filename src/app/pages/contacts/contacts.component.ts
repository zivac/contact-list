import { Component, OnInit } from '@angular/core';
import { routerTransition } from './router.transition';

@Component({
  selector: 'app-contacts',
  template: `
  <main [@routerTransition]="getState(o)">
      <router-outlet #o="outlet"></router-outlet>
  </main>`,
  styleUrls: [],
  animations: [routerTransition]
})
export class ContactsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  getState(outlet) {
    return outlet.activatedRouteData.page || 'list';
  }

}
