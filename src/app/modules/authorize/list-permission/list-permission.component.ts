import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ConfirmDeleteComponent } from 'src/app/shared/components/confirm-delete/confirm-delete.component';
import { IConfirmModalData } from 'src/app/shared/models/confirm-delete.interface';
import { IError } from 'src/app/shared/models/error.model';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { FilterService } from 'src/app/shared/services/filter.service';
import { SortService } from 'src/app/shared/services/sort.service';
import { FilterField, SortState } from 'src/app/_metronic/shared/crud-table';
import { IRole } from '../../user/user.service';
import { PermissionModalComponent } from '../permission-modal/permission-modal.component';
import { PermissionService } from '../permission.service';

@Component({
	selector: 'app-list-permission',
	templateUrl: './list-permission.component.html',
	styleUrls: ['./list-permission.component.scss'],
	providers: [SortService, FilterService, DestroyService]
})
export class ListPermissionComponent implements OnInit {
	searchFormControl: FormControl = new FormControl();
	dataSource: Array<IRole> = [];
	dataSourceTemp: Array<IRole> = [];
	sorting: SortState;
	filterField = new FilterField({ name: null });

	constructor(
		private permissionService: PermissionService,
		private sortService: SortService<IRole>,
		private filterService: FilterService<IRole>,
		private cdr: ChangeDetectorRef,
		private destroy$: DestroyService,
		private modalService: NgbModal,
		private toastr: ToastrService
	) {
		this.sorting = sortService.sorting;
	}

	ngOnInit() {
		this.getRoles();

		this.searchFormControl.valueChanges
			.pipe(debounceTime(500), takeUntil(this.destroy$))
			.subscribe((value) => {
				if (value.trim()) {
					this.filterField.setFilterFieldValue(value.trim());
				} else {
					this.filterField.setFilterFieldValue(null);
				}

				// Set data after filter and apply current sorting
				this.dataSource = this.sortService.sort(
					this.filterService.filter(
						this.dataSourceTemp,
						this.filterField.field
					)
				);
				this.cdr.detectChanges();
			});
	}

	getRoles() {
		this.permissionService
			.getRoles()
			.pipe(takeUntil(this.destroy$))
			.subscribe((res) => {
				this.dataSource = this.dataSourceTemp = res.data;
				// Set data after filter and apply current sorting
				this.dataSource = this.sortService.sort(
					this.filterService.filter(
						this.dataSourceTemp,
						this.filterField.field
					)
				);
				this.cdr.detectChanges();
			});
	}

	sort(column: string) {
		this.dataSource = this.sortService.sort(this.dataSourceTemp, column);
	}

	deleteRole(role: IRole): void {
		const modalRef = this.modalService.open(ConfirmDeleteComponent, {
			backdrop: 'static'
		});
		const data: IConfirmModalData = {
			title: 'Xác nhận',
			message: `Bạn có chắc chắn muốn xoá thông tin quyền ${role.name}?`,
			button: { class: 'btn-primary', title: 'Xác nhận' }
		};
		modalRef.componentInstance.data = data;

		modalRef.result.then((result) => {
			if (result) {
				this.permissionService
					.deleteRole(role.id)
					.pipe(takeUntil(this.destroy$))
					.subscribe(
						() => {
							this.getRoles();
						},
						(err: IError) => this.checkError(err)
					);
			}
		});
	}

	openRoleModal(roleId?: number) {
		const modalRef = this.modalService.open(PermissionModalComponent, {
			backdrop: 'static',
			size: 'xl'
		});
		// Sử dụng api get user by id để lấy data fill vào form sửa
		if (roleId) {
			modalRef.componentInstance.roleId = roleId;
		}
		modalRef.result.then((result) => {
			if (result) {
				this.getRoles();
			}
		});
	}

	checkError(error: IError) {
		if (error.code === 'SUN-OIL-4193') {
			this.toastr.error(
				'Không thể xóa vì có người dùng đang được gắn nhóm quyền này'
			);
		}
	}
}
