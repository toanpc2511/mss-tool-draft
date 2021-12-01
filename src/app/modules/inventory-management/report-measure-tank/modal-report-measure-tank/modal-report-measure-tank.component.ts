import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IError } from '../../../../shared/models/error.model';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { IMeasures } from '../../inventory-management.service';

@Component({
  selector: 'app-modal-report-measure-tank',
  templateUrl: './modal-report-measure-tank.component.html',
  styleUrls: ['./modal-report-measure-tank.component.scss'],
  providers: [DestroyService]
})
export class ModalReportMeasureTankComponent implements OnInit {
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
    fromEvent(this.btnSave.nativeElement, 'click')
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

export interface IDataTransfer {
  title: string;
  dataDetail?: IMeasures;
}
