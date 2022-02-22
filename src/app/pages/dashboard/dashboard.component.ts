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
	ApexTooltip,
	ApexXAxis,
	ApexYAxis,
	ChartComponent
} from 'ng-apexcharts';
import { takeUntil, tap } from 'rxjs/operators';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { DashboardService, ISeriesTrackingData } from './dashboard.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IStationActiveByToken } from '../../modules/employee/employee-assessment/models/station-active-by-token.interface';
import { DataResponse } from '../../shared/models/data-response.model';
import { InventoryManagementService } from '../../modules/inventory-management/inventory-management.service';

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
export class DashboardComponent implements OnInit, AfterViewInit {
	@ViewChild('chart') chart: ChartComponent;
  @ViewChild('quantityChart') quantityChart: ChartComponent;

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

  public quantityChartOptions: Partial<ChartOptions> = {
    series: [],
    chart: {
      id: 'quantityChart',
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
      curve: 'straight',
      lineCap: 'round',
      width: 1
    },
    xaxis: {
      type: 'category',
      tickAmount: 'dataPoints'
    },
    marker: {
      size: 4,
      shape: "circle",
    },
    yaxis: {
      labels: {
        formatter: (value) => value.toLocaleString('en-US')
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
        formatter: (value) => `${value.toLocaleString('en-US')} lít`
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

	trackingPriceSeriesData: ISeriesTrackingData[] = [];
  trackingQuantitySeriesData: ISeriesTrackingData[] = [];
  searchForm: FormGroup;
  listStationByToken: IStationActiveByToken[];
  currentType = 'DAY';
  today: string = moment().format('DD/MM/YYYY');
  startOfMonth: string = moment().startOf('month').format('DD/MM/YYYY');

  constructor(
		private dashboardService: DashboardService,
		private destroy$: DestroyService,
		private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private inventoryManagementService: InventoryManagementService,
  ) {
    this.initSearchForm();
  }

  initSearchForm(): void {
    this.searchForm = this.fb.group({
      type: [this.currentType],
      startDate: [this.startOfMonth],
      endDate: [this.today],
      stationId: ['']
    });
  }

	ngOnInit(): void {
    this.getStationByToken();
  }

  getStationByToken() {
    this.inventoryManagementService
      .getStationByToken('NOT_DELETE', 'false')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: DataResponse<IStationActiveByToken[]>) => {
        this.listStationByToken = res.data;
        this.cdr.detectChanges();
      });
  }

	ngAfterViewInit(): void {
		this.dashboardService
			.getTrackingPriceData()
			.pipe(
				tap((series: ISeriesTrackingData[]) => {
					this.trackingPriceSeriesData = series;
					this.chart.updateSeries(this.trackingPriceSeriesData);
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();

    this.dashboardService
      .getTrackingQuantityData(this.searchForm.getRawValue())
      .pipe(
        tap((series: ISeriesTrackingData[]) => {
          this.trackingQuantitySeriesData = series;
          this.quantityChart.updateSeries(this.trackingQuantitySeriesData);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  changeType(): void {
    const nextType = this.searchForm.get('type').value;
    if (nextType !== this.currentType) {
      this.currentType = nextType;
      this.initSearchForm();
    }
    this.search();
  }

  search(): void {
    this.validateDate();

    if (this.searchForm.invalid) {
      return;
    }

    this.dashboardService
      .getTrackingQuantityData(this.searchForm.getRawValue())
      .pipe(
        tap((series: ISeriesTrackingData[]) => {
          this.trackingQuantitySeriesData = series;
          this.quantityChart.updateSeries(this.trackingQuantitySeriesData);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  validateDate(): void {
    const startDate = moment(this.searchForm.get('startDate').value, 'DD/MM/YYYY');
    const endDate = moment(this.searchForm.get('endDate').value, 'DD/MM/YYYY');
    const diffDays = endDate.diff(startDate, 'days');
    const diffMonths = endDate.diff(startDate, 'months');

    if (diffDays < 0) {
      this.searchForm.get('startDate').setErrors({ errorDate: true });
      this.searchForm.get('endDate').setErrors({ errorDate: true });
      return;
    } else {
      this.searchForm.get('startDate').setErrors(null);
      this.searchForm.get('endDate').setErrors(null);
    }

    if (diffDays > 30 && this.currentType === 'DAY' || diffMonths > 12 && this.currentType === 'MONTH') {
      this.searchForm.get('startDate').setErrors({ errDateRange: true });
      this.searchForm.get('endDate').setErrors({ errDateRange: true });
      return;
    } else {
      this.searchForm.get('startDate').setErrors(null);
      this.searchForm.get('endDate').setErrors(null);
    }
  }
}
