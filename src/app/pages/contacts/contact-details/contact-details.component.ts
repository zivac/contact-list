import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Contact } from '../../../classes/contact'
import { ContactsService } from '../contacts.service';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.scss']
})
export class ContactDetailsComponent implements OnInit {

  contact: Contact

  constructor(
    private _route: ActivatedRoute,
    public _contacts: ContactsService
  ) {}

  ngOnInit() {
    this.contact = this._route.data['getValue']().contact;
  }

  toggleFavourite() {
    this._contacts.toggleFavourite(this.contact, this.contact.favourite).subscribe(() => {});
  }

  saveNotes() {
    this._contacts.updateContact(this.contact, {notes: this.contact.notes}).subscribe(() => {});
  }

}
