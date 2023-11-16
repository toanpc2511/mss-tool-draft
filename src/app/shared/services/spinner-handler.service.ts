import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerHandlerService {
  loadingSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private loadingMap: Map<string, boolean> = new Map<string, boolean>();
  private skipSpinnerMap: Map<string, boolean> = new Map<string, boolean>();

  constructor() {}

  setLoading(loading: boolean, url: string): void {
    if (this.skipSpinnerMap.has(url)) {
      this.skipSpinnerMap.delete(url);
    } else {
      if (loading === true) {
        this.loadingMap.set(url, loading);
        this.loadingSub.next(true);
      } else if (loading === false && this.loadingMap.has(url)) {
        this.loadingMap.delete(url);
      }
    }

    if (this.loadingMap.size === 0) {
      this.loadingSub.next(false);
    }
  }

  setSkipSpinner(code: string): void {
    this.skipSpinnerMap.set(code, true);
  }
}
