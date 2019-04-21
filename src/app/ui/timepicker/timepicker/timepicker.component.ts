import { Component, forwardRef, Input, OnDestroy } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';

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
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TimepickerComponent),
      multi: true
    }
  ]
})
export class TimepickerComponent implements OnDestroy, ControlValueAccessor, Validator {

  @Input() labelName: string;
  @Input() messagesByStatus?: unknown;

  private timeReg = new RegExp('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$');

  public time: string;
  public inputChange$ = new Subject<string>();

  public disabled = false;
  public required = false;

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
    this.disabled = isDisabled;
  }

  public writeValue(time: Date): void {
      this.time = time ? moment(time).format('HH:mm') : '';
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  registerOnValidatorChange(fn: () => void): void {
  }

  validate(control: AbstractControl): ValidationErrors | null {
    this.required = !!(control.errors && control.errors.some(e => e === 'required'));

    return null;
  }

}
