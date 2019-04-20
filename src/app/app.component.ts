import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'cva-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  public timeControl = new FormControl('', { updateOn: 'change' });

  private destroy$ = new Subject<void>();

  constructor() {
    this.timeControl.valueChanges
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((time: Date) => console.log('AppComponent time: ' + time));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
