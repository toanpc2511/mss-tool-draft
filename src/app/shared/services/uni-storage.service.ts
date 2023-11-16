import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UniStorageService {

  constructor() {
  }

  getUserInfo(): any {
    return JSON.parse(localStorage.getItem('userInfo'));
  }

  setItem(key: string, value: any): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  getItem(key: string): any {
    return JSON.parse(sessionStorage.getItem(key));
  }
}
