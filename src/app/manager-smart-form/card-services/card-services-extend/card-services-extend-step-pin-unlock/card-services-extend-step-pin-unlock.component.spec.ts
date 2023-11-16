/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CardServicesExtendStepPinUnlockComponent } from './card-services-extend-step-pin-unlock.component';

describe('CardServicesExtendStepPinUnlockComponent', () => {
  let component: CardServicesExtendStepPinUnlockComponent;
  let fixture: ComponentFixture<CardServicesExtendStepPinUnlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardServicesExtendStepPinUnlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardServicesExtendStepPinUnlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
