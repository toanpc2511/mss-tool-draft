import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { merge, of } from 'rxjs';
import { debounceTime, switchMap, takeUntil, tap } from 'rxjs/operators';
import { NO_EMIT_EVENT } from 'src/app/shared/app-constants';
import { ConfirmDeleteComponent } from 'src/app/shared/components/confirm-delete/confirm-delete.component';
import { LIST_STATUS } from 'src/app/shared/data-enum/list-status';
import { IConfirmModalData } from 'src/app/shared/models/confirm-delete.interface';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { IError } from 'src/app/shared/models/error.model';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { IPaginatorState, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { GasStationResponse } from '../../gas-station/gas-station.service';
import { EmployeeService, IDepartment, IEmployee, IPosition } from '../shift.service';

@Component({
	selector: 'app-list-employee',
	templateUrl: './list-employee.component.html',
	styleUrls: ['./list-employee.component.scss'],
	providers: [DestroyService]
})
export class ListEmployeeComponent implements OnInit, AfterViewInit {
	@ViewChild('calendar') calendarComponent: FullCalendarComponent;
	searchFormControl: FormControl = new FormControl();
	sortData: SortState;
	status = LIST_STATUS;
	dataSource: Array<IEmployee> = [];
	paginatorState = new PaginatorState();

	departmentControl = new FormControl('');
	positionControl = new FormControl('');
	departments: IDepartment[] = [];
	positions: IPosition[] = [];

	//////////

	todayDate = moment().startOf('day');
	YM = this.todayDate.format('YYYY-MM');
	YESTERDAY = this.todayDate.clone().subtract(1, 'day').format('YYYY-MM-DD');
	TODAY = this.todayDate.format('YYYY-MM-DD');
	TOMORROW = this.todayDate.clone().add(1, 'day').format('YYYY-MM-DD');

	calendarOptions: CalendarOptions = {
		headerToolbar: {
			left: 'prev,today,next',
			center: 'title',
			right: 'dayGridMonth,timeGridWeek,timeGridDay'
		},
		initialView: 'dayGridMonth',
		nowIndicator: true,
		droppable: false, // this allows things to be dropped onto the calendar
		editable: false,
		navLinks: false,
		locale: 'vi',
		buttonText: {
			today: 'Hôm nay',
			month: 'Tháng',
			week: 'Tuần',
			day: 'Ngày'
		},
		views: {
			dayGridMonth: {
				titleFormat: { year: 'numeric', month: '2-digit' }
			},
			timeGridWeek: {
				titleFormat: { year: 'numeric', month: '2-digit', day: '2-digit' }
			},
			timeGridDay: {
				titleFormat: { year: 'numeric', month: '2-digit', day: '2-digit' }
			}
		},
		themeSystem: 'bootstrap',
		aspectRatio: 1.7,
		fixedWeekCount: false,
		allDaySlot: false,
		slotLabelFormat: {
			hour: '2-digit',
			hour12: false
		},
		// Start with monday
		firstDay: 1,
		showNonCurrentDates: false,
		events: [
			{
				title: 'All Day Event',
				start: this.YM + '-01',
				description: 'Toto lorem ipsum dolor sit incid idunt ut',
				className: 'fc-event-danger fc-event-solid-warning'
			},
			{
				title: 'Reporting',
				start: this.YM + '-14T13:30:00',
				description: 'Lorem ipsum dolor incid idunt ut labore',
				end: this.YM + '-14',
				className: 'fc-event-success'
			},
			{
				title: 'Company Trip',
				start: this.YM + '-02',
				description: 'Lorem ipsum dolor sit tempor incid',
				end: this.YM + '-03',
				className: 'fc-event-primary'
			},
			{
				title: 'ICT Expo 2017 - Product Release',
				start: this.YM + '-03',
				description: 'Lorem ipsum dolor sit tempor inci',
				end: this.YM + '-05',
				className: 'fc-event-light fc-event-solid-primary'
			},
			{
				title: 'Dinner',
				start: this.YM + '-12',
				description: 'Lorem ipsum dolor sit amet, conse ctetur',
				end: this.YM + '-10'
			},
			{
				id: '999',
				title: 'Repeating Event',
				start: this.YM + '-09T16:00:00',
				description: 'Lorem ipsum dolor sit ncididunt ut labore',
				className: 'fc-event-danger'
			},
			{
				id: '999',
				title: 'Repeating Event',
				description: 'Lorem ipsum dolor sit amet, labore',
				start: this.YM + '-16T16:00:00'
			},
			{
				title: 'Conference',
				start: this.YESTERDAY,
				end: this.TOMORROW,
				description: 'Lorem ipsum dolor eius mod tempor labore',
				className: 'fc-event-primary'
			},
			{
				title: 'Meeting',
				start: this.TODAY + 'T10:30:00',
				end: this.TODAY + 'T12:30:00',
				description: 'Lorem ipsum dolor eiu idunt ut labore'
			},
			{
				title: 'Lunch',
				start: this.TODAY + 'T12:00:00',
				className: 'fc-event-info',
				description: 'Lorem ipsum dolor sit amet, ut labore'
			},
			{
				title: 'Meeting',
				start: this.TODAY + 'T14:30:00',
				className: 'fc-event-warning',
				description: 'Lorem ipsum conse ctetur adipi scing'
			},
			{
				title: 'Happy Hour',
				start: this.TODAY + 'T17:30:00',
				className: 'fc-event-info',
				description: 'Lorem ipsum dolor sit amet, conse ctetur'
			},
			{
				title: 'Dinner',
				start: this.TOMORROW + 'T05:00:00',
				className: 'fc-event-solid-danger fc-event-light',
				description: 'Lorem ipsum dolor sit ctetur adipi scing'
			},
			{
				title: 'Birthday Party',
				start: this.TOMORROW + 'T07:00:00',
				className: 'fc-event-primary',
				description: 'Lorem ipsum dolor sit amet, scing'
			},
			{
				title: 'Click for Google',
				url: 'http://google.com/',
				start: this.YM + '-28',
				className: 'fc-event-solid-info fc-event-light',
				description: 'Lorem ipsum dolor sit amet, labore'
			}
		]
	};

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
	ngAfterViewInit(): void {
		this.calendarComponent.getApi().addEvent([]);

		this.cdr.detectChanges();
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
					if (selectedDepartment?.departmentType) {
						return this.employeeService.getPositionByDepartment(selectedDepartment?.departmentType);
					}
					return of<DataResponse<any>>({
						data: [],
						meta: null
					});
				}),
				tap((res) => {
					this.positionControl.patchValue('', NO_EMIT_EVENT);
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
		const searchFormControl$ = this.searchFormControl.valueChanges.pipe(takeUntil(this.destroy$));
		const departmentControl$ = this.departmentControl.valueChanges.pipe(takeUntil(this.destroy$));
		const positionControl$ = this.positionControl.valueChanges.pipe(takeUntil(this.destroy$));

		merge(searchFormControl$, departmentControl$, positionControl$)
			.pipe(
				debounceTime(400),
				switchMap(() => {
					return this.getByCondition();
				}),
				tap((res) => {
					this.checkRes(res);
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	getByCondition() {
		return this.employeeService.getEmployees(
			this.paginatorState.page,
			this.paginatorState.pageSize,
			this.departmentControl.value || '',
			this.positionControl.value || '',
			this.searchFormControl.value,
			this.sortData
		);
	}

	checkRes(res) {
		this.dataSource = res.data;
		this.paginatorState.recalculatePaginator(res.meta.total);
		this.cdr.detectChanges();
	}

	getEmployees() {
		this.getByCondition().subscribe((res) => {
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

	deleteEmployee($event: Event, employee: IEmployee): void {
		$event.stopPropagation();
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
				this.employeeService.deleteEmployee(employee.id).subscribe(
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

	viewDetailEmployee(employeeId: number) {
		this.router.navigate([`/nhan-vien/danh-sach/chi-tiet/${employeeId}`]);
	}

	openEmployeeModal($event: Event, employeeId?: number) {
		$event.stopPropagation();
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

	displayStationList(stations: GasStationResponse[], maxLength?: number) {
		if (!stations) {
			return '';
		}
		if (stations.length > maxLength) {
			return (
				stations
					.map((s) => s.name)
					.slice(0, maxLength)
					.join(', ') + ` và ${stations.length - maxLength} địa điểm khác`
			);
		}
		return stations.map((s) => s.name).join(', ');
	}
}
