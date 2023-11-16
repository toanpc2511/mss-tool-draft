import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'lpb-custom-upload-file',
  templateUrl: './lpb-custom-upload-file.component.html',
  styleUrls: ['./lpb-custom-upload-file.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LpbCustomUploadFileComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => LpbCustomUploadFileComponent),
      multi: true
    }
  ]
})
export class LpbCustomUploadFileComponent implements ControlValueAccessor, Validator, OnInit, OnDestroy {
  @Input() accept: string;
  @Input() isMultiple = false;
  @Input() maxSize: number; // MB
  @Output() onChange = new EventEmitter<any>();
  @Output() onClearSelected = new EventEmitter<any>();
  @ViewChild('fileUpload') fileUpload: ElementRef;
  fileName = '';
  files: File[] = [];
  uploadControl: FormControl = new FormControl(null);
  onChangeSubs: Subscription[] = [];
  isDisabled: boolean;

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    for (const sub of this.onChangeSubs) {
      sub.unsubscribe();
    }
  }

  onTouched = () => {
  }

  registerOnChange(onChange: any): any {
    const sub = this.uploadControl.valueChanges.subscribe(onChange);
    this.onChangeSubs.push(sub);
  }

  registerOnTouched(onTouched: any): any {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: any): any {
    this.isDisabled = disabled;
    if (disabled) {
      this.uploadControl.disable();
    } else {
      this.uploadControl.enable();
    }
  }

  writeValue(value: any): any {
  }

  validate(c: FormControl): ValidationErrors | null {
    const value = c.value;
    if (!value && c.hasError('required')) {
      return {
        required: true
      };
    }
  }

  onSelectFile($event): void {
    this.files = Array.from($event.target.files);
    if ($event.target.files.length > 0) {
      this.files.forEach((file) => {
        if (file.type !== this.accept) {
          this.uploadControl.setErrors({accepted: true});
        }
        if (this.maxSize && (file.size > (this.maxSize * 1024 * 1024))) {
          this.uploadControl.setErrors({maxSize: true});
        }
      });

      this.fileName = this.isMultiple ? `Đã chọn ${$event.target.files.length} tệp tin` : this.files[0].name;
      this.onChange.emit(this.uploadControl.invalid ? null : this.files);
      this.cdr.detectChanges();
    }
    $event.target.value = null;
  }

  clear(): void {
    if (this.isDisabled) {
      return;
    }
    this.fileName = '';
    this.files = [];
    this.onChange.emit(null);
    this.onClearSelected.emit();
    this.uploadControl.reset();
  }
}
