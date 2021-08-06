import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { InputTrimModule } from 'ng2-trim-directive';
import { NgSelectModule } from 'src/app/shared/components/ng-select/public-api';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { ListUserComponent } from './list-user/list-user.component';
import { UserModalComponent } from './user-modal/user-modal.component';
import { ProductTypeRoutingModule } from './user-routing.module';
import { ProductTypeComponent } from './user.component';

@NgModule({
  declarations: [ProductTypeComponent, ListUserComponent, UserModalComponent],
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
    InputTrimModule
  ]
})
export class ProductTypeModule {}
