import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractControl } from '@angular/forms';
import { Subject, of, concat, BehaviorSubject } from 'rxjs';
import {
  filter,
  distinctUntilChanged,
  tap,
  debounceTime,
  switchMap,
  catchError,
} from 'rxjs/operators';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-ng-autocomplete',
  templateUrl: './ng-autocomplete.component.html',
  styleUrls: [
    '../../../styles/common.scss',
    './ng-autocomplete.component.scss',
  ],
})
export class NgAutocompleteComponent implements OnInit {
  @Input() control: AbstractControl;
  @Input() placeholder: string;
  @Input() minTermLength: number = 0;
  @Input() bindValue: string;
  @Input() bindLabel: string;
  @Input() httpSearch: (term: string) => Observable<any>;
  @Input() inputAttrs: any;

  @Output() changeSelectedItem = new EventEmitter<any>();

  @ViewChild(NgSelectComponent, {static: false}) select: NgSelectComponent;

  items$: Observable<any>;
  isLoading: boolean = false;
  selectedItem: any;
  input$: BehaviorSubject<string>;

  constructor() {
    this.input$ = new BehaviorSubject<string>(null);
    this.items$ = of([]);
  }

  ngOnInit() {
    this.loadResults();
  }

  loadResults() {
    this.input$
      .pipe(
        filter((term: string) => {
          return term !== null && term.length >= this.minTermLength;
        }),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((term) => {
          return this.httpSearch(term);
        }),
        tap(() => {
          this.isLoading = false;
        }),
        catchError(() => of([]))
      )
      .subscribe((data) => {
        this.items$ = of(data);
        this.select.open();
      });
  }

  onChange(event): void {
    console.log('onChange: ', event);
    this.selectedItem = event;
    this.changeSelectedItem.emit(this.selectedItem);
  }

  onSearch(event): void {
    this.input$.next(event.term);
  }

  public filterItem(term: string, item: any) {
    return item[term].includes(term);
  }

  onBlur(event): void {
    if(this.selectedItem?.[this.bindValue] !== this.control.value){
      this.changeSelectedItem.emit(this.selectedItem);
    }
  }

  onClear(): void {
    this.changeSelectedItem.emit(null);
  }
}
