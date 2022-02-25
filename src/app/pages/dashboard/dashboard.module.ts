import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardsModule } from '../../_metronic/partials/content/dashboards/dashboards.module';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import {SharedComponentsModule} from "../../shared/components/shared-components.module";
import {CoreModule} from "../../_metronic/core";

@NgModule({
	declarations: [DashboardComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: DashboardComponent
            }
        ]),
        DashboardsModule,
        NgApexchartsModule,
        NgbDatepickerModule,
        ReactiveFormsModule,
        SharedComponentsModule,
        CoreModule
    ]
})
export class DashboardModule {}
