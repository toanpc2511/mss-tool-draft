import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardServicesApproveExtendUnlockCardComponent } from './card-services-approve-extend-unlock-card.component';

describe('CardServicesApproveExtendUnlockCardComponent', () => {
  let component: CardServicesApproveExtendUnlockCardComponent;
  let fixture: ComponentFixture<CardServicesApproveExtendUnlockCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardServicesApproveExtendUnlockCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardServicesApproveExtendUnlockCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
