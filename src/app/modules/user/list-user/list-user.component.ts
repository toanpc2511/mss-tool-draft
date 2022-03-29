import { BaseComponent } from './../../../shared/components/base/base.component';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ConfirmDeleteComponent } from 'src/app/shared/components/confirm-delete/confirm-delete.component';
import { LIST_STATUS } from 'src/app/shared/data-enum/list-status';
import { IConfirmModalData } from 'src/app/shared/models/confirm-delete.interface';
import { IError } from 'src/app/shared/models/error.model';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import {
	IPaginatorState,
	PaginatorState
} from 'src/app/_metronic/shared/crud-table';
import { UserModalComponent } from '../user-modal/user-modal.component';
import { ISortData, IUser, UserService } from '../user.service';

@Component({
	selector: 'app-list-user',
	templateUrl: './list-user.component.html',
	styleUrls: ['./list-user.component.scss'],
	providers: [DestroyService]
})
export class ListUserComponent extends BaseComponent implements OnInit {
	searchFormControl: FormControl = new FormControl();
	sortData: ISortData;
	status = LIST_STATUS;
	dataSource: Array<IUser> = [];
	paginatorState = new PaginatorState();

	constructor(
		private userService: UserService,
		private cdr: ChangeDetectorRef,
		private destroy$: DestroyService,
		private modalService: NgbModal,
		private toastr: ToastrService
	) {
		super();
		this.init();
	}

	init() {
		this.paginatorState.page = 1;
		this.paginatorState.pageSize = 15;
		this.paginatorState.pageSizes = [5, 10, 15, 20];
		this.paginatorState.total = 0;
		this.sortData = null;
	}

	ngOnInit() {
		this.getUsers();

		// Filter
		this.searchFormControl.valueChanges
			.pipe(
				debounceTime(400),
				switchMap(() => {
					return this.userService.getUsers(
						this.paginatorState.page,
						this.paginatorState.pageSize,
						this.searchFormControl.value,
						this.sortData
					);
				}),
				tap((res) => {
					this.checkRes(res);
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	checkRes(res) {
		this.dataSource = res.data;
		this.paginatorState.recalculatePaginator(res.meta.total);
		this.cdr.detectChanges();
	}

	getUsers() {
		this.userService
			.getUsers(
				this.paginatorState.page,
				this.paginatorState.pageSize,
				this.searchFormControl.value,
				this.sortData
			)
			.subscribe((res) => {
				this.checkRes(res);
			});
	}

	sort(column: string) {
		if (this.sortData && this.sortData.fieldSort === column) {
			if (this.sortData.directionSort === 'ASC') {
				this.sortData = { fieldSort: column, directionSort: 'DESC' };
			} else {
				this.sortData = null;
			}
		} else {
			this.sortData = { fieldSort: column, directionSort: 'ASC' };
		}
		this.getUsers();
	}

	deleteUser(user: IUser): void {
		const modalRef = this.modalService.open(ConfirmDeleteComponent, {
			backdrop: 'static'
		});
		const data: IConfirmModalData = {
			title: 'Xác nhận',
			message: `Bạn có chắc chắn muốn xoá thông tin ${user.username}?`,
			button: { class: 'btn-primary', title: 'Xác nhận' }
		};
		modalRef.componentInstance.data = data;

		modalRef.result.then((result) => {
			if (result) {
				this.userService.deleteUser(user.accountId).subscribe(
					(res) => {
						if (res.data) {
							this.init();
							this.getUsers();
						}
					},
					(err: IError) => {
						this.checkError(err);
					}
				);
			}
		});
	}

	resetPassword(user: IUser): void {
		const modalRef = this.modalService.open(ConfirmDeleteComponent, {
			backdrop: 'static'
		});
		const data: IConfirmModalData = {
			title: 'Xác nhận',
			message: `Bạn có chắc chắn muốn đặt lại mật khẩu cho tài khoản: ${user.username}?`,
			button: { class: 'btn-primary', title: 'Xác nhận' }
		};
		modalRef.componentInstance.data = data;

		modalRef.result.then((result) => {
			if (result) {
				this.userService.resetPassword(user.accountId).subscribe(
					(res) => {
						if (res.data) {
							this.init();
							this.getUsers();
              this.toastr.success('Đặt lại mật khẩu thành công. Mật khẩu mới của bạn là:123456789')
						}
					},
					(err: IError) => {
						this.checkError(err);
					}
				);
			}
		});
	}

	openUserModal(accountId?: string) {
		const modalRef = this.modalService.open(UserModalComponent, {
			backdrop: 'static',
			size: 'xl'
		});
		// Sử dụng api get user by id để lấy data fill vào form sửa
		if (accountId) {
			modalRef.componentInstance.accountId = accountId;
		}
		modalRef.result.then((result) => {
			if (result) {
				this.init();
				this.getUsers();
			}
		});
	}

	checkError(error: IError) {
		return error;
	}

	pagingChange($event: IPaginatorState) {
		this.paginatorState = $event as PaginatorState;
		this.getUsers();
	}
}
