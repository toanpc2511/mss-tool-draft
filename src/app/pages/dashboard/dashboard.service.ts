import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { HttpService } from './../../shared/services/http.service';
import { HttpParams } from '@angular/common/http';
import { convertDateToServer } from '../../shared/helpers/functions';
import { DataResponse } from 'src/app/shared/models/data-response.model';

export interface ITrackingPrice {
	product: {
		id: number;
		name: string;
		status: string;
	};
	trackingPrices: {
		createdAt: string;
		updatedAt: string;
		id: number;
		productId: number;
		area: 'AREA_1' | 'AREA_2';
		price: number;
	}[];
}

export interface IListTrackingQuantity {
  productName: string;
  trackingQuantity: ITrackingQuantity[];
}

export interface ITrackingQuantity {
  createdAt: string;
  updatedAt: string;
  id: number;
  stationCode: string;
  productName: string;
  productId: number;
  date: string;
  year: string;
  month: string;
  yearMonth: string;
  literal: number;
}

export interface ISeriesTrackingData {
	name: string;
	data: {
		x: string;
		y: number;
	}[];
}

export interface IFilter {
  startDate?: string,
  endDate?: string,
  stationCode?: string
  type?: string;
}

@Injectable({
	providedIn: 'root'
})
export class DashboardService {
	constructor(private http: HttpService) {}

	getTrackingPriceData() {
		return this.http
			.get<ITrackingPrice[]>(`tracking-price`)
			.pipe(
        switchMap((res) => of(this.convertToChartData(res.data)))
      );
	}

  getTrackingQuantityData(filter: IFilter) {
    const params = this.createParam(filter);
    return this.http
      .get<IListTrackingQuantity[]>(`tracking-quantities/charts`, {params})
      .pipe(
        switchMap((res: DataResponse<IListTrackingQuantity[]>) => of(this.convertToQuantityChartData(res.data, filter.type)))
      );
  }

  convertToQuantityChartData(data: IListTrackingQuantity[], type: string): ISeriesTrackingData[] {
    return data.map((listQuantity: IListTrackingQuantity) => {
      return {
        name: listQuantity.productName,
        data: listQuantity.trackingQuantity
          .map((quantity: ITrackingQuantity) => {
            const xy: { x: string; y: number } = {
              x: type === 'DAY' ? moment(quantity.date).format('DD/MM/YYYY') : type === 'MONTH' ? moment(quantity.yearMonth).format('MM/YYYY') : quantity.year,
              y: quantity.literal
            };
            return xy;
          })
          .reverse()
      };
    });
  }

	private convertToChartData(data: ITrackingPrice[]) {
		const series: ISeriesTrackingData[] = data.map((tp) => {
			const serie: ISeriesTrackingData = {
				name: tp.product.name,
				data: tp.trackingPrices
					.map((d) => {
						const xy: { x: string; y: number } = {
							x: `${moment(d.createdAt).format('YYYY/MM/DD')} GMT`,
							y: d.price
						};
						return xy;
					})
					.reverse()
			};
			return serie;
		});
		return series;
	}

  createParam(filter: IFilter): HttpParams {
    console.log(filter);
    return new HttpParams()
      .set('date-from', convertDateToServer(filter.startDate))
      .set('date-to', convertDateToServer(filter.endDate))
      .set('station', filter.stationCode || '')
      .set('type', filter.type || '');
  }
}
