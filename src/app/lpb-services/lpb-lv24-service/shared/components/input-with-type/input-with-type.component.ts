import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-with-type',
  templateUrl: './input-with-type.component.html',
  styleUrls: ['./input-with-type.component.scss'],
})
export class InputWithTypeComponent implements OnInit {
  @Input() label: string;
  @Input() list: any[];
  @Input() secondList: any[];
  @Input() firstControl: FormControl;
  @Input() secondControl: FormControl;
  @Input() textPlaceHolder: string = 'Nhập giá trị tìm kiếm';
  @Input() selectPlaceHolder: string = 'Chọn giá trị tìm kiếm';

  constructor() {}

  ngOnInit(): void {}
}
