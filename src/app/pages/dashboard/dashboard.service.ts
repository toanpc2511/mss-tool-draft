import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { switchMap } from 'rxjs/operators';
import { DataResponse } from '../../shared/models/data-response.model';
import { of } from 'rxjs';
import * as moment from 'moment';

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

export interface ISeriesTrackingData {
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

  constructor(private http: HttpService) { }

  getTrackingPriceData() {
    return this.http
      .get<ITrackingPrice[]>(`tracking-price`)
      .pipe(
        switchMap((res: DataResponse<ITrackingPrice[]>) => of(this.convertToChartData(res.data)))
      );
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
}
