import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild,
  Renderer2,
  OnInit,
  Output,
  EventEmitter,
  forwardRef
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

export interface Item {
  label: string;
  value: any;
}

@Component({
  selector: 'app-input-autocomplete-custom',
  templateUrl: './input-autocomplete-custom.component.html',
  styleUrls: ['./input-autocomplete-custom.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputAutocompleteCustomComponent),
      multi: true
    },
  ]
})
export class InputAutocompleteCustomComponent implements OnInit, OnChanges, ControlValueAccessor {

  constructor(private renderer: Renderer2) {
  }

  @Input() value = '';
  @Input() fieldLabel = 'label';
  @Input() fieldValue = 'value';
  @Input() listItem!: any[];
  @Input() charSearch = '$';
  @Input() scrollHeight = 240;
  @Input() maxlength: number = 0;
  @Input() placeholder = '';

  @Output() blur = new EventEmitter<any>();

  @ViewChild('input') input!: ElementRef;
  @ViewChild('select') select!: ElementRef;

  listItemShow!: any[];
  showList = false;
  selectionStart = 0;

  onChange: (value: any) => void;
  onTouched: () => void;
  isDisabled: boolean;
  documentClickListener: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.listItem) {
      setTimeout(() => {
        this.listItemShow = [...this.listItem];
      });
    }
  }

  ngOnInit(): void {}

  writeValue(value: string): void {
    this.value = value;
    setTimeout(() => {
      this.input.nativeElement.value = this.calcValue(this.value, this.fieldValue, this.fieldLabel);
    });
  }

  registerOnChange(fn: (value: string) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onKeyup(event: any): void {
    let text = '';
    let textSearch = '';
    text = event.target.value;
    this.selectionStart = event.target.selectionStart;
    const posCharSearch = text.lastIndexOf(this.charSearch, this.selectionStart - 1);
    if (posCharSearch === -1) {
      this.showList = false;
      return;
    }
    textSearch = text.substring(text.lastIndexOf(this.charSearch, this.selectionStart - 1) + 1, this.selectionStart).toLowerCase();
    if (textSearch.substring(0, 1) === '{') {
      textSearch = textSearch.substring(1);
    }
    this.listItemShow = this.listItem.filter(x => x[this.fieldLabel].toLowerCase().substring(0, textSearch.length) === textSearch);
    const pos = window.innerHeight - (this.input.nativeElement.getBoundingClientRect().top + this.input.nativeElement.offsetHeight + Math.min(this.scrollHeight, this.listItem.length * 40));
    const bottom = window.innerHeight - this.input.nativeElement.getBoundingClientRect().top;
    this.showList = true;
    if (pos < 0) {
      setTimeout(() => {
        this.select.nativeElement.style.bottom = `100%`;
        // this.select.nativeElement.style.bottom = `${bottom}%`;
        this.select.nativeElement.style.top = `auto`;
      });
    } else {
      setTimeout(() => {
        this.select.nativeElement.style.bottom = `auto`;
        // this.select.nativeElement.style.top = this.input.nativeElement.getBoundingClientRect().top + this.input.nativeElement.offsetHeight + 'px';
        this.select.nativeElement.style.top = '100%';
      });
    }
    setTimeout(() => {
      this.select.nativeElement.style.width = this.input.nativeElement.offsetWidth + 'px';
    });
    this.bindDocumentClickListener();
  }

  selectedItem(item: any): void {
    let text = '';
    text = this.input.nativeElement.value;
    const posCharSearch = text.lastIndexOf(this.charSearch, this.selectionStart - 1);
    const valueReplace = this.charSearch + '{' + item[this.fieldLabel] + '}';
    this.input.nativeElement.value = text.substring(0, posCharSearch) + valueReplace + text.substring(this.selectionStart);
    this.input.nativeElement.focus();
    this.input.nativeElement.selectionStart = posCharSearch + valueReplace.length;
    this.input.nativeElement.selectionEnd = posCharSearch + valueReplace.length;
    this.showList = false;
  }

  blurInput(): void {
    this.onTouched();
    this.value = this.calcValue(this.input.nativeElement.value, this.fieldLabel, this.fieldValue);
    this.writeValue(this.value);
    this.onChange(this.value);
    this.blur.emit();
  }

  calcValue(text: string, fieldRoot: string, fieldReplace: string): string {
    const arrText = text.split(this.charSearch);
    const arrResult = [];
    for (const row of arrText) {
      const label = row.substring(1, row.indexOf('}'));
      const item = this.listItem.find(x => x[fieldRoot] === label);
      let rowReplace = row;
      if (item) {
        rowReplace = row.substring(0, 1) + item[fieldReplace] + row.substring(row.indexOf('}'));
      }
      arrResult.push(rowReplace);
    }
    const value = arrResult.join(this.charSearch);
    return value;
  }

  bindDocumentClickListener(): void {
    if (!this.documentClickListener) {
      this.documentClickListener = this.renderer.listen('document', 'click', (event) => {
        this.showList = false;
      });
    }
  }

  unbindDocumentClickListener(): void {
    if (this.documentClickListener) {
      this.documentClickListener();
      this.documentClickListener = null;
    }
  }

  ngOnDestroy() {
    this.unbindDocumentClickListener();
  }
}
