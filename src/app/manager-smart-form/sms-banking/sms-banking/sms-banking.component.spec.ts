import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsBankingComponent } from './sms-banking.component';

describe('SmsBankingComponent', () => {
  let component: SmsBankingComponent;
  let fixture: ComponentFixture<SmsBankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmsBankingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsBankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
