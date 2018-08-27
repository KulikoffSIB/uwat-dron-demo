import { TestBed, inject } from '@angular/core/testing';

import { ImgurServiceService } from './imgur-service.service';

describe('ImgurServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImgurServiceService]
    });
  });

  it('should be created', inject([ImgurServiceService], (service: ImgurServiceService) => {
    expect(service).toBeTruthy();
  }));
});
