import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LpbBranchSelectComponent } from './lpb-branch-select.component';

describe('LpbBranchSelectComponent', () => {
  let component: LpbBranchSelectComponent;
  let fixture: ComponentFixture<LpbBranchSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LpbBranchSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LpbBranchSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
