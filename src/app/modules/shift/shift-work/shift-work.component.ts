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
	ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { CalendarOptions, EventSourceInput, FullCalendarComponent } from '@fullcalendar/angular';
import { NgbModal, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { createPopper, Instance } from '@popperjs/core/lib/popper-lite';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { EmployeeService } from '../shift.service';

@Component({
	template: `
		<div
			[ngbPopover]="template"
			[popoverClass]="'shift-detail'"
			placement="top"
			container="body"
			triggers="manual"
		>
			<ng-content></ng-content>
		</div>
	`
})
export class PopoverWrapperComponent {
	template: TemplateRef<any>;
	@ViewChild(NgbPopover, { static: true }) popover: NgbPopover;
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
			},
			timeGridDay: {
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
		height: 700,
		eventDidMount: this.renderEvent.bind(this),
		eventWillUnmount: this.destroyPopover.bind(this),
		eventClick: this.showPopover.bind(this),
		eventMouseEnter: (event: any) => {
			const instance = createPopper(event.el as HTMLElement, this.toolTipTmpl.nativeElement, {
				placement: 'left'
			});
			this.toolTipsMap.set(event.el, instance);
		},
		eventMouseLeave: (event: any) => {
			const toolTip = this.toolTipsMap.get(event.el);
			if (toolTip) {
				this.toolTipsMap.delete(event.el);
				toolTip.destroy();
			}
		}
	};

	@ViewChild('popoverTmpl', { static: true }) popoverTmpl: TemplateRef<any>;
	@ViewChild('toolTipTmpl', { static: true }) toolTipTmpl: ElementRef;
	popoversMap = new Map<any, ComponentRef<PopoverWrapperComponent>>();
	toolTipsMap = new Map<any, Instance>();
	popoverFactory = this.resolver.resolveComponentFactory(PopoverWrapperComponent);

	constructor(
		private employeeService: EmployeeService,
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
		this.cdr.detectChanges();
	}

	init() {}

	ngOnInit() {}

	checkRes(res) {
		this.cdr.detectChanges();
	}

	showMore(info) {
		console.log(info);
	}

	tabChange($event) {}

	renderTitleEvent(event: any) {}

	renderEvent(event: any) {
		const el = event?.el as HTMLElement;
		el.title = `${event.event.title}: ${event.event.extendedProps?.description}`;
		this.renderPopover(event);
	}

	renderPopover(event: any) {
		const projectableNodes = Array.from(event.el.childNodes);
		const compPopoverRef = this.popoverFactory.create(this.injector, [projectableNodes], event.el);
		compPopoverRef.instance.template = this.popoverTmpl;
		this.appRef.attachView(compPopoverRef.hostView);
		this.popoversMap.set(event.el, compPopoverRef);
	}

	destroyPopover(event: any) {
		const popover = this.popoversMap.get(event.el);
		if (popover) {
			this.appRef.detachView(popover.hostView);
			popover.destroy();
			this.popoversMap.delete(event.el);
		}
	}

	showPopover(event: any) {
		const popover = this.popoversMap.get(event.el);
		if (popover) {
			const isShow = popover.instance.popover.isOpen();
			if (!isShow) {
				popover.instance.popover.open({ event: event.event });
			} else {
				popover.instance.popover.close();
			}
		}
	}

	eventRender(info) {
		console.log(info.el);
	}
}
