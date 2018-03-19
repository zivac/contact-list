import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Contact } from '../../../interfaces/contact'

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.scss']
})
export class ContactDetailsComponent implements OnInit {

  contact: Contact

  constructor(
    private _route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.contact = this._route.data['getValue']().contact;
  }

}
