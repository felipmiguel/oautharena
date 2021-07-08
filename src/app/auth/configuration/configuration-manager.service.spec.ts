import { TestBed } from '@angular/core/testing';

import { ConfigurationManagerService } from './configuration-manager.service';

describe('ConfigurationManagerService', () => {
  let service: ConfigurationManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigurationManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
