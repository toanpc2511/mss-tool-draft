import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { BrandModalComponent } from './brand-modal/brand-modal.component';
import { ConfirmDeleteComponent } from 'src/app/shared/components/confirm-delete/confirm-delete.component';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { IConfirmModalData } from 'src/app/shared/models/confirm-delete.interface';

@Component({
	selector: 'app-brand-management',
	templateUrl: './brand-management.component.html',
	styleUrls: ['./brand-management.component.scss']
})
export class BrandManagementComponent implements OnInit {
	isLoading$: Observable<boolean>;
	listBrand: any[] = [];
	constructor(
		private modalService: NgbModal,
		private sharedService: SharedService,
		private authService: AuthService,
		private cdr: ChangeDetectorRef,
		private toastr: ToastrService
	) {
		this.isLoading$ = this.authService.isLoading$;
	}

	ngOnInit(): void {
		this.getListBrand();
	}

	getListBrand() {
		this.sharedService.getBrands().subscribe((res) => {
			this.listBrand = res.data;
			this.cdr.detectChanges();
		});
	}

	create() {
		this.edit(undefined);
	}

	edit(data: any) {
		const modalRef = this.modalService.open(BrandModalComponent, {
			centered: true,
			size: 'lg'
		});
		modalRef.componentInstance.data = data;

		modalRef.result.then((result) => {
			if (result) {
				this.getListBrand();
			}
		});
	}

	delete(brand: { id: string; name: string }) {
		const modalRef = this.modalService.open(ConfirmDeleteComponent, {
			backdrop: 'static'
		});
		const data: IConfirmModalData = {
			title: 'Xác nhận',
			message: `Bạn có chắc chắn muốn xoá danh mục <strong>${brand.name} </strong>?`,
			button: { class: 'btn-primary', title: 'Xác nhận' }
		};
		modalRef.componentInstance.data = data;

		modalRef.result.then((result) => {
			if (result) {
				this.sharedService.deleteBrand(brand.id).subscribe(
					() => {
						this.getListBrand();
						this.toastr.success('Xoá hãng sản xuất thành công!', 'Thông báo');
					},
					(error) => {
						console.log(error);
					}
				);
			}
		});
	}
}
