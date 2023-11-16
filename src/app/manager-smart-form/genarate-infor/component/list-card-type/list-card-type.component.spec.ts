import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCardTypeComponent } from './list-card-type.component';

describe('ListCardTypeComponent', () => {
  let component: ListCardTypeComponent;
  let fixture: ComponentFixture<ListCardTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCardTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCardTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
