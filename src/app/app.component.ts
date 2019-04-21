import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'cva-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  // public timePickersGroup = new FormGroup({
  //   timeControl: new FormControl('', { updateOn: 'change' }),
  //   timeControlRequired: new FormControl(new Date(), {
  //     validators: [
  //       Validators.required
  //     ],
  //     updateOn: 'change'
  //   })
  // });

  public timeControl = new FormControl('', { updateOn: 'change' });
  public timeControlRequired = new FormControl(new Date(), {
    validators: [
      Validators.required
    ],
    updateOn: 'change'
  });

  public messagesByStatus = {
    required: 'Поле обязательное'
  };

  private destroy$ = new Subject<void>();

  constructor() {
    this.timeControl.valueChanges
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((time: Date) => {
        console.log('timeControl time: ' + time);
        this.timeControl.disable({ emitEvent: false });
      });

    this.timeControlRequired.valueChanges
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((time: Date) => console.log('timeControlRequired time: ' + time));
  }

  public submitForm() {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
