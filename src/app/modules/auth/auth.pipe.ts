import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { Pipe, PipeTransform } from '@angular/core';
import { EAuthorize } from './services/authorizes';

@Pipe({
	name: 'canUseFeature'
})
export class CanUseFeaturePipe implements PipeTransform {
	constructor(private authService: AuthService) {}
	transform(featurePermissionKey: EAuthorize): boolean {
		return this.authService.canUseFeature(featurePermissionKey);
	}
}
