import {
  Component,
  forwardRef,
  Input,
  Output,
  OnDestroy,
  OnInit,
  EventEmitter,
  SimpleChanges,
  ViewChild,
  ContentChild,
  TemplateRef, OnChanges
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';
import {debounceTime, distinctUntilChanged, finalize, switchMap} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {HttpService} from '../../services/http.service';
import {of, Subject, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {NgSelectComponent} from '@ng-select/ng-select';
import {LpbSelect2Config} from '../../models/LpbSelect2Config';

@Component({
  selector: 'app-lpb-select2',
  templateUrl: './lpb-select2.component.html',
  styleUrls: ['./lpb-select2.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LpbSelect2Component),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => LpbSelect2Component),
      multi: true
    }
  ]
})
export class LpbSelect2Component implements ControlValueAccessor, Validator, OnInit, OnDestroy, OnChanges {
  listOptions = [];
  listOptionsBuffer = [];
  bufferSize = 50;
  input$ = new Subject<string>();
  // provincesList: { id: number, name: string, type: 'central' | 'province' }[] = [
  //   { id: 1, name: 'Hà Nội', type: 'central' },
  //   { id: 2, name: 'TP Hồ Chí Minh', type: 'central' },
  //   { id: 3, name: 'Đà Nẵng', type: 'central' },
  //   { id: 4, name: 'Lào Cai', type: 'province' },
  //   { id: 5, name: 'Yên Bái', type: 'province' },
  //   { id: 6, name: 'Quảng Bình', type: 'province' },
  //   { id: 7, name: 'Thái Nguyên', type: 'province' },
  //   { id: 8, name: 'Daklak', type: 'province' },
  //   { id: 9, name: 'Nghệ An', type: 'province' },
  //   { id: 10, name: 'Hà Tĩnh', type: 'province' }
  // ];
  public value = new FormControl();

  onChangeSubs: Subscription[] = [];

  isLoading = false;
  isChanged = false;
  @Input() apiUrl = '';
  @Input() labelName = '';
  @Input() items = [];
  @Input() bindValue: string;
  @Input() className: string;
  @Input() config: LpbSelect2Config = {
    isNewApi: true,
    sort: false,
    closeOnSelect: true
  };

  @Input() placeholder = '';
  @Input() optionAdditional: any;
  @Input() multiple = false;
  @Input() appendTo = '';

  @Output() clear: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('ngSelect') ngSelect: NgSelectComponent;
  /**
   * example (handleData)="({data, setData }) => { const newData = data.filter(...); setData(newData); }"
   */
  @Output() handleData: EventEmitter<{
    data: any; // data output
    setData: (data: any) => void; // set new data
  }> = new EventEmitter<{ data: any; setData: (data: any) => void }>();

  @ContentChild(TemplateRef) templateRef: TemplateRef<any>;

  constructor(private http: HttpService, private httpClient: HttpClient) {
  }

  ngOnInit(): void {
    if (!this.isChanged) {
      this.fetchData();
      if (this.config.paging) {
        this.onSearch();
      }

    }

  }

  fetchMore(term): void {

    const len = this.listOptionsBuffer.length;
    if (len < this.listOptions.length) {
      console.log('searchValue', term);
      let more = [];
      if (term) {
        more = this.listOptions.filter(opt => opt[this.labelName].includes(term)).slice(len, this.bufferSize + len);
      } else {
        more = this.listOptions.slice(len, this.bufferSize + len);
      }

      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.listOptionsBuffer = this.listOptionsBuffer.concat(more);
      }, 200);
    }

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.apiUrl && !changes.apiUrl.firstChange) {
      this.fetchData();
      this.isChanged = true;
    } else if (this.items && !this.apiUrl) {
      this.fetchData();
      this.isChanged = true;
    }
  }

  ngOnDestroy(): void {
    for (const sub of this.onChangeSubs) {
      sub.unsubscribe();
    }
  }

  onChange($event): void {
    this.change.emit($event);
  }

  handleClearClick(): void {
    this.ngSelect.handleClearClick();
  }

  onTouched = () => {
  };

  // private provinceData: { id: number, name: string, type: 'central' | 'province' };
  // onChange: (provinceData: any) => void;
  // onTouched: () => void;
  // isDisabled: boolean;
  // @Input('type') type: 'central' | 'province';


  registerOnChange(onChange: any): any {
    const sub = this.value.valueChanges.subscribe(onChange);
    this.onChangeSubs.push(sub);
  }

  registerOnTouched(onTouched: any): any {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: any): any {
    if (disabled) {
      this.value.disable();
    } else {
      this.value.enable();
    }
  }

  writeValue(value: any): any {
    // console.log('writeValue', value);
    if (value) {
      if (this.config.paging) {
        setTimeout(() => {
          this.listOptionsBuffer = this.listOptions;
          this.value.setValue(value);
        }, 300);
      } else {
        this.listOptionsBuffer = this.listOptions;
        this.value.setValue(value);
      }

    } else {
      this.ngSelect?.handleClearClick();
    }


  }

  validate(c: FormControl): ValidationErrors | null {
    const value = c.value;
    if (!value && c.hasError('required')) {
      return {
        required: true
      };
    }
    // if (!this.value.validator && c.validator) {
    //   this.value.setValidators(c.validator);
    // }
    //
    // if (this.value.valid) {
    //   return null;
    // }

    // const errors : any = {};

    // return this.value.errors;
  }

  fetchData(): any {
    this.listOptions = [];
    const headers = {
      'x-skip-spinner': 'true'
    };
    if (this.apiUrl) {
      this.isLoading = true;
      if (this.config.isNewApi) {
        const params = {
          page: '0',
          size: '999999'
        };
        this.http.get<any>(`${(environment.apiUrl) + this.apiUrl}`, {headers: {'x-skip-spinner': 'true'}, params})
          .pipe(
            finalize(() => {
              // this is called on both success and error
              this.isLoading = false;
            })
          )
          .subscribe((res) => {
            if (!this.handleData.observers?.length) {
              this.listOptions = res.data;
              if (this.config.sort) {
                this.listOptions.sort((obj1, obj2) => {
                  if (obj1[this.labelName] > obj2[this.labelName]) {
                    return 1;
                  }

                  if (obj1[this.labelName] < obj2[this.labelName]) {
                    return -1;
                  }

                  return 0;
                });
              }

              if (this.optionAdditional) {
                this.listOptions = this.optionAdditional
                  .concat(this.listOptions);
              }
            } else {
              this.handleData.emit({
                data: this.optionAdditional ? this.optionAdditional
                  .concat(res.data) : res.data,
                setData: (data: any) => {
                  this.listOptions = data;
                },
              });
            }
            this.listOptionsBuffer = this.listOptions.slice(0, this.bufferSize);
          }, error => {
            this.listOptions = [];
          });
      } else {
        this.httpClient.get<any>(`${environment.apiUrl + this.apiUrl}`, {headers})
          .pipe(
            finalize(() => {
              // this is called on both success and error
              this.isLoading = false;
            })
          )
          .pipe(map(res => {
            if (!this.handleData.observers?.length) {
              this.listOptions = res.items;
              if (this.config.sort) {
                this.listOptions.sort((obj1, obj2) => {
                  if (obj1[this.labelName] > obj2[this.labelName]) {
                    return 1;
                  }

                  if (obj1[this.labelName] < obj2[this.labelName]) {
                    return -1;
                  }

                  return 0;
                });
              }

              if (this.optionAdditional) {
                this.listOptions = this.optionAdditional
                  .concat(this.listOptions);
              }
            } else {
              this.handleData.emit({
                data: this.optionAdditional ? this.optionAdditional
                  .concat(res.items) : res.items,
                setData: (data) => {
                  this.listOptions = data;
                },
              });
            }
            this.listOptionsBuffer = this.listOptions.slice(0, this.bufferSize);
            return res;
          })).subscribe(rs => {

        }, error => {
          this.listOptions = [];
        });
      }
    } else {
      this.listOptions = this.items;
      // this.listOptions.sort((obj1, obj2) => {
      //   if (obj1[this.labelName] > obj2[this.labelName]) {
      //     return 1;
      //   }

      //   if (obj1[this.labelName] < obj2[this.labelName]) {
      //     return -1;
      //   }

      //   return 0;
      // });

      if (this.optionAdditional) {
        this.listOptions = this.optionAdditional
          .concat(this.listOptions.filter(e => e[this.labelName] !== this.optionAdditional.includes(o => o[this.labelName])));
      }

      this.listOptionsBuffer = this.listOptions.slice(0, this.bufferSize);
    }

  }

  onClear(): void {
    this.clear.emit();
  }

  shouldEnableVirtualScroll(): boolean {

    if (!this.listOptions) {
      return false;
    }

    return this.config?.paging && this.listOptions.length > this.bufferSize;
  }

  onSearch(): void {
    console.log('test', this.input$);
    this.input$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term => this.fakeService(term))
    )
      .subscribe(data => {
        this.listOptionsBuffer = data.slice(0, this.bufferSize);
      });
  }

  private fakeService(term) {
    if (term) {
      return of(this.listOptions)
        .pipe(map(data => data.filter(x => x[this.labelName]?.toLowerCase().includes(term?.toLowerCase()))));
    } else {
      return of(this.listOptions)
        .pipe(map(data => data));
    }

  }
}
