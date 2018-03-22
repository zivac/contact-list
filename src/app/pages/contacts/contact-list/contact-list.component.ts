import { Component, OnInit } from '@angular/core';
import { ContactsService } from '../contacts.service';
import { Contact } from '../../../classes/contact';
import * as _ from 'lodash';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

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
    public _contacts: ContactsService,
    private _router: Router
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
        return _.extend(contact, { groupKey: ((contact.lastName + contact.firstName) || '#').toLowerCase()[0].replace(/[^a-z]/, '#')})
      }), 'groupKey');
    //sort letters and then move # to last place
    this.alphabetGroups = _.keys(this.contacts).sort();
    if(this.alphabetGroups.length && this.alphabetGroups[0] == '#') this.alphabetGroups.push(this.alphabetGroups.shift());
  }

  //activate or deactivate favourites filter
  toggleFavourites(value: boolean) {
    if(this.showFavourites == value) return;
    this.showFavourites = value;
    this.groupContacts();
  }

  //scroll to contacts with last name beginning with letter
  scrollTo(letter: string) {
    window.scrollTo(0, document.getElementById(letter).getBoundingClientRect().top + window.pageYOffset - 75);
  }

  //change favourite property of contact
  favouriteContact(event: any, contact: Contact) {
    event.stopPropagation();
    contact.favourite = !contact.favourite;
    this._contacts.toggleFavourite(contact, contact.favourite).subscribe(() => {});
    return false;
  }

  //redirect to edit page
  editContact(event: any, contact: Contact) {
    event.stopPropagation();
    this._router.navigate(['/edit/'+contact.id]);
    return false;
  }

  //delete contact from contacts list
  deleteContact(event: any, contact: Contact) {
    event.stopPropagation();
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this contact from your contact list?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonClass: "btn",
      cancelButtonText: 'Cancel',
      cancelButtonClass: "btn-flat",
      buttonsStyling: false
    }).then(result => {
      if(result.value) {
        this._contacts.deleteContact(contact.id).subscribe(() => {
          this.contacts[contact['groupKey']].splice(this.contacts[contact['groupKey']].indexOf(contact), 1);
        })
      }
    })
    return false;
  }

}
