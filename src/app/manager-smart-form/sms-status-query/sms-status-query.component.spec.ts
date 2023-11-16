import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsStatusQueryComponent } from './sms-status-query.component';

describe('SmsStatusQueryComponent', () => {
  let component: SmsStatusQueryComponent;
  let fixture: ComponentFixture<SmsStatusQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmsStatusQueryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsStatusQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
