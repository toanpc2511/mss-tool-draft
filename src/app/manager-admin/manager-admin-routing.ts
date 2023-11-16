import { NgModule } from '@angular/core';
import {RouterModule } from '@angular/router';

@NgModule({
    imports:[
        RouterModule.forChild([
            { 
                path: '', 
                loadChildren:() => import('./manager-admin.module').then(m => m.ManagerAdminModule) ,
                data: { preload: true }
            },
            
        ]),
        
    ]
})
export class ManagerAdminRoutingModule{}