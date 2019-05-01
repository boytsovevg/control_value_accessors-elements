import { Component, forwardRef, Input, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import * as moment from 'moment';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'cva-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimepickerComponent),
      multi: true
    }
  ]
})
export class TimepickerComponent implements OnDestroy, ControlValueAccessor {

  @Input() labelName: string;

  private timeReg = new RegExp('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$');

  public time: string;
  public inputChange$ = new Subject<string>();

  public disabled = false;

  private destroy$ = new Subject<void>();

  constructor() {
    this.inputChange$
      .pipe(
        filter((timeString: string) => (this.timeReg.test(timeString)) || !timeString),
        takeUntil(this.destroy$)
      )
      .subscribe((timeString: string) => this.updateTime(timeString));
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public updateTime(timeString: string): void {
    const time = timeString && moment(timeString, 'LT').toDate() || null;

    this.onTimeChange(time);
    this.onTouched(time);
  }

  public registerOnChange(fn: (time: Date) => void): void {
    this.onTimeChange = fn;
  }

  public registerOnTouched(fn: (time: Date) => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public writeValue(time: Date): void {
      this.time = time ? moment(time).format('HH:mm') : '';
  }

  private onTimeChange: (time: Date) => void = (time: Date) => {};

  private onTouched: (time: Date) => void = (time: Date) => {};
}
