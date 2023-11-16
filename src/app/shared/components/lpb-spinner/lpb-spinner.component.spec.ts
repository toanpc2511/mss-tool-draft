import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LpbSpinnerComponent } from './lpb-spinner.component';

describe('LpbSpinnerComponent', () => {
  let component: LpbSpinnerComponent;
  let fixture: ComponentFixture<LpbSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LpbSpinnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LpbSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
