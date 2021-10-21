import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { IShiftConfig } from '../../shift.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IError } from '../../../../shared/models/error.model';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss'],
  providers: [DestroyService]
})
export class ModalConfirmComponent implements OnInit {
  @ViewChild('btnSave', { static: true }) btnSave: ElementRef;
  @Input() data: IDataTransfer;
  dataSource;

  constructor(
    public modal: NgbActiveModal,
    private destroy$: DestroyService,
    private router: Router,
  ) {
    this.dataSource = [
      {
        code: 'KJHD554541',
        pumpPole: 'Cột 4',
        pumpHole: 'Vòi 2',
        status: 'New'
      },
      {
        code: 'LJDJ55411',
        pumpPole: 'Cột 5',
        pumpHole: 'Vòi 4',
        status: 'New'
      },
    ]
  }

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
        this.modal.close();
        this.router.navigate([`/ca-lam-viec/lich-su-chot-ca/chi-tiet/${this.data.id}`]);
      });
  }

}

export interface IDataTransfer {
  title: string;
  id: number;
}
