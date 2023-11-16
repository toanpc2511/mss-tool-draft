import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPayTuitionComponent } from './edit-pay-tuition.component';

describe('EditPayTuitionComponent', () => {
  let component: EditPayTuitionComponent;
  let fixture: ComponentFixture<EditPayTuitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPayTuitionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPayTuitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
