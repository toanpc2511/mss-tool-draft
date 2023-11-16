import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceCifComponent } from './reference-cif.component';

describe('ReferenceCifComponent', () => {
  let component: ReferenceCifComponent;
  let fixture: ComponentFixture<ReferenceCifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferenceCifComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceCifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
