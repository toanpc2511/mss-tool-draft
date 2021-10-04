import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { DestroyService } from '../../../shared/services/destroy.service';

@Component({
  selector: 'app-shift-work-config-modal',
  templateUrl: './shift-work-config-modal.component.html',
  styleUrls: ['./shift-work-config-modal.component.scss'],
  providers: [DestroyService, FormBuilder]
})
export class ShiftWorkConfigModalComponent implements OnInit {
  @ViewChild('btnSave', { static: true }) btnSave: ElementRef;
  @Input() data: IDataTransfer;

  hours: Array<any> = [];
  minutes: Array<any> = [];
  item;
  item2;

  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    for (let i = 0; i <= 24; i++) {
      i < 10 ? this.item = (`0${i}`) : this.item = i.toString();
      this.hours.push(this.item)
    }

    for (let i = 0; i <= 60; i = i + 15) {
      i < 10 ? this.item = (`0${i}`) : this.item = i.toString();
      this.minutes.push(this.item)
    }
  }

  add() {}

  onClose() {
    this.modal.close();
  }
}

export interface IDataTransfer {
  title: string;
  shiftConfig?: any;
}
