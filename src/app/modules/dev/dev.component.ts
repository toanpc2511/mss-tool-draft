import { UserModel } from './../auth/services/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit, isDevMode } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';

@Component({
	selector: 'app-dev',
	templateUrl: './dev.component.html',
	styleUrls: ['./dev.component.scss']
})
export class DevComponent implements OnInit {
	currentToken: string;
	currentActions: string[] = [];
	permisionKey = '';
	constructor(private authService: AuthService, private router: Router) {
		if (!isDevMode()) {
			this.router.navigate(['']);
		}
		this.currentToken = authService.getCurrentUserValue().token;
	}
	ngOnInit(): void {
		this.currentActions = this.authService.getCurrentUserValue().actions || [];
	}

	inputToken($event) {
		this.currentToken = $event.target.value;
	}

	updateToken() {
		this.authService.setCurrentUserValue({
			...this.authService.getCurrentUserValue(),
			token: this.currentToken
		});
		window.location.reload();
	}

	inputPermissionKey($event) {
		this.permisionKey = $event.target.value;
	}

	addPermission() {
		this.currentActions = [...this.currentActions].concat(this.permisionKey.split(','));
		this.updateUserPermission();
	}

	removePermission(actionRemove) {
		this.currentActions = [...this.currentActions].filter((action) => action !== actionRemove);
		this.updateUserPermission();
	}

	updateUserPermission() {
		const newUserValue: UserModel = {
			...this.authService.getCurrentUserValue(),
			actions: this.currentActions
		};
		this.authService.setCurrentUserValue(newUserValue);
	}
}
