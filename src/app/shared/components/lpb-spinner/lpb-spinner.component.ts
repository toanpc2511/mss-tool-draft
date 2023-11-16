import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SpinnerHandlerService} from '../../services/spinner-handler.service';

@Component({
  selector: 'app-lpb-spinner',
  templateUrl: './lpb-spinner.component.html',
  styleUrls: ['./lpb-spinner.component.scss']
})
export class LpbSpinnerComponent implements OnInit, AfterViewInit  {
  spinnerActive = true;


  constructor(
    public spinnerHandler: SpinnerHandlerService,
    private cdr: ChangeDetectorRef
  ) {
    this.spinnerHandler.loadingSub.subscribe(this.showSpinner.bind(this));
  }

  ngOnInit(): void {
  }
  showSpinner = (state: boolean): void => {
    this.spinnerActive = state;
  }

  ngAfterViewInit(): void {
    // this.message = 'all done loading :)'
    this.cdr.detectChanges();
  }
}
