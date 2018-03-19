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

  //contains filtered contacts grouped by first letter of last name
  contacts: {
    [key: string]: Contact[]
  }

  //contains all keys of contacts dictionary
  alphabetGroups: string[];

  //search filter
  searchText: string = "";

  //favourites filter
  showFavourites: boolean = false;

  constructor(
    public _contacts: ContactsService
  ) { }

  ngOnInit() {
    this.groupContacts();
  }

  //called every time any filter is changed to rebuild contacts dictionary
  groupContacts() {
    this.contacts = _.groupBy(this._contacts.contacts
      .filter(contact => this.showFavourites ? contact.favourite : true)
      .filter(contact => (contact.firstName + ' ' + contact.lastName).toLowerCase().indexOf(this.searchText.toLowerCase()) != -1)
      .map(contact => {
        return _.extend(contact, {groupKey: contact.lastName[0].replace(/[^a-z]/, '#')})
      }), 'groupKey');
    this.alphabetGroups = _.keys(this.contacts);
  }

  //activate or deactivate favourites filter
  toggleFavourites(value: boolean) {
    if(this.showFavourites == value) return;
    this.showFavourites = value;
    this.groupContacts();
  }

  //change favourite property of contact
  favouriteContact(event: any, contact: Contact) {
    event.stopPropagation();
    contact.favourite = !contact.favourite;
    this._contacts.toggleFavourite(contact, contact.favourite).subscribe(() => {});
    return false;
  }

}
