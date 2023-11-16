import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupSystemAddFunctionComponent } from './popup-system-add-function.component';

describe('PopupSystemAddFunctionComponent', () => {
  let component: PopupSystemAddFunctionComponent;
  let fixture: ComponentFixture<PopupSystemAddFunctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupSystemAddFunctionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupSystemAddFunctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
