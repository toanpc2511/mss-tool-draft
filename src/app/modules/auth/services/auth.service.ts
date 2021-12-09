import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase';
import jwt_decode from 'jwt-decode';
import { BehaviorSubject, defer, Observable, of, throwError } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { storageUtils } from 'src/app/shared/helpers/storage';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';
import { EAuthorize } from './authorizes';

export enum UserStatus {
	ACTIVE = 'ACTIVE',
	DELETE = 'DELETE',
	FIRST = 'FIRST',
	LOCK = 'LOCK'
}
export interface UserModel {
	accountAuth: {
		accountId: string;
		createdAt: Date;
		role: string;
		status: UserStatus;
		updatedAt: Date;
		username: string;
		profile: IProfile;
    otp: boolean;
	};
	actions: string[];
	changePassword: boolean;
	token: string;
}

export interface IProfile {
	name: string;
	dateOfBirth: string;
	idCard: string;
	address: string;
	phone: string;
	code: string;
	email: string;
	avatar: {
		face: string;
		id: number;
		name: string;
		type: string;
		url: string;
	};
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

	constructor(
		private http: HttpService,
		private router: Router,
		public firebaseAuth: AngularFireAuth
	) {
		this.isLoadingSubject = new BehaviorSubject<boolean>(false);
		this.currentUserSubject = new BehaviorSubject<UserModel>(null);
		this.currentUser$ = this.currentUserSubject.asObservable();
		this.isLoading$ = this.isLoadingSubject.asObservable();
	}

	getLoggedUser(): Observable<UserModel> {
		const user = storageUtils.get('currentUser') as UserModel;
		if (user?.token) {
			const tokenDecode = jwt_decode(user.token);
			console.log(tokenDecode);
			this.setCurrentUserValue(user);
			return of(user);
		}
		return of(null);
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
			.post<any>('accounts/login', {
				username,
				password
			})
			.pipe(finalize(() => this.setIsLoadingValue(false)));
	}

	changePasswordFirstLogin(accountId: string, password: string) {
		this.setIsLoadingValue(true);
		return this.http
			.post<UserModel>('accounts/passwords/first', {
				id: accountId,
				password
			})
			.pipe(finalize(() => this.setIsLoadingValue(false)));
	}

	logout() {
		return this.http.post(`auth/logout`, {}).pipe(finalize(() => this.clearData()));
	}

	clearData() {
		storageUtils.clear();
		this.setCurrentUserValue(null);
		this.router.navigate(['/auth/login'], {
			queryParams: {}
		});
	}

	getProfileInfo() {
		return this.http.get('profiles');
	}

	canUseFeature(featurePermissionKey: EAuthorize) {
		const actions = this.currentUserSubject.value?.actions || [];
		if (actions.includes(featurePermissionKey)) {
			return true;
		}
		return false;
	}

	sendOTP(phoneNumber: string, recaptchaVerifier: firebase.auth.RecaptchaVerifier) {
		const phoneVerifier$ = defer(() =>
			this.firebaseAuth.signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
		);
		return phoneVerifier$.pipe(
			switchMap((confirmResult) => {
				if (confirmResult) {
					return of(confirmResult);
				}
				return throwError({
					code: 'CAN_NOT_SEND_OTP',
					message: `Can not send otp to ${phoneNumber}`
				});
			})
		);
	}

	verifyOTP(confirmationResult: firebase.auth.ConfirmationResult, verificationCode: string) {
		return defer(() => confirmationResult.confirm(verificationCode));
	}

	sendOTPAsync(phoneNumber: string, recaptchaVerifier: firebase.auth.RecaptchaVerifier) {
		return this.firebaseAuth.signInWithPhoneNumber(phoneNumber, recaptchaVerifier);
	}

  togglesOtps(dataReq) {
    return this.http.post('accounts/toggles/otps', dataReq);
  }
}
