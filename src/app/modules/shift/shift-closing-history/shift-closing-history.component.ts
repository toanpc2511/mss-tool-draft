import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { LIST_STATUS } from '../../../shared/data-enum/list-status';

@Component({
  selector: 'app-shift-closing-history',
  templateUrl: './shift-closing-history.component.html',
  styleUrls: ['./shift-closing-history.component.scss'],
  providers: [FormBuilder]
})
export class ShiftClosingHistoryComponent implements OnInit {
  searchForm: FormGroup;
  today: string;
  dataSource;
  listStatus = LIST_STATUS;

  constructor(
    private fb : FormBuilder
  ) {
    this.today = moment().format('DD/MM/YYYY');
    this.dataSource = [
      {
        id: 1,
        stationName: 'SunOil',
        shiftName: 'Ca đêm',
        timeStart: '10/10/2022',
        timeEnd: '10/10/2022',
        status: 'ACTIVE'
      },
      {
        id: 1,
        stationName: 'SunOil',
        shiftName: 'Ca đêm',
        timeStart: '10/10/2022',
        timeEnd: '10/10/2022',
        status: 'ACTIVE'
      }
    ]
  }

  ngOnInit(): void {
    this.buildForm();
    this.initDate();
  }

  buildForm() {
    this.searchForm = this.fb.group({
      station: [''],
      shift: [''],
      startAt: [],
      endAt: []
    })
  }

  initDate() {
    this.searchForm.get('startAt').patchValue(this.today);
    this.searchForm.get('endAt').patchValue(this.today);
  }

  onSearch() {}

}
