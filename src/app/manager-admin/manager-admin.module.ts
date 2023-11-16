import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatSlideToggleModule} from '@angular/material/slide-toggle'
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { routesAdmin } from './admin-routing';
import { ManagerAdminComponent } from './manager-admin.component';
import { ManagerSystemComponent } from './manager-system/manager-system.component';
import { MatIconModule } from '@angular/material/icon';
import { GecoDialogModule } from 'angular-dynamic-dialog';
import { PopupSystemEditUserComponent } from './popup-system-edit-user/popupp-system-edit-user.component';
import { PopupSystemAddUserComponent } from './popup-system-add-user/popup-system-add-user.component';
import { PopupSystemAddRoleComponent } from './popup-system-add-role/popup-system-add-role.component';
import { PopupSystemEditRoleComponent } from './popup-system-edit-role/popup-system-edit-role.component';
import { PopupSystemAddRightComponent } from './popup-system-add-right/popup-system-add-right.component';
import { PaginatorDirective } from '../_directive/paginator.directive';
import { PopupSystemAddTitleComponent } from './popup-system-add-title/popup-system-add-title.component';
import { PopupSystemEditTitleComponent } from './popup-system-edit-title/popup-system-edit-title.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PopupGroupTitleRoleComponent } from './popup-group-title-role/popup-group-title-role.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PopupConfirmComponent } from '../_popup/popup-confirm.component';
import { SharedModule } from "../shared.module";
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {NgSelectModule} from "@ng-select/ng-select";
import { PopupDetailUserComponent } from './popup-detail-user/popup-detail-user.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {ProgressSpinnerModule} from "../progress-spinner/progress-spinner.module";
import { PopupSystemAddFunctionComponent } from './popup-system-add-function/popup-system-add-function.component';
import { PopupSystemAddActionComponent } from './popup-system-add-action/popup-system-add-action.component';

@NgModule({
    declarations: [
        ManagerAdminComponent,
        ManagerSystemComponent,
        PopupSystemEditUserComponent,
        PopupSystemAddUserComponent,
        PopupSystemEditRoleComponent,
        PopupSystemAddRoleComponent,
        PopupSystemAddRightComponent,
        PopupSystemAddTitleComponent,
        PopupSystemEditTitleComponent,
        PaginatorDirective,
        PopupGroupTitleRoleComponent,
        PopupConfirmComponent,
        PopupDetailUserComponent,
        PopupSystemAddFunctionComponent,
        PopupSystemAddActionComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routesAdmin),
        NgMultiSelectDropDownModule.forRoot(),
        MatNativeDateModule,
        FormsModule,
        ReactiveFormsModule,
        MatTabsModule, MatIconModule,
        GecoDialogModule,
        MatTableModule,
        MatPaginatorModule,
        CdkTableModule,
        MatSlideToggleModule,
        MatTooltipModule, SharedModule, MatFormFieldModule, MatOptionModule, MatSelectModule,
        MatCheckboxModule, NgSelectModule,
        MatProgressSpinnerModule, ProgressSpinnerModule,
    ],
    entryComponents: [
        PopupSystemEditUserComponent,
        PopupSystemAddUserComponent,
        PopupSystemEditRoleComponent,
        PopupSystemAddRoleComponent,
        PopupSystemAddRightComponent,
        PopupSystemAddTitleComponent,
        PopupSystemEditTitleComponent,
        PopupGroupTitleRoleComponent,
        PopupConfirmComponent,
        PopupDetailUserComponent
    ],
    bootstrap: [ManagerSystemComponent],
    providers: [
        {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'}},
    ],
    exports: [
        PaginatorDirective
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ManagerAdminModule { }
