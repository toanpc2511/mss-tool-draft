import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PumpPoleModalComponent } from './pump-pole-modal.component';

describe('PumpPoleModalComponent', () => {
  let component: PumpPoleModalComponent;
  let fixture: ComponentFixture<PumpPoleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PumpPoleModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PumpPoleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
