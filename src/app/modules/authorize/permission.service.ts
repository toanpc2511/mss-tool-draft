import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';

export interface IRole {
	id: number;
	name: string;
	description: string;
}

export enum EMethod {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	DELETE = 'DELETE'
}
export interface IFeature {
	id: number;
	name: string;
	method: EMethod;
}
export interface IGroup {
	id: string;
	moduleId: number;
	name: string;
	features: Array<IFeature>;
}
export interface IModule {
	id: number;
	name: string;
	groups: Array<IGroup>;
}

export class FeatureData implements IFeature {
	id: number;
	name: string;
	method: EMethod;
	checked: boolean;
	constructor(data: IFeature) {
		this.id = data.id;
		this.name = data.name;
		this.method = data.method;
		this.checked = false;
	}
}

export class GroupData implements IGroup {
	id: string;
	name: string;
	features: FeatureData[];
	checked: boolean;
	moduleId: number;
	constructor(data: IGroup) {
		this.id = data.id;
		this.moduleId = data.moduleId;
		this.name = data.name;
		this.features = data.features.map((f) => new FeatureData(f));
		this.checked = false;
	}
}

export class ModuleData implements IModule {
	id: number;
	name: string;
	groups: GroupData[];
	checked: boolean;
	constructor(data: IModule) {
		this.id = data.id;
		this.name = data.name;
		this.groups = data.groups.map((group) => new GroupData(group));
		this.checked = false;
	}
}

export interface IModuleInput {
	name: string;
	groupFeature: any;
}

@Injectable({
	providedIn: 'root'
})
export class PermissionService {
	constructor(private http: HttpService) {}

	getRoles() {
		return this.http.customGet<Array<IRole>>(`${environment.apiUrl1}/permissions/roles`);
	}

	// getRolesById(roleId: number) {
	// 	const params = new HttpParams().set('role-id', roleId.toString());
	// 	return this.http.get<IRoleDetail>('roles', { params });
	// }

	getModules() {
		return this.http.customGet<Array<IModule>>(`${environment.apiUrl1}/permissions/modules`);
	}

	createRole(role: IModuleInput) {
		return this.http.customPost<IRole>(`${environment.apiUrl1}/permissions/roles`, role);
	}

	updateRole(id: number, role: IModuleInput) {
		return this.http.customPut<IRole>(`${environment.apiUrl1}/permissions/roles/${id}`, role);
	}

	deleteRole(id: number) {
		return this.http.customDelete<any>(`${environment.apiUrl1}/permissions/roles/${id}`);
	}
}
