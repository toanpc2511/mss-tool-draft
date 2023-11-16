import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenarateInforComponent } from './genarate-infor.component';

describe('GenarateInforComponent', () => {
  let component: GenarateInforComponent;
  let fixture: ComponentFixture<GenarateInforComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenarateInforComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenarateInforComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
