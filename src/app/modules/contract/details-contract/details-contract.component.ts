import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContractService, EContractStatus } from '../contract.service';
import { DestroyService } from '../../../shared/services/destroy.service';
import { filter, pluck, switchMap, takeUntil } from 'rxjs/operators';

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

	goToListContract() {
		this.router.navigate(['/hop-dong/danh-sach']);
		// const modalRef = this.modalService.open(ConfirmDeleteComponent, {
		//   backdrop: 'static'
		// });
		// const data: IConfirmModalData = {
		//   title: 'Xác nhận',
		//   message: `Bạn có muốn quay lại xem danh sách hợp đồng ?`,
		//   button: { class: 'btn-primary', title: 'Xác nhận' }
		// };
		// modalRef.componentInstance.data = data;
		//
		// modalRef.result.then((result) => {
		//   if (result) {
		//     this.router.navigate(['/hop-dong/danh-sach']);
		//   }
		// });
	}

	downloadFile(fileUrl: string) {}
}
