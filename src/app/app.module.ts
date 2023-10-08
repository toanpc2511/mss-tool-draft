import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { CalendarComponent } from './modules/calendar/calendar.component';
import { TemplateComponent } from './modules/template/template.component';
import { DragToSelectModule } from 'ngx-drag-to-select';

@NgModule({
  declarations: [AppComponent, CalendarComponent, TemplateComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    DragToSelectModule.forRoot({
      shortcuts: {
        disableSelection: '',
        toggleSingleItem: '',
        addToSelection: '',
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
