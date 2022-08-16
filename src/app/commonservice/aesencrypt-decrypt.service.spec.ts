import { TestBed, inject } from '@angular/core/testing';

import { AESEncryptDecryptService } from './aesencrypt-decrypt.service';

describe('AESEncryptDecryptService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AESEncryptDecryptService]
    });
  });

  it('should be created', inject([AESEncryptDecryptService], (service: AESEncryptDecryptService) => {
    expect(service).toBeTruthy();
  }));
});
