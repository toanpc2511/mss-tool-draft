import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ValidationErrors, Validator} from '@angular/forms';
import {Observable} from "rxjs";
import {Category} from "../../_models/category/category";
import {CategoryService} from "../../_services/category/category.service";
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: AutocompleteComponent
    }
  ]
})
export class AutocompleteComponent implements OnInit, ControlValueAccessor {
  value = '';
  touched = false;
  disabled = false;
  filteredOptions: Observable<Category[]>;
  options: Category[] = [];
  myControl = new FormControl();
  @Input()
  className = '';

  constructor(private categoryService: CategoryService) {
  }

  ngOnInit(): void {
    this.categoryService.getPerDocPlace().subscribe(data => {
      this.options = data;
      // console.log('getPerDocPlace', data);
      // this.categories.perDocPlaces = data;
      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => {
            return this._filter(value);
          })
        );
    });

  }

  filter = () => {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => {
          return this._filter(value);
        })
      );
  }

  private _filter(name: string): Category[] {
    const filterValue = name?.toLowerCase();
    return this.options?.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  onChange = (value) => {
    // console.log('12345');
    this.myControl.setValue(value);
    // console.log(value);
  }

  onTouched = () => {
  }


  writeValue(value: string): void {
    // console.log(value, this.value);
    this.myControl.setValue(value);
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  markAsTouched(): void {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean): void {
    if (disabled) {
      this.myControl.disable();
    } else {
      this.myControl.enable();
    }
  }

  setValue(value: string): void {
    this.onChange(value);
  }

}
