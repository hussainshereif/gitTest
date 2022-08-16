import { TestBed, inject } from '@angular/core/testing';

import { RemoteApisService } from './remote-apis.service';

describe('RemoteApisService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RemoteApisService]
    });
  });

  it('should be created', inject([RemoteApisService], (service: RemoteApisService) => {
    expect(service).toBeTruthy();
  }));
});
