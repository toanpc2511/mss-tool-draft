import {Injectable} from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivateChild,
  Router,
  NavigationExtras
} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../_services/authentication.service';
import {UniStorageService} from '../shared/services/uni-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CheckPermissionGuard implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private uniStorageService: UniStorageService
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log('canActivate Url:', state.url);
    return true;
  }


  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // console.log('action:', next.data, next.data.action);
    const userInfo = this.uniStorageService.getUserInfo();
    let canAccess = false;
    const urlWithoutParam = state.url.split('?')[0];
    // console.log('canActivateChild Url:', state.url, state.url.split('?')[0]);
    const frontendAction = JSON.parse(localStorage.getItem('frontendAction'));
    for (const key in frontendAction) {
      for (const key2 in frontendAction[key]) {
        if (frontendAction[key][key2].feUrl === urlWithoutParam
          && (frontendAction[key][key2].description === 'ALL' || frontendAction[key][key2].description?.includes(userInfo.branchCode))) {
          canAccess = true;
        }
      }
    }
    // console.log(canAccess, urlWithoutParam);
    const permission = canAccess || urlWithoutParam === '/smart-form/home';
    if (permission) {
      return true;
    } else {
      const navigationExtras: NavigationExtras = {
        queryParams: { url: urlWithoutParam },
        fragment: 'anchor'
      };
      this.router.navigate(['/permission-denied'], navigationExtras);
      return false;
    }

  }

}
