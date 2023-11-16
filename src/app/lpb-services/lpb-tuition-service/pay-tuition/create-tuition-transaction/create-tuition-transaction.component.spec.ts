import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTuitionTransactionComponent } from './create-tuition-transaction.component';

describe('CreateTuitionTransactionComponent', () => {
  let component: CreateTuitionTransactionComponent;
  let fixture: ComponentFixture<CreateTuitionTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTuitionTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTuitionTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
