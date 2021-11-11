import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';

export interface IStationEployee {
  id: number;
  name: string;
  address: string;
  status: string;
  code: string;
}
export interface IEmployees {
  id: number;
  name: string;
  code: string;
  stationId: number;
}

export interface IFilterTransaction {
  status: string;
  stationId: number;
  employeeId: number;
  expectedDate: string;
  approvalDate: string;
}

export interface IGasFuel {
  capacity: string;
  code: string;
  description: null
  height: string;
  id: number;
  length: string;
  name: string;
  productId: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryManagementService {
  constructor(private http: HttpService) {}

  // Lấy ds trạm
  getStationEmployee() {
    return this.http.get<Array<IStationEployee>>(`employees/station`);
  }

  // Lấy ds tất cả nhân viên yêu cầu
  getAllEmployee() {
    return this.http.get<Array<IEmployees>>(`employees/stations-employee`);
  }

  // Lấy ds nhân viên yêu cầu theo trạm
  getEmployeeStation(stationName: string) {
    const params = new HttpParams().set('name-station', stationName);
    return this.http.get(`gas-stations/employee`, { params });
  }


  // Tìm kiếm giao dịch
  searchOrderRequest(page: number, size: number, data: IFilterTransaction) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('status', data.status)
      .set('station-id', data.stationId.toString())
      .set('employee-id', data.employeeId.toString())
      .set('expected-date', data.expectedDate)
      .set('approval-date', data.approvalDate);

    return this.http.get('import-request/filters', { params });
  }

  // Lấy ds bồn theo trạm và loại nhiên liệu
  getListGasFuel(productId: number | string, gasStationId: number | string) {
    const params = new HttpParams()
      .set('product-id', productId.toString())
      .set('gas-station-id', gasStationId.toString());

    return this.http.get<Array<IGasFuel>>('gas-fields/station-product', {params})
  }

  // tạo yêu cầu đặt hàng
  createOrderRequest(dataReq) {
    return this.http.post('import-request', dataReq);
  }

}
