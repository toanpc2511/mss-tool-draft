import { UserModel } from './../../../modules/auth/services/auth.service';
import { storageUtils } from './../../helpers/storage';
import { CanUseFeaturePipe } from './../../../modules/auth/auth.pipe';
import { Component } from '@angular/core';
import { EAuthorize } from 'src/app/modules/auth/services/authorizes';

export class BaseComponent {
	eAuthorize = EAuthorize;
	currentActions = [];
	constructor() {
		this.currentActions = (storageUtils.get('currentUser') as UserModel)?.actions || [];
	}
}
