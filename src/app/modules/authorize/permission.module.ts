import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgbAccordionModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { InputTrimModule } from 'ng2-trim-directive';
import { NgSelectModule } from 'src/app/shared/components/ng-select/public-api';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { ListPermissionComponent } from './list-permission/list-permission.component';
import { PermissionModalComponent } from './permission-modal/permission-modal.component';
import { ProductTypeRoutingModule } from './permission-routing.module';
import { PermissionComponent } from './permission.component';

@NgModule({
  declarations: [PermissionComponent, ListPermissionComponent, PermissionModalComponent],
  imports: [
    CommonModule,
    ProductTypeRoutingModule,
    NgbTooltipModule,
    InlineSVGModule,
    CRUDTableModule,
    NgSelectModule,
    FormsModule,
    SharedComponentsModule,
    ReactiveFormsModule,
    InputTrimModule,
    NgbAccordionModule
  ]
})
export class PermissionModule {}
