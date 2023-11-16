import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LpbBaseServiceComponentComponent } from './lpb-base-service-component.component';

describe('LpbBaseServiceComponentComponent', () => {
  let component: LpbBaseServiceComponentComponent;
  let fixture: ComponentFixture<LpbBaseServiceComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LpbBaseServiceComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LpbBaseServiceComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
