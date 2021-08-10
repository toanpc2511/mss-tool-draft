import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';

export interface IRole {
	id: number;
	name: string;
	description: string;
}

export interface IRoleDetail {
	id: number;
	name: string;
	perrmission: Array<any>;
}

@Injectable({
	providedIn: 'root'
})
export class PermissionService {
	constructor(private http: HttpService) {}

	getRoles() {
		return this.http.customGet<Array<IRole>>(
			`${environment.apiUrl1}/permissions/roles`
		);
	}

	getRolesById(roleId: number) {
		const params = new HttpParams().set('role-id', roleId.toString());
		return this.http.get<IRoleDetail>('roles', { params });
	}

	createRole(role: IRole) {
		return this.http.post(`role`, role);
	}

	updateUser(id: number, role: IRole) {
		return this.http.put(`roles/${id}`, role);
	}

	deleteUser(id: number) {
		return this.http.delete(`roles/${id}`);
	}
}
