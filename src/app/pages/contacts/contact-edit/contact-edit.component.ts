import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactsService } from '../contacts.service';
import { Contact } from '../../../classes/contact';
import { Location } from '@angular/common';
import swal from 'sweetalert2';

@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.scss']
})
export class ContactEditComponent implements OnInit {

  contact: Contact

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
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

  //delete contact and go back to contact list
  deleteContact() {
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
        this._contacts.deleteContact(this.contact.id).subscribe(() => {
          this._router.navigate(['']);
        })
      }
    })
    return false;
  }

}
