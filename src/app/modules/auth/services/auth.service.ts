import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { storageUtils } from 'src/app/shared/helpers/storage';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { HttpClient } from '@angular/common/http';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { map } from 'rxjs/operators';
import { HttpService } from 'src/app/shared/services/http.service';
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  DELETE = 'DELETE',
  FIRST = 'FIRST',
  LOCK = 'LOCK'
}
export interface UserModel {
  accountId: string;
  createdAt: Date;
  role: string;
  status: UserStatus;
  updatedAt: Date;
  username: string;
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

  constructor(private http: HttpService, private router: Router, private destroy$: DestroyService) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserModel>(null);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  login(username: string, password: string) {
    return this.http.post<DataResponse<UserModel>>('accounts/login', {
      userName: username,
      password
    });
  }

  changePasswordFirstLogin(accountId: string, password: string) {
    return this.http.post<DataResponse<any>>('accounts/passwords/first', {
      id: accountId,
      password
    });
  }

  logout() {
    storageUtils.clear();
    this.router.navigate(['/auth/login'], {
      queryParams: {}
    });
  }
}
