import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerInforComponent } from './customer-infor.component';

describe('CustomerInforComponent', () => {
  let component: CustomerInforComponent;
  let fixture: ComponentFixture<CustomerInforComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerInforComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerInforComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
