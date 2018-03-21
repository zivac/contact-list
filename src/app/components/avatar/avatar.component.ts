import { Component, OnInit, Input } from '@angular/core';
import { Contact } from '../../classes/contact';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {

  @Input('user') user: Contact
  @Input('size') size: number

  constructor() { }

  ngOnInit() {
  }

}
