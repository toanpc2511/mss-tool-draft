import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LpbFooterComponent } from './lpb-footer.component';

describe('LpbFooterComponent', () => {
  let component: LpbFooterComponent;
  let fixture: ComponentFixture<LpbFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LpbFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LpbFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
