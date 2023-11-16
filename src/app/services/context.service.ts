import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContextService {
  public sharedData:any
  constructor() { }
  set contextData(data) {
    this.sharedData = data;
  }
  get contextData() {
    return this.sharedData
  }
}
