import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser) {
            // check if route is restricted by role
            if (route.data.roles) {
                // role not authorised so redirect to home page
                this.router.navigate(['/login/']);
                return false;
            }
            // if(route.data.roles && route.data.roles.indexOf(currentUser.role) === "GROUP"){
            //     this.router.navigate(['/admin/']);
            //     return false;
            // }

            // authorised so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        //, { queryParams: { returnUrl: '' } }
        this.router.navigate(['/login']);
        return false;
    }
}