import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-validate',
  templateUrl: './validate.component.html'
})
export class ValidateComponent {
  @Input() control: FormControl;
  @Input() error: string;
  @Input() message: string;
}
