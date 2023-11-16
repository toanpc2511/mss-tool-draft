import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsInforComponent } from './sms-infor.component';

describe('SmsInforComponent', () => {
  let component: SmsInforComponent;
  let fixture: ComponentFixture<SmsInforComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmsInforComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsInforComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
