import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { storageUtils } from 'src/app/shared/helpers/storage';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { environment } from 'src/environments/environment';

export interface UserModel {}
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
  login(email: string, password: string): Observable<UserModel> {
    return this.http.post<DataResponse<UserModel>>(`${this.apiUrl}`, {});
  }

  logout() {
    storageUtils.clear();
    this.router.navigate(['/auth/login'], {
      queryParams: {}
    });
  }
}
