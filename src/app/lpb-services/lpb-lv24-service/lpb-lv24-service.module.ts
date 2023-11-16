import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { SharedModule } from 'src/app/shared.module';

import { LpbLv24ServiceRoutingModule } from './lpb-lv24-service-routing.module';
import { CustomerUserInfoFormComponent } from './shared/components/customer-user-info-form/customer-user-info-form.component';
import { FormSearchComponent } from './shared/components/form-search/form-search.component';
import { InputWithTypeComponent } from './shared/components/input-with-type/input-with-type.component';
import { Lv24FormComponent } from './shared/components/lv24-form/lv24-form.component';
import { ParseLVL24ProfileStatusCodeToVI } from './shared/pipes/LVL24ProfileStatusVi.pipe';

import { CreateComponent as CreateLockUnlockResetPassword } from './lock-unlock-reset-password/create/create.component';
import { DetailComponent as DetailLockUnlockResetPassword } from './lock-unlock-reset-password/detail/detail.component';

import { ListComponent } from './list/list.component';
import { CreateComponent } from './shared/components/create/create.component';
import { DetailComponent } from './shared/components/detail/detail.component';

@NgModule({
  declarations: [
    ListComponent,
    InputWithTypeComponent,
    Lv24FormComponent,
    CustomerUserInfoFormComponent,
    ParseLVL24ProfileStatusCodeToVI,
    FormSearchComponent,

    CreateComponent,
    DetailComponent,

    CreateLockUnlockResetPassword,
    DetailLockUnlockResetPassword,
  ],
  imports: [
    CommonModule,
    SharedModule,
    LpbLv24ServiceRoutingModule,
    MatCheckboxModule,
  ],
  providers: [ParseLVL24ProfileStatusCodeToVI],
})
export class LpbLv24ServiceModule {}
