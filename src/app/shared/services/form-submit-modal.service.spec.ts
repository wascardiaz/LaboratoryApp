import { TestBed } from '@angular/core/testing';

import { FormSubmitModalService } from './form-submit-modal.service';

describe('FormSubmitModalService', () => {
  let service: FormSubmitModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormSubmitModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
