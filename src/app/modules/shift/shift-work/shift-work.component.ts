import { IEmployee } from './../shift.service';
import {
	AfterViewInit,
	ApplicationRef,
	ChangeDetectorRef,
	Component,
	ComponentFactoryResolver,
	ComponentRef,
	Injector,
	OnInit,
	TemplateRef,
	ViewChild,
	ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import { CalendarOptions, EventSourceInput, FullCalendarComponent } from '@fullcalendar/angular';
import { NgbModal, NgbPopover, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { ShiftService } from '../shift.service';
import { CreateCalendarModalComponent, IDataTransfer } from '../create-calendar-modal/create-calendar-modal.component';

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
			<ng-content></ng-content>
		</div>
	`,
	styleUrls: ['event-wrapper.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class EventWrapperComponent {
	popoverTemplate: TemplateRef<any>;
	@ViewChild(NgbPopover, { static: true }) popover: NgbPopover;
}

//Check không có nhân viên trong ca của cột
@Component({
	template: `
		<div class="day-cell-custom">
			<div
				[ngbTooltip]="tooltipContent"
				[tooltipClass]="'warning-tooltip'"
				[placement]="['top', 'right', 'left', 'bottom']"
				triggers="hover"
				container="body"
				class="warning-icon"
			></div>
			<ng-content></ng-content>
		</div>
	`,
	styleUrls: ['day-wrapper.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class DayWrapperComponent {
	tooltipContent: string;
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

	todayDate = moment().startOf('day');
	YM = this.todayDate.format('YYYY-MM');
	YESTERDAY = this.todayDate.clone().subtract(1, 'day').format('YYYY-MM-DD');
	TODAY = this.todayDate.format('YYYY-MM-DD');
	TOMORROW = this.todayDate.clone().add(1, 'day').format('YYYY-MM-DD');

	employees: IEmployee[] = [
		{
			id: 1,
			code: 'Employee1',
			department: null,
			name: 'Employee 1',
			positions: null,
			station: []
		},
		{
			id: 2,
			code: 'Employee2',
			department: null,
			name: 'Employee 2',
			positions: null,
			station: []
		},
		{
			id: 3,
			code: 'Employee3',
			department: null,
			name: 'Employee 3',
			positions: null,
			station: []
		},
		{
			id: 4,
			code: 'Employee4',
			department: null,
			name: 'Employee 4',
			positions: null,
			station: []
		},
		{
			id: 5,
			code: 'Employee5',
			department: null,
			name: 'Employee 5',
			positions: null,
			station: []
		},
		{
			id: 6,
			code: 'Employee6',
			department: null,
			name: 'Employee 6',
			positions: null,
			station: []
		},
		{
			id: 7,
			code: 'Employee7',
			department: null,
			name: 'Employee 7',
			positions: null,
			station: []
		}
	];

	events: EventSourceInput = [
		{
			title: 'All Day Event',
			start: this.YM + '-01',
			description: 'Toto lorem ipsum dolor sit incid idunt ut',
			className: 'fc-event-danger fc-event-solid-warning'
		},
		{
			title: 'All Day Event',
			start: this.YM + '-01',
			description: 'Toto lorem ipsum dolor sit incid idunt ut',
			className: 'fc-event-danger fc-event-solid-warning'
		},
		{
			title: 'All Day Event',
			start: this.YM + '-01',
			description: 'Toto lorem ipsum dolor sit incid idunt ut',
			className: 'fc-event-danger fc-event-solid-warning'
		},
		{
			title: 'All Day Event',
			start: this.YM + '-01',
			description: 'Toto lorem ipsum dolor sit incid idunt ut',
			className: 'fc-event-danger fc-event-solid-warning'
		},
		{
			title: 'Reporting',
			start: this.YM + '-1',
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
			start: this.YM + '-09',
			description: 'Lorem ipsum dolor sit ncididunt ut labore',
			className: 'fc-event-danger'
		},
		{
			id: '999',
			title: 'Repeating Event',
			description: 'Lorem ipsum dolor sit amet, labore',
			start: this.YM + '-16'
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
			start: this.TODAY,
			end: this.TODAY,
			description: 'Lorem ipsum dolor eiu idunt ut labore'
		},
		{
			title: 'Lunch',
			start: this.TODAY,
			className: 'fc-event-info',
			description: 'Lorem ipsum dolor sit amet, ut labore'
		},
		{
			title: 'Meeting',
			start: this.TODAY,
			className: 'fc-event-warning',
			description: 'Lorem ipsum conse ctetur adipi scing'
		},
		{
			title: 'Happy Hour',
			start: this.TODAY,
			className: 'fc-event-info',
			description: 'Lorem ipsum dolor sit amet, conse ctetur'
		},
		{
			title: 'Dinner',
			start: this.TOMORROW,
			className: 'fc-event-solid-danger fc-event-light',
			description: 'Lorem ipsum dolor sit ctetur adipi scing'
		},
		{
			title: 'Birthday Party',
			start: this.TOMORROW,
			className: 'fc-event-warning',
			description: 'Lorem ipsum dolor sit amet, scing'
		},
		{
			title: 'Click for Google',
			url: 'http://google.com/',
			start: this.YM + '-28',
			className: 'fc-event-solid-info fc-event-light',
			description: 'Lorem ipsum dolor sit amet, labore'
		}
	];

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
				titleFormat: { year: 'numeric', month: '2-digit' }
			},
			timeGridWeek: {
				titleFormat: { year: 'numeric', month: '2-digit', day: '2-digit' }
			}
		},
		themeSystem: 'bootstrap',
		// aspectRatio: 1.7,
		fixedWeekCount: false,
		allDaySlot: true,
		firstDay: 1,
		dayCellClassNames: 'day',
		eventClassNames: 'event',
		dayMaxEventRows: 3,
		dayMaxEvents: 2,
		moreLinkText: 'ca khác',
		moreLinkClick: this.showMore.bind(this),
		moreLinkClassNames: 'show-more',
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
		dayHeaders: true,
		dayCellDidMount: this.dayCellRender.bind(this)
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
		this.calendarComponent.getApi().addEventSource(this.events);
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

	renderTitleEvent(event: any) {}

	renderEventContainer(event: any) {
		const projectableNodes = Array.from(event.el.childNodes);
		const compPopoverRef = this.eventContainerFactory.create(
			this.injector,
			[projectableNodes],
			event.el
		);
		compPopoverRef.instance.popoverTemplate = this.popoverTmpl;
		this.appRef.attachView(compPopoverRef.hostView);
		this.eventContainersMap.set(event.el, compPopoverRef);
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
		const projectableNodes = Array.from(event.el.childNodes);

		const compPopoverRef = this.dayWrapperFactory.create(
			this.injector,
			[projectableNodes],
			event.el
		);
		compPopoverRef.instance.tooltipContent = 'Trạm có ca chưa được gán nhân viên';
		this.appRef.attachView(compPopoverRef.hostView);
		this.dayWrappersMap.set(event.el, compPopoverRef);
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
  createCalendarModal($event: Event, data: IDataTransfer) {
    if ($event) {
      $event.stopPropagation();
    }
    const modalRef = this.modalService.open(CreateCalendarModalComponent, {
      backdrop: 'static',
      size: 'lg'
    });

    modalRef.componentInstance.data = {
      title: 'Thêm lịch làm việc',
      shiftConfig: data
    };

    modalRef.result.then((result) => {
      if (result) {
        console.log('done');
      }
    });
  }
}
