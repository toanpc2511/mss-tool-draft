import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateManagementComponent } from './template-management/template-management.component';
import { NewTemplateComponent } from './new-template/new-template.component';
import { GridTemplateComponent } from './grid-template/grid-template.component';
import { TemplateRoutingModule } from './template-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DragToSelectModule } from 'ngx-drag-to-select';

@NgModule({
  declarations: [
    TemplateManagementComponent,
    NewTemplateComponent,
    GridTemplateComponent,
  ],
  imports: [
    CommonModule,
    TemplateRoutingModule,
    SharedModule,
    DragToSelectModule.forRoot(),
  ],
})
export class TemplateModule {}
