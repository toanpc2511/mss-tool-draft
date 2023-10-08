import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ETypeCalendar } from '../constants/shared-constants';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  date: BehaviorSubject<any> = new BehaviorSubject<any>(moment());
  typeCalendar: BehaviorSubject<string> = new BehaviorSubject<string>(
    ETypeCalendar.WEEK
  );

  constructor() {}

  getDaysInWeek(currentDate = moment(), format: string = 'DD'): string[] {
    const weekStart = currentDate.startOf('w');
    const days: string[] = [];
    for (let i = 1; i <= 7; i++) {
      days.push(moment(weekStart).add(i, 'd').format(format));
    }
    return days;
  }

  getDaysInMonth(currentDate = moment(), format: string = 'DD'): string[] {
    if (currentDate.isValid()) {
      const month = currentDate.startOf('M');
      const days: string[] = [];
      for (let i = 0; i < this.getNumberDayOfMonth(currentDate); i++) {
        days.push(moment(month).add(i, 'd').format(format));
      }
      return days;
    }
    return [];
  }

  getNumberDayOfMonth(currentDate = moment()): number {
    if (moment(currentDate).isValid()) {
      return Number(currentDate.daysInMonth());
    }
    return 0;
  }

  getHourInDay(): string[] {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      if (i % 2 === 0) {
        hours.push(moment().startOf('h').add(i, 'h').format('HH:mm'));
      }
    }
    return hours.sort();
  }
  dataCalender = (
    type: string | 'day' | 'week' | 'month',
    date: any,
    format: string = 'DD'
  ): { title: string; days: string[] } => {
    let title: string = '';
    let days: string[] = [];

    switch (type) {
      case ETypeCalendar.DAY:
        title = `Lịch ngày ${date.format('DD/MM/YYYY')}`;
        days = this.getHourInDay();
        break;
      case ETypeCalendar.WEEK:
        title = `Lịch tuần (${date
          .clone()
          .startOf('w')
          .add(1, 'd')
          .format('DD/MM')} - ${date
          .clone()
          .endOf('w')
          .add(1, 'd')
          .format('DD/MM/YYYY')})`;
        days = this.getDaysInWeek(date, format);
        break;
      case ETypeCalendar.MONTH:
        title = `Lịch tháng ${date.format('MM-YYYY')}`;
        days = this.getDaysInMonth(date, format);
        break;
      default:
        break;
    }
    return { title, days };
  };

  fakeData(data: any[]): any {
    return [
      {
        team: 'Team 1',
        users: [
          {
            name: 'is_quannm',
            shifts: [
              {
                shiftName: 'Ca 1',
                color: '#82ccdd',
              },
              {
                shiftName: 'Ca 2',
                color: '#78e08f',
              },
              {
                shiftName: 'Ca 3',
                color: '#fad390',
              },
              {
                shiftName: 'Ca 4',
                color: '#079992',
              },
              {
                shiftName: 'Ca 1',
                color: '#82ccdd',
              },
              {
                shiftName: 'Ca 2',
                color: '#78e08f',
              },
              {
                shiftName: 'Ca 3',
                color: '#fad390',
              },
            ],
          },
          {
            name: 'is_thangpd',
            shifts: [
              {
                shiftName: 'Ca 2',
                color: '#78e08f',
              },
              {
                shiftName: 'Ca 3',
                color: '#fad390',
              },
              {
                shiftName: 'Ca 4',
                color: '#079992',
              },
              {
                shiftName: 'Ca 1',
                color: '#82ccdd',
              },
              {
                shiftName: 'Ca 2',
                color: '#78e08f',
              },
              {
                shiftName: 'Ca 3',
                color: '#fad390',
              },
              {
                shiftName: 'Ca 4',
                color: '#079992',
              },
            ],
          },
          {
            name: 'is_đungt',
            shifts: [
              {
                shiftName: 'Ca 3',
                color: '#fad390',
              },
              {
                shiftName: 'Ca 4',
                color: '#079992',
              },
              {
                shiftName: 'Ca 1',
                color: '#82ccdd',
              },
              {
                shiftName: 'Ca 2',
                color: '#78e08f',
              },
              {
                shiftName: 'Ca 3',
                color: '#fad390',
              },
              {
                shiftName: 'Ca 4',
                color: '#079992',
              },
              {
                shiftName: 'Ca 1',
                color: '#82ccdd',
              },
            ],
          },
          {
            name: 'hainv',
            shifts: [
              {
                shiftName: 'Ca 4',
                color: '#079992',
              },
              {
                shiftName: 'Ca 1',
                color: '#82ccdd',
              },
              {
                shiftName: 'Ca 2',
                color: '#78e08f',
              },
              {
                shiftName: 'Ca 3',
                color: '#fad390',
              },
              {
                shiftName: 'Ca 4',
                color: '#079992',
              },
              {
                shiftName: 'Ca 1',
                color: '#82ccdd',
              },
              {
                shiftName: 'Ca 2',
                color: '#78e08f',
              },
            ],
          },
        ],
      },
      {
        team: 'Team 2',
        users: [
          {
            name: 'is_quannm',
            shifts: [
              {
                shiftName: 'Ca 1',
                color: '#82ccdd',
              },
              {
                shiftName: 'Ca 2',
                color: '#78e08f',
              },
              {
                shiftName: 'Ca 3',
                color: '#fad390',
              },
              {
                shiftName: 'Ca 4',
                color: '#079992',
              },
              {
                shiftName: 'Ca 1',
                color: '#82ccdd',
              },
              {
                shiftName: 'Ca 2',
                color: '#78e08f',
              },
              {
                shiftName: 'Ca 3',
                color: '#fad390',
              },
            ],
          },
        ],
      },
      {
        team: 'Team 3',
        users: [
          {
            name: 'is_thangpd',
            shifts: [
              {
                shiftName: 'Ca 2',
                color: '#78e08f',
              },
              {
                shiftName: 'Ca 3',
                color: '#fad390',
              },
              {
                shiftName: 'Ca 4',
                color: '#079992',
              },
              {
                shiftName: 'Ca 1',
                color: '#82ccdd',
              },
              {
                shiftName: 'Ca 2',
                color: '#78e08f',
              },
              {
                shiftName: 'Ca 3',
                color: '#fad390',
              },
              {
                shiftName: 'Ca 4',
                color: '#079992',
              },
            ],
          },
          {
            name: 'is_đungt',
            shifts: [
              {
                shiftName: 'Ca 3',
                color: '#fad390',
              },
              {
                shiftName: 'Ca 4',
                color: '#079992',
              },
              {
                shiftName: 'Ca 1',
                color: '#82ccdd',
              },
              {
                shiftName: 'Ca 2',
                color: '#78e08f',
              },
              {
                shiftName: 'Ca 3',
                color: '#fad390',
              },
              {
                shiftName: 'Ca 4',
                color: '#079992',
              },
              {
                shiftName: 'Ca 1',
                color: '#82ccdd',
              },
            ],
          },
          {
            name: 'hainv',
            shifts: [
              {
                shiftName: 'Ca 4',
                color: '#079992',
              },
              {
                shiftName: 'Ca 1',
                color: '#82ccdd',
              },
              {
                shiftName: 'Ca 2',
                color: '#78e08f',
              },
              {
                shiftName: 'Ca 3',
                color: '#fad390',
              },
              {
                shiftName: 'Ca 4',
                color: '#079992',
              },
              {
                shiftName: 'Ca 1',
                color: '#82ccdd',
              },
              {
                shiftName: 'Ca 2',
                color: '#78e08f',
              },
            ],
          },
        ],
      },
      {
        team: 'Team 5',
        users: [
          {
            name: 'is_quannm',
            shifts: [
              {
                shiftName: 'Ca 1',
                color: '#82ccdd',
              },
              {
                shiftName: 'Ca 2',
                color: '#78e08f',
              },
              {
                shiftName: 'Ca 3',
                color: '#fad390',
              },
              {
                shiftName: 'Ca 4',
                color: '#079992',
              },
              {
                shiftName: 'Ca 1',
                color: '#82ccdd',
              },
              {
                shiftName: 'Ca 2',
                color: '#78e08f',
              },
              {
                shiftName: 'Ca 3',
                color: '#fad390',
              },
            ],
          },
          {
            name: 'is_thangpd',
            shifts: [
              {
                shiftName: 'Ca 2',
                color: '#78e08f',
              },
              {
                shiftName: 'Ca 3',
                color: '#fad390',
              },
              {
                shiftName: 'Ca 4',
                color: '#079992',
              },
              {
                shiftName: 'Ca 1',
                color: '#82ccdd',
              },
              {
                shiftName: 'Ca 2',
                color: '#78e08f',
              },
              {
                shiftName: 'Ca 3',
                color: '#fad390',
              },
              {
                shiftName: 'Ca 4',
                color: '#079992',
              },
            ],
          },
          {
            name: 'is_đungt',
            shifts: [
              {
                shiftName: 'Ca 3',
                color: '#fad390',
              },
              {
                shiftName: 'Ca 4',
                color: '#079992',
              },
              {
                shiftName: 'Ca 1',
                color: '#82ccdd',
              },
              {
                shiftName: 'Ca 2',
                color: '#78e08f',
              },
              {
                shiftName: 'Ca 3',
                color: '#fad390',
              },
              {
                shiftName: 'Ca 4',
                color: '#079992',
              },
              {
                shiftName: 'Ca 1',
                color: '#82ccdd',
              },
            ],
          },
          {
            name: 'duytd',
            shifts: [
              {
                shiftName: 'Ca 1',
                color: '#82ccdd',
              },
              {
                shiftName: 'Ca 2',
                color: '#78e08f',
              },
              {
                shiftName: 'Ca 3',
                color: '#fad390',
              },
              {
                shiftName: 'Ca 4',
                color: '#079992',
              },
              {
                shiftName: 'Ca 1',
                color: '#82ccdd',
              },
              {
                shiftName: 'Ca 2',
                color: '#78e08f',
              },
              {
                shiftName: 'Ca 3',
                color: '#fad390',
              },
            ],
          },
        ],
      },
    ];
  }
}
