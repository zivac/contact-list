import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactsService } from '../contacts.service';
import { Contact } from '../../../classes/contact';
import { Location } from '@angular/common';
import swal from 'sweetalert2';
import * as _ from 'lodash';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.scss']
})
export class ContactEditComponent implements OnInit {

  contact: Contact
  contactForm: FormGroup

  @ViewChild('fileInput') fileInput: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _location: Location,
    private _fb: FormBuilder,
    public _contacts: ContactsService
  ) { }

  ngOnInit() {
    this.contact = this._route.data['getValue']().contact || new Contact();
    this.createForm();
  }

  //initialize contact edit form
  createForm() {
    this.contactForm = this._fb.group({
      firstName: this.contact.firstName,
      lastName: this.contact.lastName,
      profilePhoto: this.contact.profilePhoto,
      email: this.contact.email,
      notes: this.contact.notes,
      phones: this._fb.array(this.contact.phones.map(phone => this._fb.group({
        label: phone.label,
        name: phone.name,
        number: phone.number
      })))
    })
  }

  //open file input for profile photo
  setImage() {
    this.fileInput.nativeElement.click();
  }

  //load new profile photo
  imageLoaded(event: any) {
    if(!event.srcElement.files.length) return;
    let reader = new FileReader();
    reader.onload = (event) => this.contactForm.patchValue({profilePhoto: event.target['result']});
    reader.readAsDataURL(event.srcElement.files[0]);
  }

  //remove profile photo
  removeImage() {
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to remove the contact profile photo?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonClass: "btn",
      cancelButtonText: 'Cancel',
      cancelButtonClass: "btn-flat",
      buttonsStyling: false
    }).then(result => {
      if (result.value) {
        this.contactForm.patchValue({profilePhoto: null});
      }
    })
  }

  //add new entry to phone list
  addPhone() {
    let newPhone = {
      label: "phone",
      name: "",
      number: ""
    }
    let phonesForm = this.contactForm.get('phones') as FormArray;
    phonesForm.push(this._fb.group(newPhone));
  }

  //remove entry from phone list
  removePhone(index: number) {
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this phone?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonClass: "btn",
      cancelButtonText: 'Cancel',
      cancelButtonClass: "btn-flat",
      buttonsStyling: false
    }).then(result => {
      if (result.value) {
        let phonesForm = this.contactForm.get('phones') as FormArray;
        phonesForm.removeAt(index);
      }
    })
  }

  //cancel edit and go back to last page
  cancel() {
    this._location.back();
  }

  //save changes to contact
  saveContact(value: any) {
    if(this.contact.id) {
      //update contact
      let changedKeys = _.keys(value).filter(key => !_.isEqual(this.contact[key], value[key]));
      let changedValues = _.zipObject(changedKeys, changedKeys.map(field => value[field]));
      this._contacts.updateContact(this.contact, changedValues).subscribe(contact => {
        this._location.back();
      })
    } else {
      //create contact
      this._contacts.createContact(value).subscribe(contact => {
        this._router.navigate(['/view/'+contact.id]);
      })
    }
  }

  //delete contact and go back to contact list
  deleteContact() {
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
  }

}
