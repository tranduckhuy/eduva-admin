import { TestBed } from '@angular/core/testing';

import { CreditPackService } from './credit-pack.service';

describe('CreditPackService', () => {
  let service: CreditPackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreditPackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
