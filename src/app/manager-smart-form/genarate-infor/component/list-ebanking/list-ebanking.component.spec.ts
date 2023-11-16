import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEbankingComponent } from './list-ebanking.component';

describe('ListEbankingComponent', () => {
  let component: ListEbankingComponent;
  let fixture: ComponentFixture<ListEbankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEbankingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEbankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
