import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil, tap } from 'rxjs/operators';
import { LIST_STATUS } from 'src/app/shared/data-enum/list-status';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { IError } from 'src/app/shared/models/error.model';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { SortState } from 'src/app/_metronic/shared/crud-table';
import { EmployeeService, IEmployee } from '../../employee/employee.service';
import { IRole, UserService } from '../user.service';

@Component({
	selector: 'app-user-modal',
	templateUrl: './user-modal.component.html',
	styleUrls: ['./user-modal.component.scss'],
	providers: [DestroyService, FormBuilder]
})
export class UserModalComponent implements OnInit {
	@Input() accountId: number;
	listStatus = LIST_STATUS;
	roles: Array<IRole> = [];
	employees: Array<IEmployee> = [];
	userFormCreate: FormGroup;
	userFormUpdate: FormGroup;
	isUpdate = false;
	userNameAndCode = '';

	constructor(
		public modal: NgbActiveModal,
		private fb: FormBuilder,
		private userService: UserService,
		private employeeService: EmployeeService,
		private cdr: ChangeDetectorRef,
		private destroy$: DestroyService
	) {}

	ngOnInit(): void {
		const sortState = new SortState();
		sortState.direction = '';
		this.employeeService
			.getAllEmployees()
			.pipe(
				tap((res) => {
					this.employees = res.data;
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();
		if (this.accountId) {
			this.buildFormUpdate();
			this.isUpdate = true;
			this.userService
				.getUserById(this.accountId)
				.pipe(takeUntil(this.destroy$))
				.subscribe((res) => {
					this.userNameAndCode = `${res.data.employeeName} - ${res.data.employeeCode}`;
					this.userFormUpdate.patchValue(res.data);
				});
		} else {
			this.buildFormCreate();
		}

		this.userService
			.getRoles()
			.pipe(takeUntil(this.destroy$))
			.subscribe((res) => {
				this.roles = res.data;
				this.cdr.detectChanges();
			});
	}

	buildFormCreate(): void {
		this.userFormCreate = this.fb.group({
			employeeId: [null, Validators.required],
			username: [null, [Validators.required]],
			password: [null, [Validators.required]],
			roleIds: [[]],
			status: [this.listStatus.ACTIVE]
		});
	}

	buildFormUpdate(): void {
		this.userFormUpdate = this.fb.group({
			employeeId: [null, Validators.required],
			username: [null, [Validators.required]],
			roleIds: [[]],
			status: [null]
		});
	}

	onSubmit(): void {
		if (!this.isUpdate) {
			this.userFormCreate.markAllAsTouched();
			if (this.userFormCreate.invalid) {
				return;
			}
			this.userService
				.createUser(this.userFormCreate.value)
				.pipe(takeUntil(this.destroy$))
				.subscribe(
					(res) => this.closeModal(res),
					(err: IError) => this.checkError(err)
				);
		} else {
			this.userFormUpdate.markAllAsTouched();
			if (this.userFormUpdate.invalid) {
				return;
			}
			this.userService
				.updateUser(this.accountId, this.userFormUpdate.value)
				.pipe(takeUntil(this.destroy$))
				.subscribe(
					(res) => this.closeModal(res),
					(err: IError) => this.checkError(err)
				);
		}
	}

	closeModal(res: DataResponse<any>) {
		if (res.data) {
			this.modal.close(true);
		}
	}

	checkError(err: IError) {
		if (err.code === 'SUN-OIL-4179') {
			this.userFormCreate.get('username').setErrors({ existed: true });
		}
		if (err.code === 'SUN-OIL-4183') {
			this.userFormCreate.get('employeeId').setErrors({ existed: true });
		}
	}

	onClose(): void {
		this.modal.close();
	}
}
