import { Component, OnInit } from '@angular/core';
import { ContactsService } from '../contacts.service';
import { Contact } from '../../../interfaces/contact';
import * as _ from 'lodash';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {

  contacts: {
    [key: string]: Contact[]
  }
  alphabetGroups: string[];
  searchText: string = "";

  constructor(
    public _contacts: ContactsService
  ) { }

  ngOnInit() {
    this.groupContacts();
  }

  groupContacts() {
    this.contacts = _.groupBy(this._contacts.contacts
      .filter(contact => (contact.firstName + ' ' + contact.lastName).toLowerCase().indexOf(this.searchText.toLowerCase()) != -1)
      .map(contact => {
        return _.extend(contact, {groupKey: contact.lastName[0].replace(/[^a-z]/, '#')})
      }), 'groupKey');
    this.alphabetGroups = _.keys(this.contacts);
  }

  favouriteContact(event: any, contact: Contact) {
    event.stopPropagation();
    contact.favourite = !contact.favourite;
    return false;
  }

}
