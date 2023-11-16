import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LpbDatepickerNewComponent } from './lpb-datepicker-new.component';

describe('LpbDatepickerNewComponent', () => {
  let component: LpbDatepickerNewComponent;
  let fixture: ComponentFixture<LpbDatepickerNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LpbDatepickerNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LpbDatepickerNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
