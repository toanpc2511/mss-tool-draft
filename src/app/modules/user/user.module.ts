import { AuthModule } from './../auth/auth.module';
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
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';

@NgModule({
  declarations: [UserComponent, ListUserComponent, UserModalComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    NgbTooltipModule,
    InlineSVGModule,
    CRUDTableModule,
    NgSelectModule,
    FormsModule,
    SharedComponentsModule,
    ReactiveFormsModule,
    InputTrimModule,
    AuthModule
  ]
})
export class UserModule {}
