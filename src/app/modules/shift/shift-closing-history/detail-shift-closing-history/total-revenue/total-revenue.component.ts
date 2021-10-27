import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  IDataTransfer,
  ModalConfirmLockShiftComponent
} from './modal-confirm-lock-shift/modal-confirm-lock-shift.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DestroyService } from '../../../../../shared/services/destroy.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-total-revenue',
  templateUrl: './total-revenue.component.html',
  styleUrls: ['./total-revenue.component.scss'],
  providers: [DestroyService]
})
export class TotalRevenueComponent implements OnInit {
  listTotalRevenue;
  revenue = 34567890000;
  total = 10000;

  proceeds: FormControl;
  hideButton = true;
  stationId: number;
  lockShiftId: number;

  constructor(
    private modalService: NgbModal,
    private destroy$: DestroyService,
    private activeRoute: ActivatedRoute,
    ) {
    this.proceeds = new FormControl();
    this.listTotalRevenue = [
      {
        productName: 'abc',
        unit: 'Chiếc',
        quantity: 567890100,
        revenue: 4567000
      },
      {
        productName: '56789iuythjaff dfdss ',
        unit: 'Lon',
        quantity: 234234200,
        revenue: 77000
      },
      {
        productName: 'weqweqf erwer ',
        unit: 'Chiếc',
        quantity: 32000,
        revenue: 4567000
      }
    ]
  }

  ngOnInit(): void {
    this.proceeds.setValue(false);

    this.activeRoute.params.subscribe((res)  => {
      this.lockShiftId = res.lockShiftId;
    });

    this.activeRoute.queryParams.subscribe((x) => {
      this.stationId = x.stationId;
    })
  }

  changeCheckProceed() {
    this.hideButton = !this.hideButton;
  }

  createModal($event: Event): void {
    if ($event) {
      $event.stopPropagation();
    }
    const modalRef = this.modalService.open(ModalConfirmLockShiftComponent, {
      backdrop: 'static',
      size: 'lg'
    });

    modalRef.componentInstance.data = {
      title: 'Xác nhận',
      stationId: this.stationId,
      lockShiftOldId: this.lockShiftId
    };
  }

  printReport() {
    console.log(this.proceeds.value);
  }

}
