import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAccountSavingComponent } from './list-account-saving.component';

describe('ListAccountSavingComponent', () => {
  let component: ListAccountSavingComponent;
  let fixture: ComponentFixture<ListAccountSavingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAccountSavingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAccountSavingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
