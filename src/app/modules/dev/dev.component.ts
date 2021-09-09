import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';

@Component({
	selector: 'app-dev',
	templateUrl: './dev.component.html',
	styleUrls: ['./dev.component.scss']
})
export class DevComponent {
	currentToken: string;
	constructor(private authService: AuthService) {
		this.currentToken = authService.getCurrentUserValue().token;
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
}
