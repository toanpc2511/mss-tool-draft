import { Pipe, PipeTransform } from '@angular/core';
import {AuthenticationService} from '../../_services/authentication.service';

@Pipe({
  name: 'canUseFeature',
})
export class CanUseFeaturePipe implements PipeTransform {
  constructor(private authService: AuthenticationService) {
  }
  transform(featurePermissionKey: string): boolean {
    return this.authService.isPermissionWithCode(featurePermissionKey);
  }
}
