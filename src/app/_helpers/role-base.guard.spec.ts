import { TestBed } from '@angular/core/testing';

import { RoleBaseGuard } from './role-base.guard';

describe('RoleBaseGuard', () => {
  let guard: RoleBaseGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RoleBaseGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
