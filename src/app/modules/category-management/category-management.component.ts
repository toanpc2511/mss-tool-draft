import { SharedService } from 'src/app/shared/services/shared.service';
import { IConfirmModalData } from './../../shared/models/confirm-delete.interface';
import { ConfirmDeleteComponent } from './../../shared/components/confirm-delete/confirm-delete.component';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { Observable } from 'rxjs';
import { ModalCategoryComponent } from './modal-category/modal-category.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ICategory } from 'src/app/shared/models/shared.interface';

@Component({
	selector: 'app-category-management',
	templateUrl: './category-management.component.html',
	styleUrls: ['./category-management.component.scss']
})
export class CategoryManagementComponent implements OnInit {
	isLoading$: Observable<boolean>;
	categories: ICategory[] = [];
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
		this.getListCategory();
	}

	getListCategory() {
		this.sharedService.getListCategory().subscribe((res) => {
			this.categories = res;
			this.cdr.detectChanges();
		});
	}

	create() {
		this.edit(undefined);
	}

	edit(data: any) {
		const modalRef = this.modalService.open(ModalCategoryComponent, {
			centered: true,
			size: 'lg'
		});
		modalRef.componentInstance.data = data;

		modalRef.result.then((result) => {
			if (result) {
				this.getListCategory();
			}
		});
	}

	delete(categogy: ICategory) {
		const modalRef = this.modalService.open(ConfirmDeleteComponent, {
			backdrop: 'static'
		});
		const data: IConfirmModalData = {
			title: 'Xác nhận',
			message: `Bạn có chắc chắn muốn xoá danh mục ${categogy.name}?`,
			button: { class: 'btn-primary', title: 'Xác nhận' }
		};
		modalRef.componentInstance.data = data;

		modalRef.result.then((result) => {
			if (result) {
				this.sharedService.deleteCategory(categogy.id).subscribe(
					() => {
						this.getListCategory();
						this.toastr.success('Xoá danh mục thành công!', 'Thông báo');
					},
					(error) => {
						console.log(error);
					}
				);
			}
		});
	}
}
