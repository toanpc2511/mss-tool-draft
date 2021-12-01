import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IShallow } from '../../inventory-management.service';

@Component({
  selector: 'app-modal-report-min-tank',
  templateUrl: './modal-report-min-tank.component.html',
  styleUrls: ['./modal-report-min-tank.component.scss'],
  providers: [DestroyService]
})
export class ModalReportMinTankComponent implements OnInit {
  @Input() data: IDataTransfer;
  @ViewChild('btnSave', { static: true }) btnSave: ElementRef;

  constructor(
    public modal: NgbActiveModal,
    private destroy$: DestroyService
  ) { }

  ngOnInit(): void {
    this.onSubmit();
  }

  onClose() {
    this.modal.close();
  }

  onSubmit(): void {
    if (this.btnSave) {
      fromEvent(this.btnSave?.nativeElement, 'click')
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          // this.productForm.markAllAsTouched();
          // if (this.productForm.invalid) {
          //   return;
          // }
          if (!this.data.dataDetail) {
            console.log('new');
          } else {
            console.log('update');
          }
        });
    }
  }
}

export interface IDataTransfer {
  title: string;
  dataDetail?: IShallow;
}
