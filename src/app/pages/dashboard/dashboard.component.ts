import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import {
	ApexAxisChartSeries,
	ApexChart,
	ApexDataLabels,
	ApexGrid,
	ApexLegend,
	ApexMarkers,
	ApexStroke,
	ApexTitleSubtitle,
	ApexTooltip,
	ApexXAxis,
	ApexYAxis,
	ChartComponent
} from 'ng-apexcharts';
import { formatMoney } from 'src/app/shared/helpers/functions';
import * as moment from 'moment';
import { DashboardService, ISeriesTrackingData } from './dashboard.service';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { takeUntil, tap } from 'rxjs/operators';

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
	tooltip: ApexTooltip;
	colors: string[];
};

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
	providers: [DestroyService]
})
export class DashboardComponent {
	@ViewChild('chart') chart: ChartComponent;
	trackingPriceSeriesData: ISeriesTrackingData[] = [];

	locales = moment.localeData('vi');
	public chartOptions: Partial<ChartOptions> = {
		series: [],
		chart: {
			height: 400,
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
		xaxis: {
			type: 'category',
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
				formatter: (value) => formatMoney(value)
			}
		},
		legend: {
			fontSize: '13px',
			containerMargin: {
				top: 100
			},
			height: 80
		},
		tooltip: {
			y: {
				formatter: (value) => `${formatMoney(value)} VNĐ`
			}
		},
		colors: [
			'#F44336',
			'#E91E63',
			'#9C27B0',
			'#32a852',
			'#c7a94e',
			'#7a641f',
			'#138031',
			'#014f16',
			'#750459',
			'#002109',
			'#506e11',
			'#93cc31',
			'#ceff7a',
			'#bf242a',
			'#c21998'
		]
	};

	constructor(private dashboardService: DashboardService, private destroy$: DestroyService) {}

	// ngAfterViewInit(): void {
	//   this.dashboardService
	//     .getTrackingPriceData()
	//     .pipe(
	//       tap((series: ISeriesTrackingData[]) => {
	//         this.trackingPriceSeriesData = series;
	//         this.chart.updateSeries(this.trackingPriceSeriesData);
	//       }),
	//       takeUntil(this.destroy$)
	//     )
	//     .subscribe();
	// }
}
