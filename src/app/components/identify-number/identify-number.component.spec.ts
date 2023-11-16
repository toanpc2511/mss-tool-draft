import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentifyNumberComponent } from './identify-number.component';

describe('IdentifyNumberComponent', () => {
  let component: IdentifyNumberComponent;
  let fixture: ComponentFixture<IdentifyNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdentifyNumberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentifyNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
