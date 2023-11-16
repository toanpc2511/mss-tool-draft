import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitCreateComponent } from './limit-create.component';

describe('LimitCreateComponent', () => {
  let component: LimitCreateComponent;
  let fixture: ComponentFixture<LimitCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LimitCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
