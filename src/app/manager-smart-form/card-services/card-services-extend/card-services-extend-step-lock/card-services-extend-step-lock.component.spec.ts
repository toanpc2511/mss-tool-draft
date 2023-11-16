/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CardServicesExtendStepLockComponent } from './card-services-extend-step-lock.component';

describe('CardServicesExtendStepLockComponent', () => {
  let component: CardServicesExtendStepLockComponent;
  let fixture: ComponentFixture<CardServicesExtendStepLockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardServicesExtendStepLockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardServicesExtendStepLockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
