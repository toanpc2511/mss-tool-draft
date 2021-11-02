import { CanUseFeaturePipe } from './../../../modules/auth/auth.pipe';
import { Component } from '@angular/core';
import { EAuthorize } from 'src/app/modules/auth/services/authorizes';

export class BaseComponent {
	eAuthorize = EAuthorize;
}
