import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContractService, EContractStatus } from '../contract.service';
import { DestroyService } from '../../../shared/services/destroy.service';
import { filter, pluck, switchMap, takeUntil } from 'rxjs/operators';
import { IError } from '../../../shared/models/error.model';
import { IDataTransfer, RejectContractModalComponent } from './reject-contract-modal/reject-contract-modal.component';
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

	constructor(
		private router: Router,
		private modalService: NgbModal,
		private contractService: ContractService,
		private cdr: ChangeDetectorRef,
		private destroy$: DestroyService,
    private fileService: FileService,
		private activeRoute: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.getContractById();
	}

	getContractById() {
		this.activeRoute.params
			.pipe(
				pluck('id'),
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
		await this.router.navigate(['/hop-dong/danh-sach']);
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
      type: 'REJECT'
    };

    modalRef.result.then((result) => {
      if (result) {
        this.router.navigate(['/hop-dong/danh-sach']);
      }
    });
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
      type: 'ACCEPTED'
    };

    modalRef.result.then((result) => {
      if (result) {
        this.router.navigate(['/hop-dong/danh-sach']);
      }
    });
  }

	downloadFile(fileUrl: string) {
    this.fileService.downloadFile(fileUrl);
  }

  checkError(err: IError) {}
}
