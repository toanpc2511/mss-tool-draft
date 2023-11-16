import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LpbDatatableComponent } from './lpb-datatable.component';

describe('LpbDatatableComponent', () => {
  let component: LpbDatatableComponent;
  let fixture: ComponentFixture<LpbDatatableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LpbDatatableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LpbDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
