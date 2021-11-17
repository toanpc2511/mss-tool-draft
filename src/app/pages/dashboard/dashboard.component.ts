import { formatMoney } from './../../shared/helpers/functions';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import {
	ApexAxisChartSeries,
	ApexChart,
	ApexDataLabels,
	ApexGrid,
	ApexLegend,
	ApexMarkers,
	ApexStroke,
	ApexTitleSubtitle,
	ApexXAxis,
	ApexYAxis,
	ChartComponent
} from 'ng-apexcharts';
import { takeUntil, tap } from 'rxjs/operators';
import { convertMoney } from 'src/app/shared/helpers/functions';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { DashboardService, ISerieTrackingPriceData } from './dashboard.service';

export type ChartOptions = {
	series: ApexAxisChartSeries;
	chart: ApexChart;
	xaxis: ApexXAxis;
	yaxis: ApexYAxis;
	marker: ApexMarkers;
	dataLabels: ApexDataLabels;
	grid: ApexGrid;
	stroke: ApexStroke;
	title: ApexTitleSubtitle;
	legend: ApexLegend;
};
@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
	providers: [DestroyService]
})
export class DashboardComponent implements OnInit, AfterViewInit {
	@ViewChild('chart') chart: ChartComponent;
	locales = moment.localeData('vi');
	public chartOptions: Partial<ChartOptions> = {
		series: [],
		chart: {
			height: 400,
			width: '70%',
			type: 'line',
			zoom: {
				enabled: false
			},
			locales: [
				{
					name: 'vi',
					options: {
						months: this.locales.months(),
						shortMonths: this.locales.monthsShort(),
						days: this.locales.weekdays(),
						shortDays: this.locales.weekdaysShort()
					}
				}
			],
			toolbar: {
				show: false
			},
			background: '#ffffff',
			defaultLocale: 'vi'
		},
		dataLabels: {
			enabled: false
		},
		stroke: {
			curve: 'smooth',
			lineCap: 'round',
			width: 3
		},
		grid: {
			show: true,
			padding: {
				right: 30,
				left: 20
			}
		},
		xaxis: {
			type: 'datetime',
			labels: {
				formatter: (value) => moment(value).format('DD/MM/YY')
			},
			tickAmount: 'dataPoints'
		},
		marker: {
			size: 4,
			shape: 'circle'
		},
		yaxis: {
			labels: {
				show: false,
				formatter: (value) => {
					return formatMoney(value);
				}
			}
		},
		legend: {
			fontSize: '13px'
		},
	};
	trackingPriceSeriesData: ISerieTrackingPriceData[] = [];

	constructor(
		private dashboardService: DashboardService,
		private destroy$: DestroyService,
		private cdr: ChangeDetectorRef
	) {}

	ngOnInit() {}

	ngAfterViewInit(): void {
		this.dashboardService
			.getTrackingPriceData()
			.pipe(
				tap((series) => {
					this.trackingPriceSeriesData = series;
					this.chart.updateSeries(this.trackingPriceSeriesData);
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}
}
