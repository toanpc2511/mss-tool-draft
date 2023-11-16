import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthenticationService } from "../_services/authentication.service";

export interface CanComponentDeactiveate {
    canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean
}

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactiveate>{
    permissionMenu: any
    canDeactivate(component: CanComponentDeactiveate, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        // return component.canDeactivate ? component.canDeactivate() : true
        this.permissionMenu = JSON.parse(localStorage.getItem("function"))
        if (this.permissionMenu !==null && this.permissionMenu !== undefined &&this.permissionMenu.length == 1 && this.permissionMenu[0] == 'SYSTEM_MANAGEMENT') {
            if (currentState.url === '/smart-form/admin/system' && nextState.url === '/smart-form') {
               this.logout()
            }
        } else {
            if (currentState.url === '/smart-form/admin/system' && nextState.url === '/login') {
                this.logout()
            }else if(currentState.url === '/smart-form/fileProcessed' && nextState.url === '/smart-form'){
                this.logout()
            }else if(currentState.url === '/smart-form/process/list' && nextState.url === '/smart-form'){
                this.logout()
            }
        }
        return true
    }
    logout(){
        localStorage.removeItem('objBreadcrumb');
        sessionStorage.removeItem('currentUser');
        localStorage.removeItem('function');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('action');
        localStorage.removeItem('index');
        localStorage.removeItem('role');
        sessionStorage.removeItem('flag')
        window.location.href = "/login"
    }

}