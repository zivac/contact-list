import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements OnInit, ControlValueAccessor {

  public innerValue: any;
  public isOpen: boolean = false;

  @Input() options: any[] = []; //array of option objects

  constructor() { }

  ngOnInit() {
  }

  writeValue(value: any) {
    if(value !== undefined) {
      this.innerValue = value;
    }
  }

  updateValue() {
    this.propagateChange(this.innerValue);
  }

  setOption(option: any) {
    this.innerValue = option;
    this.propagateChange(this.innerValue);
  }

  propagateChange(_: any) { }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() { }

}
