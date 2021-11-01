import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ErrorsRoutingModule} from './errors-routing.module';
import {ErrorsComponent} from './errors.component';
import {Error1Component} from './error1/error1.component';
import { ErrorAuthorizeComponent } from './error-authorize/error-authorize.component';

@NgModule({
  declarations: [ ErrorsComponent, Error1Component , ErrorAuthorizeComponent],
  imports: [
    CommonModule,
    ErrorsRoutingModule
  ]
})
export class ErrorsModule {}
