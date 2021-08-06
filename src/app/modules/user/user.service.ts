import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';

export interface IUser {
  accountId: number;
  code: string;
  name: string;
  username: string;
  roleIds: Array<number>;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETE';
}

export interface IUserInput {
  status: 'ACTIVE' | 'INACTIVE' | 'DELETE';
  code: string;
  roleIds: Array<number>;
  name: string;
  password: string;
  username: string;
}

export interface IUserUpdate {
  status: 'ACTIVE' | 'INACTIVE' | 'DELETE';
  roleIds: Array<number>;
}
export interface ISortData {
  fieldSort: string;
  directionSort: string;
}

export interface IRole {
  id: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpService) {}

  getRoles() {
    return this.http.customGet<Array<IRole>>(`${environment.apiUrl1}/permissions/roles`);
  }

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

  getUserById(accountId) {
    const params = new HttpParams().set('account-id', accountId);
    return this.http.get<IUser>(`accounts/details`, { params });
  }

  createUser(user: IUserInput) {
    return this.http.post(`accounts/admin/register`, user);
  }

  updateUser(id: number, user: IUserUpdate) {
    return this.http.put(`accounts/${id}`, user);
  }

  deleteUser(id: number) {
    return this.http.delete(`accounts/${id}`);
  }
}
