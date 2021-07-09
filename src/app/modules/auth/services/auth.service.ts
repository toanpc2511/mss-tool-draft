import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { storageUtils } from 'src/app/shared/helpers/storage';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { environment } from 'src/environments/environment';

export interface UserModel {
  driver_auth: {
    created_at: string;
    updated_at: string;
    profile: {
      id: 1;
      name: string;
      address: string;
      avatar: string;
    };
    phone: string;
    driver_id: string;
    role: string;
    type: string;
  };
  token: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = environment.apiUrl;
  currentUser$: Observable<UserModel>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserModel>;
  isLoadingSubject: BehaviorSubject<boolean>;

  get currentUserValue(): UserModel {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserModel) {
    this.currentUserSubject.next(user);
  }

  constructor(private router: Router, private readonly http: HttpClient) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserModel>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  // public methods
  login(body: { phone: string; password: string }): Observable<DataResponse<UserModel>> {
    // return this.http.post<DataResponse<UserModel>>(`${this.apiUrl}/accounts/login`, body);

    // fake response
    return of({
      data: {
        driver_auth: {
          created_at: null,
          updated_at: null,
          profile: {
            id: 1,
            name: 'Hieu',
            address: 'Thai Binh',
            avatar: 'https://www.dungplus.com/wp-content/uploads/2019/12/girl-xinh-600x600.jpg'
          },
          phone: '0387120234',
          driver_id: null,
          role: '',
          type: 'DRIVER_N_ENTERPRISE'
        },
        token:
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiIiwicGhvbmUiOiIwMzg3MTIwMjM0IiwiaWF0IjoxNjI1NzEzMTI5fQ.XCNmgtlqoV11kSYrrCePjB5newueb83lCoGPY9okQtU'
      },
      meta: {
        code: 'SUN-OIL-200'
      }
    });
  }

  logout() {
    storageUtils.clear();
    this.router.navigate(['/auth/login'], {
      queryParams: {}
    });
  }

  setCurrentUser(user: UserModel) {
    storageUtils.set('currentUser', user.driver_auth);
    storageUtils.set('token', user.token);
    this.currentUserSubject.next(user);
  }
}
