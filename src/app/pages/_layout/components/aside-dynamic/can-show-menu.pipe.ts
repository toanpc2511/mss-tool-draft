import { IMenuConfigItem } from './../../../../_metronic/configs/menu-config';
import { Pipe, PipeTransform } from '@angular/core';
import { UserModel } from 'src/app/modules/auth/services/auth.service';

const isDisaled = true;

@Pipe({
	name: 'canShowMenu'
})
export class CanShowMenuPipe implements PipeTransform {
	transform(currentUser: UserModel, permissionKey: string): boolean {
		const permissions = currentUser.actions;
		return permissions?.includes(permissionKey) || isDisaled;
	}
}

@Pipe({
	name: 'canShowParrentMenu'
})
export class CanShowParrentMenuPipe implements PipeTransform {
	transform(currentUser: UserModel, submenu: IMenuConfigItem[]): boolean {
		const permissions = currentUser.actions;
		return submenu.some((sm) => permissions?.includes(sm.permissionKey)) || isDisaled;
	}
}
