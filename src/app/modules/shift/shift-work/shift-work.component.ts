import {
	AfterViewInit,
	ApplicationRef,
	ChangeDetectorRef,
	Component,
	ComponentFactoryResolver,
	ComponentRef,
	ElementRef,
	Injector,
	OnInit,
	TemplateRef,
	ViewChild,
	ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import {
	CalendarApi,
	CalendarOptions,
	EventInput,
	FullCalendarComponent
} from '@fullcalendar/angular';
import { NgbModal, NgbPopover, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, zip } from 'rxjs';
import { filter, finalize, map, takeUntil, tap } from 'rxjs/operators';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { ConfirmDeleteComponent } from '../../../shared/components/confirm-delete/confirm-delete.component';
import { IConfirmModalData } from '../../../shared/models/confirm-delete.interface';
import { IError } from '../../../shared/models/error.model';
import { CreateCalendarModalComponent } from '../create-calendar-modal/create-calendar-modal.component';
import { IDataEventCalendar, ShiftService } from '../shift.service';
import { convertDateValueToServer } from './../../../shared/helpers/functions';
import {
	GasStationResponse,
	GasStationService,
	IPumpPole
} from './../../gas-station/gas-station.service';
import { ICalendarResponse, IEmployee, IShiftConfig } from './../shift.service';
import { DeleteCalendarAllComponent } from './delete-calendar-all/delete-calendar-all.component';
import { DetailWarningDialogComponent } from './detail-warning-dialog/detail-warning-dialog.component';
import { EmployeeCheck } from './employee/employee.component';

// Event
@Component({
	template: `
		<div
			[ngbPopover]="popoverTemplate"
			[popoverClass]="'shift-detail-popover'"
			triggers="focus"
			container="body"
			[placement]="['top', 'left', 'right', 'bottom']"
			[autoClose]="'outside'"
		>
			<div class="event-container">
				<span class="month-title">{{ eventData.title }}</span>
				<span class="week-title">{{ eventData.extendedProps.weekTitle }}</span>
				<span class="week-content">{{ eventData.extendedProps.weekContent }}</span>
			</div>
		</div>
	`,
	styleUrls: ['event-wrapper.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [DestroyService]
})
export class EventWrapperComponent {
	popoverTemplate: TemplateRef<any>;
	eventData: EventInput;
	event: any;

	@ViewChild(NgbPopover, { static: true }) popover: NgbPopover;
	constructor(public elRef: ElementRef) {}
}

//Check không có nhân viên trong ca của cột
export type ShiftData = {
	shiftId: number;
	shiftName: string;
	shiftColor: string;
	shiftDetail: { pumpoleName: string; calendar: ICalendarResponse }[];
};
@Component({
	template: `
		<div class="day-cell-custom">
			<div class="cell-custom">
				<strong
					(click)="showDetailWarning()"
					*ngIf="tooltipWarning"
					[ngbTooltip]="tooltipWarning"
					[tooltipClass]="'warning-tooltip'"
					[placement]="['top', 'right', 'left', 'bottom']"
					triggers="hover"
					container="body"
					class="warning-icon fa fa-exclamation-triangle mt-1 text-danger"
				></strong>
			</div>
			<ng-content></ng-content>
		</div>
	`,
	styleUrls: ['day-wrapper.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [DestroyService]
})
export class DayWrapperComponent implements OnInit {
	tooltipWarning: string;
	currentDate: string;
	stationId: string;
	@ViewChild(NgbTooltip, { static: true }) tooltip: NgbTooltip;

	data$: Observable<[ICalendarResponse[], IPumpPole[], IShiftConfig[]]>;

	constructor(
		private ngbModal: NgbModal,
		private shiftService: ShiftService,
		private stationService: GasStationService,
		private destroy$: DestroyService
	) {}
	ngOnInit(): void {
		const calendars$ = this.shiftService
			.getShiftWorks(this.currentDate, this.currentDate, [], this.stationId)
			.pipe(map((res) => res.data));

		const pumpole$ = this.stationService
			.getPumpPolesByGasStation(this.stationId)
			.pipe(map((res) => res.data));

		const shiftConfig$ = this.shiftService.getListShiftConfig().pipe(map((res) => res.data));

		this.data$ = zip(calendars$, pumpole$, shiftConfig$);
	}

	showDetailWarning() {
		this.data$
			.pipe(
				tap((data) => {
					const shiftDatas = this.generateShiftOfDateData(data);
					const modalRef = this.ngbModal.open(DetailWarningDialogComponent, {
						size: 'lg',
						backdrop: 'static'
					});
					modalRef.componentInstance.shiftDatas = shiftDatas;
					modalRef.componentInstance.currentDate = this.currentDate;
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	generateShiftOfDateData([calendars, pumpoles, shiftConfigs]: [
		ICalendarResponse[],
		IPumpPole[],
		IShiftConfig[]
	]): ShiftData[] {
		let data: ShiftData[] = [];
		for (const shiftConfig of shiftConfigs) {
			for (const pumpole of pumpoles) {
				const calendar = calendars?.find(
					(shift) =>
						shift.shiftId === shiftConfig.id &&
						shift.pumpPoleResponses.some((pump) => pump.id === pumpole.id)
				);
				const index = data.findIndex((d) => d.shiftId === shiftConfig.id);
				if (index >= 0) {
					data[index] = {
						...data[index],
						shiftDetail: [...data[index].shiftDetail, { pumpoleName: pumpole.name, calendar }]
					};
				} else {
					data = [
						...data,
						{
							shiftId: shiftConfig.id,
							shiftName: shiftConfig.name,
							shiftColor: shiftConfig.codeColor,
							shiftDetail: [
								{
									pumpoleName: pumpole.name,
									calendar
								}
							]
						}
					];
				}
			}
		}
		return data;
	}
}

@Component({
	selector: 'app-shift-work',
	templateUrl: './shift-work.component.html',
	styleUrls: ['./shift-work.component.scss'],
	providers: [DestroyService]
})
export class ShiftWorkComponent implements OnInit, AfterViewInit {
	// Get calendar to use FullCalendar API
	@ViewChild('calendar') calendarComponent: FullCalendarComponent;
	calendarApi: CalendarApi;
	start: string;
	end: string;
	currentViewMode = 'dayGridMonth';
	isLoadingEmployeeSubject = new BehaviorSubject<boolean>(true);
	isLoadingEmployee$ = this.isLoadingEmployeeSubject.asObservable();
	employees: IEmployee[] = [];
	selectedEmployeeIds: number[];

	isLoadingStationSubject = new BehaviorSubject<boolean>(true);
	isLoadingStation$ = this.isLoadingStationSubject.asObservable();
	gasStationTabs: GasStationResponse[] = [];
	currentGasStationId: string;

	calendars: EventInput[];
	warningDate: Map<string, boolean> = new Map();
	totalPumpPoles = 0;

	calendarOptions: CalendarOptions = {
		headerToolbar: {
			left: 'prev,today,next',
			center: 'title',
			right: 'dayGridMonth,dayGridWeek'
		},
		initialView: 'dayGridMonth',
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
				titleFormat: {
					year: 'numeric',
					month: '2-digit'
				},
				dayHeaderFormat: {
					weekday: 'long'
				},
				dayMaxEventRows: 3,
				dayMaxEvents: 2,
				moreLinkText: 'ca khác',
				moreLinkClick: this.showMore.bind(this),
				moreLinkClassNames: 'show-more',
				viewClassNames: 'month-view-type'
			},
			dayGridWeek: {
				titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
				dayHeaderFormat: {
					day: '2-digit',
					month: 'short',
					weekday: 'long'
				},
				viewClassNames: 'week-view-type'
			}
		},
		themeSystem: 'bootstrap',
		fixedWeekCount: false,
		allDaySlot: true,
		firstDay: 1,
		dayCellClassNames: 'day',
		eventClassNames: 'event',
		dayPopoverFormat: {
			weekday: 'long',
			day: '2-digit',
			month: 'numeric',
			year: 'numeric'
		},
		height: 700,
		eventDidMount: this.renderEventContainer.bind(this),
		eventWillUnmount: this.destroyEventContainer.bind(this),
		eventClick: this.popoverShowOrHide.bind(this),
		dayCellDidMount: this.dayCellRender.bind(this),
		dayCellWillUnmount: this.destroyDayCell.bind(this),
		viewDidMount: this.viewDidMount.bind(this),
		dayHeaders: true,
		handleWindowResize: true,
		timeZone: 'Asia/ Ho_Chi_Minh'
	};

	@ViewChild('popoverTmpl', { static: true }) popoverTmpl: TemplateRef<any>;
	eventContainersMap = new Map<any, ComponentRef<EventWrapperComponent>>();
	eventContainerFactory = this.resolver.resolveComponentFactory(EventWrapperComponent);

	dayWrappersMap = new Map<any, ComponentRef<DayWrapperComponent>>();
	dayWrapperFactory = this.resolver.resolveComponentFactory(DayWrapperComponent);

	constructor(
		private shiftService: ShiftService,
		private stationService: GasStationService,
		private cdr: ChangeDetectorRef,
		private destroy$: DestroyService,
		private modalService: NgbModal,
		private router: Router,
		private toastr: ToastrService,
		private resolver: ComponentFactoryResolver,
		private injector: Injector,
		private appRef: ApplicationRef
	) {}
	ngAfterViewInit(): void {
		const toggleOffsetBar = document.getElementById('kt_aside_toggle');
		toggleOffsetBar.addEventListener('click', () => {
			this.calendarApi.updateSize();
		});
	}

	getCalendarData(start: string, end: string, employeeIds: number[], stationId: string) {
		this.calendarApi.removeAllEventSources();
		this.warningDate.clear();
		this.shiftService
			.getShiftWorks(start, end, employeeIds, stationId)
			.pipe(
				tap((res) => {
					this.calendars = [...res.data].map((calendar): EventInput => {
						const start = moment(calendar.start).format('YYYY-MM-DD');
						const end = moment(calendar.end).format('YYYY-MM-DD');

						this.warningDate.set(start, !calendar.checked);
						if (start !== end) {
							this.warningDate.set(end, !calendar.checked);
						}

						return {
							id: calendar.calendarId.toString(),
							start: calendar.start,
							end: calendar.end,
							title: `${calendar.shiftName} - ${calendar.employeeName}`,
							backgroundColor: calendar.backgroundColor,
							color: '#ffffff',
							extendedProps: {
								shiftId: calendar.shiftId,
								employeeId: calendar.employeeId,
								employeeName: calendar.employeeName,
								offTimes: calendar.offTimes,
								pumpPoles: calendar.pumpPoleResponses,
								warning: calendar.checked,
								weekTitle: calendar.shiftName,
								weekContent: calendar.employeeName
							},
							allDay: true
						};
					});
					this.calendarApi.addEventSource(this.calendars);

					// Trick to fix re render daycell to validate day station
					this.calendarApi.next();
					this.calendarApi.prev();
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	getStations() {
		this.shiftService
			.getStationByAccount()
			.pipe(
				tap((res) => {
					this.gasStationTabs = res.data;
					this.cdr.detectChanges();
				}),
				finalize(() => this.isLoadingStationSubject.next(false)),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	getEmployees(stationId: string) {
		this.shiftService
			.getEmployeesByStation(stationId)
			.pipe(
				tap((res) => {
					this.employees = res.data;
					this.cdr.detectChanges();
				}),
				finalize(() => this.isLoadingEmployeeSubject.next(false)),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	init() {
		this.getStations();
		this.isLoadingStation$
			.pipe(
				filter((value) => !value),
				tap(() => {
					this.getEmployees(this.gasStationTabs[0].id.toString());
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	ngOnInit() {
		this.init();
	}

	checkRes(res) {
		this.cdr.detectChanges();
	}

	showMore(info) {
		console.log(info);
	}

	gasStationTabChange($event) {
		this.currentGasStationId = $event;
		this.selectedEmployeeIds = [];
		this.getEmployees(this.currentGasStationId);
		this.getCalendarData(this.start, this.end, this.selectedEmployeeIds, this.currentGasStationId);
	}

	viewDidMount(event: any) {
		this.calendarApi = this.calendarComponent.getApi();
		this.start = convertDateValueToServer(this.calendarApi.view.activeStart);
		this.end = convertDateValueToServer(this.calendarApi.view.activeEnd);

		const calendarBtns = document.querySelectorAll(
			'.fc-next-button,.fc-prev-button,.fc-today-button,.fc-dayGridMonth-button,.fc-dayGridWeek-button'
		);

		calendarBtns.forEach((btn) =>
			btn.addEventListener('click', () => {
				if (btn.parentElement.childNodes.length < 3) {
					if (this.calendarApi.view.type === this.currentViewMode) {
						return;
					} else {
						this.currentViewMode = this.calendarApi.view.type;
					}
				}
				if (btn.classList.contains('fc-dayGridWeek-button')) {
					const firstDayOfMonth = moment(this.calendarApi.getDate())
						.startOf('month')
						.add({ week: 2 })
						.toDate();
					this.calendarApi.gotoDate(firstDayOfMonth);
				}
				if (this.selectedEmployeeIds === null) {
					return;
				}
				this.start = convertDateValueToServer(this.calendarApi.view.activeStart);
				this.end = convertDateValueToServer(this.calendarApi.view.activeEnd);
				this.getCalendarData(
					this.start,
					this.end,
					this.selectedEmployeeIds,
					this.currentGasStationId
				);
			})
		);
	}

	renderEventContainer(event: any) {
		const projectableNodes = Array.from(event.el.childNodes);
		const compWrapperRef = this.eventContainerFactory.create(
			this.injector,
			[projectableNodes],
			event.el
		);
		compWrapperRef.instance.popoverTemplate = this.popoverTmpl;
		compWrapperRef.instance.eventData = event.event;
		const eventRef = compWrapperRef.instance.elRef.nativeElement as HTMLElement;
		eventRef.style.backgroundColor = event.event.backgroundColor;
		eventRef.style.color = event.event.color;
		this.appRef.attachView(compWrapperRef.hostView);
		this.eventContainersMap.set(event.el, compWrapperRef);
	}

	destroyEventContainer(event: any) {
		const eventContainer = this.eventContainersMap.get(event.el);
		if (eventContainer) {
			this.appRef.detachView(eventContainer.hostView);
			eventContainer.destroy();
			this.eventContainersMap.delete(event.el);
		}
	}

	popoverShowOrHide(event: any) {
		const eventContainer = this.eventContainersMap.get(event.el);
		if (eventContainer) {
			const isShow = eventContainer.instance.popover.isOpen();
			if (!isShow) {
				eventContainer.instance.popover.open({ event });
			} else {
				eventContainer.instance.popover.close();
			}
		}
	}

	closeShiftDetail(event) {
		const eventContainer = this.eventContainersMap.get(event.el);
		if (eventContainer) {
			eventContainer.instance.popover.close();
		}
	}

	selectedEmployeeChange($event: EmployeeCheck) {
		if ($event.status === 'uncheckall') {
			// Clear all data calendar
			this.selectedEmployeeIds = null;
			this.calendarApi.removeAllEventSources();
			this.warningDate.clear();
			// Trigger rerender day cell fullcalendar
			this.calendarApi.next();
			this.calendarApi.prev();
			return;
		} else if ($event.status === 'checkall') {
			this.selectedEmployeeIds = [];
		} else {
			this.selectedEmployeeIds = $event.data;
		}
		this.getCalendarData(this.start, this.end, this.selectedEmployeeIds, this.currentGasStationId);
	}

	dayCellRender(event) {
		const currentRenderDate = moment(event.date).format('YYYY-MM-DD');
		const isWarning = this.warningDate.get(currentRenderDate);

		const projectableNodes = Array.from(event.el.childNodes);

		const compWrapperRef = this.dayWrapperFactory.create(
			this.injector,
			[projectableNodes],
			event.el
		);

		if (isWarning) {
			compWrapperRef.instance.tooltipWarning = 'Trạm có ca chưa được gán nhân viên';
			compWrapperRef.instance.currentDate = currentRenderDate;
			compWrapperRef.instance.stationId = this.currentGasStationId;
		}
		this.appRef.attachView(compWrapperRef.hostView);
		this.dayWrappersMap.set(event.el, compWrapperRef);
	}

	destroyDayCell(event) {
		const dayWrapper = this.eventContainersMap.get(event.el);
		if (dayWrapper) {
			this.appRef.detachView(dayWrapper.hostView);
			dayWrapper.destroy();
			this.dayWrappersMap.delete(event.el);
		}
	}

	// toanpc
	createCalendarModal($event?: { el: any; event: IDataEventCalendar }) {
		const eventContainer = this.eventContainersMap.get($event.el);
		if (eventContainer) {
			eventContainer.instance.popover.close();
		}

		const modalRef = this.modalService.open(CreateCalendarModalComponent, {
			windowClass: 'custom-modal-z-1070',
			backdrop: 'static',
			size: 'lg'
		});

		modalRef.componentInstance.data = {
			title: $event?.event ? 'Sửa lịch làm việc' : 'Thêm  lịch làm việc',
			dataEventCalendar: $event?.event,
      stationId: this.currentGasStationId
		};

		modalRef.result.then((result) => {
			if (result) {
				this.getCalendarData(
					this.start,
					this.end,
					this.selectedEmployeeIds,
					this.currentGasStationId
				);
			}

			//Reopen popoper when dialog close
			if (eventContainer) {
				eventContainer.instance.popover.open({ event: $event });
			}
		});
	}

	deleteCalendarOfEmployee($event: Event, item: IDataEventCalendar) {
		$event.stopPropagation();
		const modalRef = this.modalService.open(ConfirmDeleteComponent, {
      windowClass: 'custom-modal-z-1070',
			backdrop: 'static'
		});
		const data: IConfirmModalData = {
			title: 'Xác nhận',
			message: `Bạn có chắc chắn muốn xoá lịch làm việc này ?`,
			button: { class: 'btn-primary', title: 'Xác nhận' }
		};
		modalRef.componentInstance.data = data;

		modalRef.result.then((result) => {
			if (result) {
				this.shiftService.deleteCalendarOfEmployee(Number(item.id)).subscribe(
					(res) => {
						if (res.data) {
							this.getCalendarData(
								this.start,
								this.end,
								this.selectedEmployeeIds,
								this.currentGasStationId
							);
						}
					},
					(err: IError) => {
						this.checkError(err);
					}
				);
			}
		});
	}

	deleteCalendarAll($event: Event) {
		if ($event) {
			$event.stopPropagation();
		}
		const modalRef = this.modalService.open(DeleteCalendarAllComponent, {
      windowClass: 'custom-modal-z-1070',
			backdrop: 'static',
			size: 'lg'
		});

		modalRef.componentInstance.data = {
			title: 'Xóa lịch làm việc',
      stationId: this.currentGasStationId
		};

		modalRef.result.then((result) => {
			if (result) {
				this.getCalendarData(
					this.start,
					this.end,
					this.selectedEmployeeIds,
					this.currentGasStationId
				);
			}
		});
	}

	checkError(error: IError) {
		this.toastr.error(error.code);
	}
}
