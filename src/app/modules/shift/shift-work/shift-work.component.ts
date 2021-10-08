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
import { CalendarOptions, EventInput, FullCalendarComponent } from '@fullcalendar/angular';
import { NgbModal, NgbPopover, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { takeUntil, tap } from 'rxjs/operators';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { ShiftService } from '../shift.service';
<<<<<<< HEAD
import { IEmployee } from './../shift.service';
=======
import { CreateCalendarModalComponent, IDataTransfer } from '../create-calendar-modal/create-calendar-modal.component';
>>>>>>> f439eb334bbe11a3115ce22b8c49ec056ff3ade5

// Event
@Component({
	template: `
		<div
			[ngbPopover]="popoverTemplate"
			[popoverClass]="'shift-detail-popover'"
			triggers="manual"
			container="body"
			[placement]="['top', 'left', 'right', 'bottom']"
			[autoClose]="'outside'"
		>
			<div class="event-container">
				<strong class="fa fa-circle"></strong>
				<span>{{ eventData.title }}</span>
			</div>
		</div>
	`,
	styleUrls: ['event-wrapper.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class EventWrapperComponent {
	popoverTemplate: TemplateRef<any>;
	eventData: EventInput;
	@ViewChild(NgbPopover, { static: true }) popover: NgbPopover;
	constructor(public elRef: ElementRef) {}
}

//Check không có nhân viên trong ca của cột
@Component({
	template: `
		<div class="day-cell-custom">
			<div class="cell-custom">
				<div
					*ngIf="tooltipWarning"
					[ngbTooltip]="tooltipWarning"
					[tooltipClass]="'warning-tooltip'"
					[placement]="['top', 'right', 'left', 'bottom']"
					triggers="hover"
					container="body"
					class="warning-icon"
				></div>
			</div>
			<ng-content></ng-content>
		</div>
	`,
	styleUrls: ['day-wrapper.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class DayWrapperComponent {
	tooltipWarning: string;
	@ViewChild(NgbTooltip, { static: true }) tooltip: NgbTooltip;
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

	employees: IEmployee[] = [
		{
			id: 1,
			code: 'Employee1',
			name: 'Employee 1'
		},
		{
			id: 2,
			code: 'Employee2',
			name: 'Employee 2'
		},
		{
			id: 3,
			code: 'Employee3',
			name: 'Employee 3'
		},
		{
			id: 4,
			code: 'Employee4',
			name: 'Employee 4'
		},
		{
			id: 5,
			code: 'Employee5',
			name: 'Employee 5'
		},
		{
			id: 6,
			code: 'Employee6',
			name: 'Employee 6'
		},
		{
			id: 7,
			code: 'Employee7',
			name: 'Employee 7'
		}
	];

	calendars: EventInput[];
	calendarsCountByDate: Map<string, number> = new Map();
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
		// aspectRatio: 1.7,
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
		dayHeaders: true,
		timeZone: 'Asia/ Ho_Chi_Minh'
	};

	@ViewChild('popoverTmpl', { static: true }) popoverTmpl: TemplateRef<any>;
	eventContainersMap = new Map<any, ComponentRef<EventWrapperComponent>>();
	eventContainerFactory = this.resolver.resolveComponentFactory(EventWrapperComponent);

	dayWrappersMap = new Map<any, ComponentRef<DayWrapperComponent>>();
	dayWrapperFactory = this.resolver.resolveComponentFactory(DayWrapperComponent);

	gasStationTabs = [
		{
			id: 1,
			title: 'Station 1'
		},
		{
			id: 2,
			title: 'Station 2'
		},
		{
			id: 3,
			title: 'Station 3'
		},
		{
			id: 4,
			title: 'Station 4'
		}
	];

	constructor(
		private shiftService: ShiftService,
		private cdr: ChangeDetectorRef,
		private destroy$: DestroyService,
		private modalService: NgbModal,
		private router: Router,
		private toastr: ToastrService,
		private resolver: ComponentFactoryResolver,
		private injector: Injector,
		private appRef: ApplicationRef
	) {
		this.init();
	}
	ngAfterViewInit(): void {
		this.calendarsCountByDate.clear();
		this.shiftService
			.getShiftWorks('2021-01-07', '2021-03-07', ['72', '73'], '5119')
			.pipe(
				tap((res) => {
					this.calendars = [...res.data.calendarResponses].map((calendar): EventInput => {
						const start = moment(calendar.start).format('YYYY-MM-DD');
						const end = moment(calendar.end).format('YYYY-MM-DD');
						const currentCount = this.calendarsCountByDate.get(start);
						this.calendarsCountByDate.set(start, currentCount ? currentCount + 1 : 1);
						if (start !== end) {
							const currentCount = this.calendarsCountByDate.get(end);
							this.calendarsCountByDate.set(end, currentCount ? currentCount + 1 : 1);
						}
						this.totalPumpPoles = res.data.totalPump;

						return {
							id: calendar.calendarId.toString(),
							start: calendar.start,
							end: calendar.end,
							title: `${calendar.shiftName} - ${calendar.employeeName}`,
							backgroundColor: calendar.backgroundColor,
							color: '#ffffff',
							extendedProps: {
								employeeName: calendar.employeeName,
								offTimes: calendar.offTimeResponses,
								pumpPoles: calendar.pumpPoleResponses,
								totalPump: res.data.totalPump
							},
							allDay: true
						};
					});
					this.calendarComponent.getApi().addEventSource(this.calendars);
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	init() {}

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
		console.log($event);
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

	selectedEmployeeChange($event) {
		console.log($event);
	}

	dayCellRender(event) {
		const currentRenderDate = moment(event.date).format('YYYY-MM-DD');
		const totalEventCurrentDate = this.calendarsCountByDate.get(currentRenderDate);

		const projectableNodes = Array.from(event.el.childNodes);

		const compWrapperRef = this.dayWrapperFactory.create(
			this.injector,
			[projectableNodes],
			event.el
		);

		if (totalEventCurrentDate < this.totalPumpPoles) {
			compWrapperRef.instance.tooltipWarning = 'Trạm có ca chưa được gán nhân viên';
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
<<<<<<< HEAD
=======

	dayCellWeekRender(event) {
		const projectableNodes = Array.from(event.el.childNodes);

		const compWrapperRef = this.dayWrapperFactory.create(
			this.injector,
			[projectableNodes],
			event.el
		);
		compWrapperRef.instance.tooltipContent = 'Trạm có ca chưa được gán nhân viên';
		compWrapperRef.instance.isWeekView = true;
		this.appRef.attachView(compWrapperRef.hostView);
		this.dayWrappersMap.set(event.el, compWrapperRef);
	}

  // toanpc
  createCalendarModal($event: Event) {
    if ($event) {
      $event.stopPropagation();
    }
    const modalRef = this.modalService.open(CreateCalendarModalComponent, {
      backdrop: 'static',
      size: 'lg'
    });

    modalRef.componentInstance.data = {
      title: 'Thêm lịch làm việc'
    };

    modalRef.result.then((result) => {
      if (result) {
        console.log('done');
      }
    });
  }
>>>>>>> f439eb334bbe11a3115ce22b8c49ec056ff3ade5
}
