import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LpbHomeServiceComponent } from './lpb-home-service.component';

describe('LpbHomeServiceComponent', () => {
  let component: LpbHomeServiceComponent;
  let fixture: ComponentFixture<LpbHomeServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LpbHomeServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LpbHomeServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
