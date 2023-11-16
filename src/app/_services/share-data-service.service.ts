import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareDataServiceService {

  private dataSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isView: Observable<boolean> = this.dataSource.asObservable();

  constructor() { }

  sendData(data: boolean): void {
    this.dataSource.next(data);
  }

}
