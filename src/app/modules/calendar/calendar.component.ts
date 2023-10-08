import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import {
  ETypeCalendar,
  TypeCaledar,
} from 'src/app/shared/constants/shared-constants';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  currentDate = moment();
  days: string[] = [];
  title: string = '';
  isDisable: boolean = true;
  typeCalendar = TypeCaledar;
  nameCalendar: string = '';
  dataList = this.appService.fakeData([]);
  constructor(
    private appService: SharedService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.appService.typeCalendar.subscribe((value) => {
      this.nameCalendar = value;
      this.appService.date.next(moment());
      setTimeout(() => {
        const groupType = document.getElementById('group-type') as HTMLElement;
        const typeCalendarDom = groupType.getElementsByClassName('fc-button');

        for (let i = 0; i < typeCalendarDom.length; i++) {
          if (typeCalendarDom[i].id === value) {
            typeCalendarDom[i].className = 'fc-button fc-button-active';
          } else {
            typeCalendarDom[i].className = 'fc-button';
          }
        }
      });
      this.getDataCalendar(value);
    });
    this.appService.date.subscribe((value) => {
      this.currentDate = value;

      this.getDataCalendar(this.nameCalendar);
      this.isDisable =
        moment().format('DD-MM-YYYY') === value.format('DD-MM-YYYY');
      this.cdr.detectChanges();
    });
  }

  getDataCalendar(type: string): void {
    const data = this.appService.dataCalender(type, this.currentDate, 'ddd DD');
    this.title = data.title;
    this.days = data.days;
    this.dataList = this.appService.fakeData(data.days);
  }

  today(): void {
    this.appService.date.next(moment());
  }

  prev(): void {
    switch (this.nameCalendar) {
      case ETypeCalendar.DAY:
        this.appService.date.next(this.currentDate.subtract(1, 'd'));
        break;
      case ETypeCalendar.WEEK:
        this.appService.date.next(this.currentDate.subtract(1, 'w'));
        break;
      case ETypeCalendar.MONTH:
        this.appService.date.next(
          this.currentDate.subtract(1, 'M').startOf('M')
        );
        break;

      default:
        break;
    }
  }

  next(): void {
    switch (this.nameCalendar) {
      case ETypeCalendar.DAY:
        this.appService.date.next(this.currentDate.add(1, 'd'));
        break;
      case ETypeCalendar.WEEK:
        this.appService.date.next(this.currentDate.add(1, 'w'));
        break;
      case ETypeCalendar.MONTH:
        this.appService.date.next(this.currentDate.add(1, 'M').startOf('M'));
        break;

      default:
        break;
    }
  }

  changeTypeCalendar(type: string): void {
    this.appService.typeCalendar.next(type);
  }
}
