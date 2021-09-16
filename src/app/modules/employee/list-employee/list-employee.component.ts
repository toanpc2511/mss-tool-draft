import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, switchMap, takeUntil, tap } from 'rxjs/operators';
import { NO_EMIT_EVENT } from 'src/app/shared/app-constants';
import { ConfirmDeleteComponent } from 'src/app/shared/components/confirm-delete/confirm-delete.component';
import { LIST_STATUS } from 'src/app/shared/data-enum/list-status';
import { IConfirmModalData } from 'src/app/shared/models/confirm-delete.interface';
import { IError } from 'src/app/shared/models/error.model';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { IPaginatorState, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { EmployeeModalComponent } from '../employee-modal/employee-modal.component';
import { IEmployee, EmployeeService, IDepartment, IPosition } from '../employee.service';

@Component({
	selector: 'app-list-employee',
	templateUrl: './list-employee.component.html',
	styleUrls: ['./list-employee.component.scss'],
	providers: [DestroyService]
})
export class ListEmployeeComponent implements OnInit {
	searchFormControl: FormControl = new FormControl();
	sortData: SortState;
	status = LIST_STATUS;
	dataSource: Array<IEmployee> = [];
	paginatorState = new PaginatorState();

	departmentControl = new FormControl();
	positionControl = new FormControl();
	departments: IDepartment[] = [];
	positions: IPosition[] = [];

	constructor(
		private employeeService: EmployeeService,
		private cdr: ChangeDetectorRef,
		private destroy$: DestroyService,
		private modalService: NgbModal,
		private router: Router,
		private toastr: ToastrService
	) {
		this.init();
	}

	init() {
		this.paginatorState.page = 1;
		this.paginatorState.pageSize = 15;
		this.paginatorState.pageSizes = [5, 10, 15, 20];
		this.paginatorState.total = 0;
		this.sortData = null;
	}

	getAllDepartment() {
		this.employeeService
			.getAllDepartment()
			.pipe(
				tap((res) => {
					this.departments = res.data;
					this.cdr.detectChanges();
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	handleSelectDepartment() {
		this.departmentControl.valueChanges
			.pipe(
				switchMap((value: number) => {
					const selectedDepartment = this.departments.find((d) => d.id === Number(value));
					return this.employeeService.getPositionByDepartment(
						selectedDepartment?.departmentType || ''
					);
				}),
				tap((res) => {
					this.positionControl.patchValue(null, NO_EMIT_EVENT);
					this.positions = res.data;
					this.cdr.detectChanges();
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	ngOnInit() {
		this.getEmployees();
		this.getAllDepartment();
		this.handleSelectDepartment();

		// Filter
		this.searchFormControl.valueChanges
			.pipe(
				debounceTime(400),
				switchMap(() => {
					return this.employeeService.getEmployees(
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

	getEmployees() {
		this.employeeService
			.getEmployees(
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
		if (this.sortData && this.sortData.column === column) {
			if (this.sortData.direction === 'ASC') {
				this.sortData = { column, direction: 'DESC' };
			} else {
				this.sortData = null;
			}
		} else {
			this.sortData = { column, direction: 'ASC' };
		}
		this.getEmployees();
	}

	deleteEmployee(employee: IEmployee): void {
		const modalRef = this.modalService.open(ConfirmDeleteComponent, {
			backdrop: 'static'
		});
		const data: IConfirmModalData = {
			title: 'Xác nhận',
			message: `Bạn có chắc chắn muốn xoá thông tin ${employee.code} - ${employee.name}?`,
			button: { class: 'btn-primary', title: 'Xác nhận' }
		};
		modalRef.componentInstance.data = data;

		modalRef.result.then((result) => {
			if (result) {
				this.employeeService.deleteEmployee(1).subscribe(
					(res) => {
						if (res.data) {
							this.init();
							this.getEmployees();
						}
					},
					(err: IError) => {
						this.checkError(err);
					}
				);
			}
		});
	}

	openEmployeeModal(employeeId?: number) {
		if (!employeeId) {
			this.router.navigate(['/nhan-vien/danh-sach/them-moi']);
		} else {
			this.router.navigate([`/nhan-vien/danh-sach/sua-nhan-vien/${employeeId}`]);
		}
	}

	checkError(error: IError) {
		return error;
	}

	pagingChange($event: IPaginatorState) {
		this.paginatorState = $event as PaginatorState;
		this.getEmployees();
	}
}
