import { FormControl } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-validate',
  templateUrl: './validate.component.html',
  styleUrls: ['./validate.component.scss']
})
export class ValidateComponent implements OnInit {
  @Input() control: FormControl;
  @Input() error: string;
  @Input() message: string;

  constructor() { }

  ngOnInit(): void {
  }

}
