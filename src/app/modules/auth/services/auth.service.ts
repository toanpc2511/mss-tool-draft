import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { storageUtils } from 'src/app/shared/helpers/storage';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { finalize } from 'rxjs/operators';
import { HttpService } from 'src/app/shared/services/http.service';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  DELETE = 'DELETE',
  FIRST = 'FIRST',
  LOCK = 'LOCK'
}
export interface UserModel {
  driverAuth: {
    createdAt: string;
    updatedAt: string;
    profile: {
      id: 1;
      name: string;
      address: string;
      avatar: string;
    };
    phone: string;
    driverId: string;
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
  private currentUserSubject: BehaviorSubject<UserModel>;
  currentUser$: Observable<UserModel>;
  private isLoadingSubject: BehaviorSubject<boolean>;
  isLoading$: Observable<boolean>;

  constructor(private http: HttpService, private router: Router, private destroy$: DestroyService) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserModel>(null);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  getLoggedUser(): Observable<UserModel> {
    const user = storageUtils.get('currentUser') as UserModel;
    if (!user?.token) {
      this.logout();
    }
    this.setCurrentUserValue(user);
    return of(user);
  }

  setIsLoadingValue(isLoading: boolean) {
    this.isLoadingSubject.next(isLoading);
  }

  getIsLoadingValue() {
    return this.isLoadingSubject.value;
  }

  getCurrentUserValue(): UserModel {
    return this.currentUserSubject.value;
  }

  setCurrentUserValue(user: UserModel) {
    storageUtils.set('currentUser', user);
    this.currentUserSubject.next(user);
  }

  login(username: string, password: string) {
    this.setIsLoadingValue(true);
    return this.http
      .post<UserModel>('accounts/login', {
        username,
        password
      })
      .pipe(finalize(() => this.setIsLoadingValue(false)));
  }

  logout() {
    storageUtils.clear();
    this.router.navigate(['/auth/login'], {
      queryParams: {}
    });
  }
}
