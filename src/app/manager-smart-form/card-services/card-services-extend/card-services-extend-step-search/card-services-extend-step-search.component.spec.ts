import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardServicesExtendStepSearchComponent } from './card-services-extend-step-search.component';

describe('CardServicesExtendStepSearchComponent', () => {
  let component: CardServicesExtendStepSearchComponent;
  let fixture: ComponentFixture<CardServicesExtendStepSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardServicesExtendStepSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardServicesExtendStepSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
