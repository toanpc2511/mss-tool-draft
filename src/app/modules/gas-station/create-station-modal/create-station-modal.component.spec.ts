import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStationModalComponent } from './create-station-modal.component';

describe('CreateStationModalComponent', () => {
  let component: CreateStationModalComponent;
  let fixture: ComponentFixture<CreateStationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateStationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
