import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { environment } from 'src/environments/environment';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-lpb-select-tooltip',
  templateUrl: './lpb-select-tooltip.component.html',
  styleUrls: ['./lpb-select-tooltip.component.scss'],
})
export class LpbSelectTooltipComponent implements OnInit, OnChanges {
  @Input() control: AbstractControl;
  @Input() placeholder: string;
  @Input() bindValue: string;
  @Input() class: string;
  @Input() items = [];

  @Input() optPatternFields: string[];
  @Input() optPatternSplitter: string;
  @Input() apiUrl: string;
  @Input() isNewApi: string;
  @Input() optionAdditional: any[];
  @Input() optAdditionalPatternFields: string[];

  @Output('change') onChangeValue = new EventEmitter<string>();

  crrDisplayText = '';
  displayTextDict = {};
  isLoading = false;
  lstOption = [];
  isApiCalled = false;

  constructor(private http: HttpService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.items) {
      this.lstOption = changes.items.currentValue;
      if (this.optionAdditional) {
        this.lstOption = this.optionAdditional.concat(this.lstOption);
      }
      this.updateWithNewItems(this.lstOption);
    } else if (changes.apiUrl && !changes.apiUrl.firstChange) {
      this.isApiCalled = true;
      this.fetchData();
    }
  }

  updateWithNewItems(items: any[]) {
    this.displayTextDict = {};
    items.forEach((item) => {
      this.displayTextDict[item[this.bindValue]] =
        this.getDisplayTextByItem(item);
    });
    this.crrDisplayText = this.getDisplayText(this.items, this.control.value);
  }

  ngOnInit() {
    if (!this.isApiCalled && this.apiUrl) {
      this.fetchData();
    }
    this.crrDisplayText = this.getDisplayText(
      this.lstOption,
      this.control.value
    );

    this.control.valueChanges.subscribe((value) => {
      this.crrDisplayText = this.getDisplayText(this.lstOption, value);
    });
  }

  getDisplayText(items: any[], value: string) {
    const item = items.find((item) => item[this.bindValue] === value);
    return this.getDisplayTextByItem(item);
  }

  getDisplayTextByItem(item: any) {
    if (item) {
      let values = [];

      const isAdditionalData = this.optionAdditional?.some(
        (data) => data[this.bindValue] === item[this.bindValue]
      );

      if (isAdditionalData) {
        values = this.optAdditionalPatternFields.map((field) =>
          item[field]?.toString()
        );
      } else {
        values = this.optPatternFields.map((field) => {
          return item[field]?.toString();
        });
      }

      const noNullValues = values.filter((value) => value);
      if (noNullValues.length === 1) {
        return noNullValues[0];
      }

      return values.join(` ${this.optPatternSplitter} `);
    }

    return null;
  }

  fetchData() {
    const params = {
      page: '0',
      size: '999999',
    };
    this.http
      .get<any>(`${environment.apiUrl + this.apiUrl}`, {
        headers: { 'x-skip-spinner': 'true' },
        params,
      })
      .pipe(
        finalize(() => {
          // this is called on both success and error
          this.isLoading = false;
        })
      )
      .subscribe((res) => {
        this.lstOption = res.data;
        if (this.optionAdditional) {
          this.lstOption = this.optionAdditional.concat(this.lstOption);
        }
        this.updateWithNewItems(this.lstOption);
      });
  }
}
