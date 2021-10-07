import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-calendar-modal',
  templateUrl: './create-calendar-modal.component.html',
  styleUrls: ['./create-calendar-modal.component.scss']
})
export class CreateCalendarModalComponent implements OnInit {
  @ViewChild('btnSave', { static: true }) btnSave: ElementRef;
  @Input() data: IDataTransfer;


  constructor(
    public modal: NgbActiveModal,
    ) { }

  ngOnInit(): void {
  }

  onClose() {
    this.modal.close();
  }

  addItem() {
    console.log('Add');
  }

}

export interface IDataTransfer {
  title: string;
}
