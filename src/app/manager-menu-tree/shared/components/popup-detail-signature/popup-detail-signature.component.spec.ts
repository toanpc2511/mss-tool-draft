import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupDetailSignatureComponent } from './popup-detail-signature.component';

describe('PopupDetailSignatureComponent', () => {
  let component: PopupDetailSignatureComponent;
  let fixture: ComponentFixture<PopupDetailSignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupDetailSignatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupDetailSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
