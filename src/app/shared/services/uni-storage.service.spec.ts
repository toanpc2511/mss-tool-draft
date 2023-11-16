import { TestBed } from '@angular/core/testing';

import { UniStorageService } from './uni-storage.service';

describe('UniStorageService', () => {
  let service: UniStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UniStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
