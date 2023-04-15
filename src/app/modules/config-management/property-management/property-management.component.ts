import { ModalPropertyComponent } from './modal-property/modal-property.component';
import { SharedService } from './../../../shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './../../auth/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { ConfirmDeleteComponent } from './../../../shared/components/confirm-delete/confirm-delete.component';
import { IConfirmModalData } from './../../../shared/models/confirm-delete.interface';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
	selector: 'app-property-management',
	templateUrl: './property-management.component.html',
	styleUrls: ['./property-management.component.scss']
})
export class PropertyManagementComponent implements OnInit {
	isLoading$: Observable<boolean>;
	listProperty: any[] = [];
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
		this.getListProperty();
	}

	getListProperty() {
		this.sharedService.getListProperty().subscribe((res) => {
			this.handleData(res.data);
			this.cdr.detectChanges();
		});
	}

	handleData(data: any[]) {
		this.listProperty = data.map((item) => ({
			...item,
			catagories: item.categoryProductAttributes.map((categoryItem) => {
				return categoryItem.category;
			}),
			categoryNames: item.categoryProductAttributes.map((categoryItem) => {
				return categoryItem.category.name;
			}),
			categoryIds: item.categoryProductAttributes.map((categoryItem) => {
				return categoryItem.category.id;
			})
		}));
	}

	create() {
		this.edit(undefined);
	}

	edit(data: any) {
		const modalRef = this.modalService.open(ModalPropertyComponent, {
			centered: true,
			backdrop: false,
			backdropClass: 'back-drop',
			size: 'lg'
		});
		modalRef.componentInstance.data = data;

		modalRef.result.then((result) => {
			if (result) {
				this.getListProperty();
			}
		});
	}

	delete(property) {
		const modalRef = this.modalService.open(ConfirmDeleteComponent, {
			backdrop: false,
			centered: true
		});
		const data: IConfirmModalData = {
			title: 'Xác nhận',
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			message: `Bạn có chắc chắn muốn thuộc tính ${property.name}?`,
			button: { class: 'btn-primary', title: 'Xác nhận' }
		};
		modalRef.componentInstance.data = data;

		modalRef.result.then((result) => {
			if (result) {
				this.sharedService.deleteProperty(property.id).subscribe(
					() => {
						this.getListProperty();
						this.toastr.success('Xoá thuộc tính thành công!', 'Thông báo');
					},
					(error) => {
						console.log(error);
					}
				);
			}
		});
	}
}
