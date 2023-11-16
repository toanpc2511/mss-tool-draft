import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LpbCustomSingleAddressComponent } from './lpb-custom-single-address.component';

describe('LpbCustomSingleAddressComponent', () => {
  let component: LpbCustomSingleAddressComponent;
  let fixture: ComponentFixture<LpbCustomSingleAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LpbCustomSingleAddressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LpbCustomSingleAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
