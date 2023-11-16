import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LpbSelect2Component } from './lpb-select2.component';

describe('LpbSelect2Component', () => {
  let component: LpbSelect2Component;
  let fixture: ComponentFixture<LpbSelect2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LpbSelect2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LpbSelect2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
