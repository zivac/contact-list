import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContactsService } from '../contacts.service';
import { Contact } from '../../../classes/contact';
import { Location } from '@angular/common';

@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.scss']
})
export class ContactEditComponent implements OnInit {

  contact: Contact

  constructor(
    private _route: ActivatedRoute,
    private _location: Location,
    public _contacts: ContactsService
  ) { }

  ngOnInit() {
    this.contact = this._route.data['getValue']().contact || new Contact();
  }

  //cancel edit and go back to last page
  cancel() {
    this._location.back();
  }

}
