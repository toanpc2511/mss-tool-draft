import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';

export interface IUser {
  accountId: number;
  code: string;
  name: string;
  username: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETE';
  group: Array<any>;
  type: string;
}
export interface ISortData {
  fieldSort: string;
  directionSort: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpService) {}

  getUsers(page: number, size: number, searchText: string, sortData: ISortData) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('page', page.toString())
      .set('size', size.toString())
      .set('field-sort', sortData?.fieldSort || '')
      .set('direction-sort', sortData?.directionSort || '')
      .set('search-text', searchText || '');
    console.log(searchText);

    console.log(params);

    return this.http.get<Array<IUser>>('accounts', { params });
  }

  createUser(user: IUser) {
    return this.http.post(`accounts`, user);
  }

  updateUser(id: number, user: IUser) {
    return this.http.put(`accounts/${id}`, user);
  }

  deleteUser(id: number) {
    return this.http.delete(`accounts/${id}`);
  }
}
