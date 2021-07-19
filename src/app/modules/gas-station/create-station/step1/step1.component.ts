import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GasStationService, IStep1Data, StepData } from '../../gas-station.service';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss']
})
export class Step1Component implements OnInit {
  @Output() stepSubmitted = new EventEmitter();
  constructor(private gasStationService: GasStationService) {}

  ngOnInit(): void {}

  submit() {
    this.stepSubmitted.next({
      currentStep: 1,
      step1: null
    });
  }
}
