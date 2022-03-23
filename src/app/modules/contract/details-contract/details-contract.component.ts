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

export interface IAttachment {
  id: number;
  url: string;
  name: string;
}

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
  detailImage: IAttachment;
  contractId;

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
          this.contractId = contractId;
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

		await modalRef.result.then((result) => {
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

		await modalRef.result.then((result) => {
			if (result) {
				this.router.navigate(['/hop-dong/danh-sach']);
			}
		});
	}

  viewImages(content, item): void {
    this.modalService.open(content, { size: 'lg' });
    this.detailImage = item.file !== null ? item.file[0] : null;
  }

	downloadFile(fileId: string, fileName: string) {
		return this.fileService.downloadFile(fileId, fileName);
	}
}
