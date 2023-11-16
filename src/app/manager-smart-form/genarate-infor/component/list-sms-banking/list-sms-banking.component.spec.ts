import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSmsBankingComponent } from './list-sms-banking.component';

describe('ListSmsBankingComponent', () => {
  let component: ListSmsBankingComponent;
  let fixture: ComponentFixture<ListSmsBankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSmsBankingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSmsBankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
