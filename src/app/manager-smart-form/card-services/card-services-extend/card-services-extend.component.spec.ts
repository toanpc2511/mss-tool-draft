import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardServicesExtendComponent } from './card-services-extend.component';

describe('CardServicesExtendComponent', () => {
  let component: CardServicesExtendComponent;
  let fixture: ComponentFixture<CardServicesExtendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardServicesExtendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardServicesExtendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
