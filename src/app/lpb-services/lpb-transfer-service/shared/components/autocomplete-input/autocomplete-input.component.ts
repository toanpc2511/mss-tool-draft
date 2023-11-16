import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';
import { NgSelectComponent } from '@ng-select/ng-select';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  distinctUntilChanged,
  debounceTime,
  finalize,
  switchMap,
  tap,
  map,
} from 'rxjs/operators';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { CustomNotificationService } from 'src/app/shared/services/custom-notification.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-autocomplete-input',
  templateUrl: './autocomplete-input.component.html',
  styleUrls: ['./autocomplete-input.component.scss'],
})
export class AutocompleteInputComponent implements OnInit {
  @Input() control: AbstractControl;
  @Input() placeholder: string;
  @Input() minTermLength: number = 0;
  @Input() searchURL: string;
  @Input() queryParamName: string;
  @Input() bindValue: string;
  @Input() bindLabel: string;
  @Input() customSearchFn: Function;

  @Output() onChangeValue = new EventEmitter<any>();
  @ViewChild('ngSelect') ngSelect: NgSelectComponent;

  input$ = new BehaviorSubject<string>('');
  items$: Observable<any>;

  isLoading = false;
  items = [];
  tooltipText = '';
  formCtrl = new FormControl();

  constructor(
    private http: HttpService,
    private customNotificationService: CustomNotificationService
  ) {}

  getFilteredItems(term: string): Observable<any[]> {
    let url = this.searchURL;
    if (this.searchURL.includes('?')) {
      url += `&${this.queryParamName}=${term}`;
    } else {
      url += `?${this.queryParamName}=${term}`;
    }

    if (!term) {
      if(this.control.touched){
        return of(this.items);
      }
      return of([]);
    }

    if (term?.length < this.minTermLength) {
      return of(null);
    }

    return new Observable<any[]>((observer) => {
      this.http
        .get(`${environment.apiUrl}${url}`, {})
        .pipe(
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe(
          (res: DataResponse<any>) => {
            observer.next(res.data);
          },
          (error) => {
            observer.next([]);
            if (!error?.code.match(/400/g)) {
              this.customNotificationService.error('Thông báo', error.message);
            }
          }
        );
    });
  }

  ngOnInit() {
    this.control.valueChanges.subscribe((value) => {
      this.formCtrl.setValue(value);
    });

    if(this.control.disabled){
      this.formCtrl.disable();
    }

    this.control.statusChanges.subscribe((status) => {
      switch (status) {
        case 'DISABLED': {
          this.formCtrl.disable();
          break;
        }

        case 'INVALID': {
          this.formCtrl.enable();
          this.formCtrl.markAsTouched();
          this.formCtrl.setErrors(this.control.errors);
          break;
        }

        default: {
          this.formCtrl.setErrors(null);
          this.formCtrl.updateValueAndValidity();
          this.formCtrl.enable();
        }
      }
    });

    this.control.valueChanges
      .pipe(
        map((term) => term?.trim()),
        debounceTime(800),
        distinctUntilChanged(),
        switchMap((term) => this.getFilteredItems(term))
      )
      .subscribe((data) => {
        if (!data) {
          return;
        }
        this.items = data;
        this.items$ = of(this.items);

        const controlValue = this.control.value?.trim();
        const firsItem = this.items[0];
        if (
          this.items.length === 1 &&
          firsItem[this.bindLabel] === controlValue
        ) {
          this.onChange(this.items[0]);
          return;
        }

        this.ngSelect.open();
        if (controlValue && this.items.length === 0) {
          this.onChangeValue.emit(null);
        }
      });
  }

  onChange(event): void {
    this.control.setValue(event?.[this.bindLabel], { emitEvent: false });
    this.onChangeValue.emit(event);
  }

  onClear(): void {
    this.control.setValue('', { emitEvent: false });
    this.onChangeValue.emit(null);
  }

  onBlur(): void {
    const crrTerm = this.control.value;
    if (
      !this.items.find((item) => item[this.bindLabel] === crrTerm) &&
      this.items.length > 0
    ) {
      this.control.setValue(null, { emitEvent: false });
    }
  }
}
