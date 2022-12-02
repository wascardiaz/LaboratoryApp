import { TestBed } from '@angular/core/testing';

import { GlobalErrorModalService } from './global-error-modal.service';

describe('GlobalErrorModalService', () => {
  let service: GlobalErrorModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalErrorModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
