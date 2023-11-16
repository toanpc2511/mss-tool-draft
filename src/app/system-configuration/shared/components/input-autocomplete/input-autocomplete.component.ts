import { ultis } from 'src/app/shared/utilites/function';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-input-autocomplete',
  templateUrl: './input-autocomplete.component.html',
  styleUrls: ['./input-autocomplete.component.scss'],
})
export class InputAutocompleteComponent implements OnInit {
  @Input() keys: string[];
  @Input() control!: string;
  @Input() inputName!: string;
  @Input() messagePrefixSubject: Subject<any>;
  @Input() messagePeriodSubject: Subject<any>;

  message: string = '';

  @Output() getValuePrefix?: EventEmitter<string> = new EventEmitter<string>();
  @Output() getValuePeriodDetail?: EventEmitter<string> =
    new EventEmitter<string>();

  isCheck: boolean = false;

  keyFocus: any;
  keysClone: string[];

  constructor() {}

  ngOnInit(): void {
    this.keysClone = this.keys;
    this.messagePrefixSubject?.subscribe((value) => (this.message = value));
    this.messagePeriodSubject?.subscribe((value) => (this.message = value));
  }

  // listening event keyup/ click (input)
  getKey($event: any, type = 'keyup') {
    const valueInput = $event.target.innerText.trim();
    const { dataClone } = this.handleValue(valueInput);
    if ($event.key) {
      this.handleError(valueInput);
    }
    this.handleOnShowValue($event.key, valueInput, dataClone);
    if (type === 'click') {
      this.isCheck = false;
    }
    this.keyFocus = dataClone;
    this.emitData(valueInput);
  }
  onKeyDown(event) {
    const isValidShortcut = (event.ctrlKey && event.keyCode != 86 );
    const isValidKeyCode = [8, 16, 17, 37, 38, 39, 40, 46].includes(event.keyCode);
    const maxLength = parseInt(event.srcElement.getAttribute("maxlength"));
    const text = event.srcElement.innerText;
    if ( text.length >= maxLength && !isValidKeyCode && !isValidShortcut ) {
      event.preventDefault();
    }
  }

  // Event enter
  onEnter($event) {
    $event.target.blur();
    $event.preventDefault();
    this.isCheck = false;
    $event.target.innerText = $event.target.innerText.trim();
  }

  onBlur($event) {
    $event.target.innerText = $event.target.innerText.trim();
    this.handleError($event.target.innerText);
  }

  // listening event select data complete
  onSelected($event: any) {
    this.isCheck = false;
    const valueSelected: string = $event.target.innerText;

    const dom = document.getElementById(this.control);
    const arrKeyInput: string[] = dom.textContent.split(' ');
    if (!dom) return null;
    const indexKeyFocus = arrKeyInput.indexOf(this.keyFocus);
    arrKeyInput.splice(indexKeyFocus, 1, valueSelected);

    const vFrom = arrKeyInput.join(' ');
    dom.innerText = `${vFrom}`;
    this.emitData(vFrom);
  }

  handleError(value?: string) {
    this.message = value ? '' : `Chưa nhập ${this.inputName}`;
  }

  handleOnShowValue(keyUp: string, valueInput: string, curentKey: string) {
    this.keysClone = this.getKeyIncludes(curentKey);
    if (!valueInput) return (this.isCheck = false);

    if (keyUp === '$' || valueInput.includes('$') || curentKey.includes('$')) {
      this.isCheck = true;
    } else {
      this.isCheck = false;
    }
    if (this.keysClone.length > 0) {
      this.isCheck = true;
    } else this.isCheck = false;
  }

  getKeyIncludes(key: string): string[] {
    const newArr = this.keys.filter((item: string) => item.includes(key));
    return newArr;
  }

  // handle data từ input
  handleValue(valueInput: string) {
    const cursorPosition: number = window.getSelection()?.focusOffset;
    const keyEnd: string = valueInput.slice(0, cursorPosition);
    const arrKeyInString: string[] = keyEnd.split(' ');
    const dataClone = arrKeyInString[arrKeyInString.length - 1];
    return {
      cursorPosition: cursorPosition,
      keyEnd: keyEnd,
      arrKeyInString: arrKeyInString,
      dataClone: dataClone,
    };
  }

  emitData(value: string) {
    if (this.control === 'prefix') {
      this.getValuePrefix.emit(ultis.toNoSign(value));
    } else if (this.control === 'periodDetail') {
      this.getValuePeriodDetail.emit(ultis.toNoSign(value));
    }
  }
}
