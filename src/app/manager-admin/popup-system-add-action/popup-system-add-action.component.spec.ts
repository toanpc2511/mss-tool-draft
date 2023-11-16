import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupSystemAddActionComponent } from './popup-system-add-action.component';

describe('PopupSystemAddActionComponent', () => {
  let component: PopupSystemAddActionComponent;
  let fixture: ComponentFixture<PopupSystemAddActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupSystemAddActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupSystemAddActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
