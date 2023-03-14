/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../../../core';
import { Observable } from 'rxjs';
import { AuthService, UserModel } from 'src/app/modules/auth/services/auth.service';

@Component({
	selector: 'app-user-offcanvas',
	templateUrl: './user-offcanvas.component.html',
	styleUrls: ['./user-offcanvas.component.scss']
})
export class UserOffcanvasComponent implements OnInit {
	extrasUserOffcanvasDirection = 'offcanvas-right';
	user$: Observable<UserModel>;

	constructor(private layout: LayoutService, private auth: AuthService) {}

	ngOnInit(): void {
		this.extrasUserOffcanvasDirection = `offcanvas-${this.layout.getProp(
			'extras.user.offcanvas.direction'
		)}`;
		this.user$ = this.auth.currentUser$;
	}

	logout() {
		this.auth.logout();
		// this.auth.logout().subscribe();
	}
}
