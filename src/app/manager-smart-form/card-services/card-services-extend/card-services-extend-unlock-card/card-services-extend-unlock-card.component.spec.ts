/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CardServicesExtendUnlockCardComponent } from './card-services-extend-unlock-card.component';

describe('CardServicesExtendUnlockCardComponent', () => {
  let component: CardServicesExtendUnlockCardComponent;
  let fixture: ComponentFixture<CardServicesExtendUnlockCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardServicesExtendUnlockCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardServicesExtendUnlockCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
