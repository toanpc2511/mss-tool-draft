import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileNoColComponent } from './mobile-no-col.component';

describe('MobileNoColComponent', () => {
  let component: MobileNoColComponent;
  let fixture: ComponentFixture<MobileNoColComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileNoColComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileNoColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
