import { Component, forwardRef, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import * as moment from 'moment';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';

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

  private timeReg = new RegExp('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$');

  public inputChange$ = new Subject<string>();

  private destroy$ = new Subject<void>();

  constructor() {
    this.inputChange$
      .pipe(
        distinctUntilChanged(),
        debounceTime(200),
        filter((timeString: string) => this.timeReg.test(timeString)),
        takeUntil(this.destroy$)
      )
      .subscribe((timeString: string) => this.updateTime(timeString));
  }

  private onTimeChange: (time: Date) => void = (time: Date) => {};

  private onTouched: (time: Date) => void = (time: Date) => {};

  public updateTime(timeString: string): void {
    this.onTimeChange(moment(timeString, 'LT').toDate());
    this.onTouched(moment(timeString, 'LT').toDate());
  }

  public registerOnChange(fn: (time: Date) => void): void {
    this.onTimeChange = fn;
  }

  public registerOnTouched(fn: (time: Date) => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
  }

  public writeValue(time: Date): void {
    this.onTimeChange(time);
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
