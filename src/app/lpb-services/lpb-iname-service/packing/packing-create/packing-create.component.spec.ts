import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingCreateComponent } from './packing-create.component';

describe('PackingCreateComponent', () => {
  let component: PackingCreateComponent;
  let fixture: ComponentFixture<PackingCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackingCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackingCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
