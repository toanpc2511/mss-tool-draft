import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContractService, EContractStatus } from '../contract.service';
import { DestroyService } from '../../../shared/services/destroy.service';
import { filter, pluck, switchMap, takeUntil } from 'rxjs/operators';
import {
  IDataTransfer,
  RejectContractModalComponent
} from './reject-contract-modal/reject-contract-modal.component';
import { FileService } from 'src/app/shared/services/file.service';

@Component({
  selector: 'app-details-contract',
  templateUrl: './details-contract.component.html',
  styleUrls: ['./details-contract.component.scss'],
  providers: [DestroyService]
})
export class DetailsContractComponent implements OnInit {
  eContractStatus = EContractStatus;
  data;
  dataDetail;
  customerId;
  contractId;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private contractService: ContractService,
    private cdr: ChangeDetectorRef,
    private destroy$: DestroyService,
    private fileService: FileService,
    private activeRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.getContractById();
  }

  getContractById() {
    this.activeRoute.params.subscribe((res) => {
      this.customerId = res.customerId;
      this.contractId = res.contractId;
    });

    this.activeRoute.params
      .pipe(
        pluck('contractId'),
        filter((contractId: number) => !!contractId),
        switchMap((contractId: number) => {
          return this.contractService.getContractById(contractId);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((res) => {
        this.data = res.data;
        this.cdr.detectChanges();
      });
  }

  async goToListContract() {
    if (this.customerId) {
      await this.router.navigate([`/khach-hang/danh-sach/chi-tiet/${this.customerId}`]);
    } else {
      await this.router.navigate(['/hop-dong/danh-sach']);
    }
  }

  async refuseContract($event?: Event, data?: IDataTransfer) {
    if ($event) {
      $event.stopPropagation();
    }
    const modalRef = this.modalService.open(RejectContractModalComponent, {
      backdrop: 'static',
      size: 'lg'
    });

    modalRef.componentInstance.data = {
      title: 'Từ chối hợp đồng',
      contract: data,
      type: 'REJECT',
      customerId: this.customerId
    };
  }

  async acceptContract($event?: Event, data?: IDataTransfer) {
    if ($event) {
      $event.stopPropagation();
    }
    const modalRef = this.modalService.open(RejectContractModalComponent, {
      backdrop: 'static',
      size: 'lg'
    });

    modalRef.componentInstance.data = {
      title: 'Xác nhận hợp đồng',
      contract: data,
      type: 'ACCEPTED',
      customerId: this.customerId
    };
  }

  downloadFile(fileId: string, fileName: string) {
    return this.fileService.downloadFile(fileId, fileName);
  }
}
