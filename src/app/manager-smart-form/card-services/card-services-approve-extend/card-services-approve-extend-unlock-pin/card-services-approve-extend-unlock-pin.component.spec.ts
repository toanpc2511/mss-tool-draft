/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CardServicesApproveExtendUnlockPinComponent } from './card-services-approve-extend-unlock-pin.component';

describe('CardServicesApproveExtendUnlockPinComponent', () => {
  let component: CardServicesApproveExtendUnlockPinComponent;
  let fixture: ComponentFixture<CardServicesApproveExtendUnlockPinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardServicesApproveExtendUnlockPinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardServicesApproveExtendUnlockPinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
