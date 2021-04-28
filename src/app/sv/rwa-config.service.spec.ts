import { TestBed } from '@angular/core/testing';

import { RwaConfigService } from './rwa-config.service';

describe('RwaConfigService', () => {
  let service: RwaConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RwaConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
