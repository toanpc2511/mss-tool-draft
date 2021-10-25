import { Pipe, PipeTransform } from '@angular/core';
import { UserModel } from 'src/app/modules/auth/services/auth.service';

@Pipe({
  name: 'canShowMenu'
})
export class CanShowMenuPipe implements PipeTransform {

  transform(currentUser: UserModel, permissionKey: string): boolean {
    return true;
  }
}
