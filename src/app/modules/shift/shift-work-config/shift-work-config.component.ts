import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  IDataTransfer,
  ShiftWorkConfigModalComponent
} from '../shift-work-config-modal/shift-work-config-modal.component';

@Component({
  selector: 'app-shift-work-config',
  templateUrl: './shift-work-config.component.html',
  styleUrls: ['./shift-work-config.component.scss']
})
export class ShiftWorkConfigComponent implements OnInit {
  searchFormControl: FormControl;
  dataRes: Array<any> = [];

  constructor(
    private modalService: NgbModal,
    ) {
    this.dataRes = [
      {
        name: 'Ca sáng',
        start: '6:30',
        end: '8:30',
        detail: 'Ca sáng (6:30 - 8:30), nghỉ (7:30 - 7:45)'
      },
      {
        name: 'Ca đêm',
        start: '18:30',
        end: '20:30',
        detail: 'Ca đêm (19:30 - 20:30), nghỉ (19:45 - 20:00)'
      },
      {
        name: 'Ca ngày',
        start: '00:00',
        end: '23:59',
        detail: 'Ca ngày (6:30 - 8:30), nghỉ (7:30 - 7:45)'
      },
      {
        name: 'Ca gãy',
        start: '00:00',
        end: '06:00 Hôm sau',
        detail: 'Ca gãy (6:30 - 8:30), nghỉ (7:30 - 7:45)'
      }
    ]
  }

  ngOnInit(): void {
    console.log();
  }

  updateShiftConfig(event: Event, item: any) {
    console.log(item);
  }

  deleteShiftConfig(event: Event, item: any) {
    console.log(item);
  }

  createModal($event?: Event, data?: IDataTransfer): void {
    if ($event) {
      $event.stopPropagation();
    }
    const modalRef = this.modalService.open(ShiftWorkConfigModalComponent, {
      backdrop: 'static',
      size: 'lg'
    });

    modalRef.componentInstance.data = {
      title: data ? 'Sửa ca' : 'Thêm ca',
      product: data
    };

    modalRef.result.then((result) => {
      if (result) {
        console.log('done');
      }
    });
  }
}
