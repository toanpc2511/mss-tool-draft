import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpService } from './../../shared/services/http.service';

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

export interface ISerieTrackingPriceData {
	name: string;
	data: {
		x: string;
		y: number;
	}[];
}

@Injectable({
	providedIn: 'root'
})
export class DashboardService {
	constructor(private http: HttpService) {}

	getTrackingPriceData() {
		return this.http
			.get<ITrackingPrice[]>(`tracking-price`)
			.pipe(switchMap((res) => of(this.convertToChartData(res.data))));
	}

	private convertToChartData(data: ITrackingPrice[]) {
		const series: ISerieTrackingPriceData[] = data.map((tp) => {
			const serie: ISerieTrackingPriceData = {
				name: tp.product.name,
				data: tp.trackingPrices.map((d) => {
					const xy: { x: string; y: number } = {
						x: `${moment(d.createdAt).format('YYYY/MM/DD')} GMT`,
						y: d.price
					};
					return xy;
				})
			};
			return serie;
		});
		return series;
	}
}
