import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LpbUserSelectComponent } from './lpb-user-select.component';

describe('LpbUserSelectComponent', () => {
  let component: LpbUserSelectComponent;
  let fixture: ComponentFixture<LpbUserSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LpbUserSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LpbUserSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
