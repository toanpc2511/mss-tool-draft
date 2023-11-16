import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovePayTuitionComponent } from './approve-pay-tuition.component';

describe('ApprovePayTuitionComponent', () => {
  let component: ApprovePayTuitionComponent;
  let fixture: ComponentFixture<ApprovePayTuitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovePayTuitionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovePayTuitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
