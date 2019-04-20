import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimepickerComponent } from './timepicker/timepicker.component';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  imports: [
    CommonModule,
    NgxMaskModule.forRoot()
  ],
  declarations: [
    TimepickerComponent
  ],
  exports: [
    TimepickerComponent
  ]
})
export class TimepickerModule { }
