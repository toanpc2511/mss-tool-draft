import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossCheckingReportComponent } from './cross-checking-report.component';

describe('CrosscheckingReportComponent', () => {
  let component: CrossCheckingReportComponent;
  let fixture: ComponentFixture<CrossCheckingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrossCheckingReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrossCheckingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
