import { TestBed, inject } from '@angular/core/testing';

import { GraphCreatorService } from './graph-creator.service';

describe('GraphCreatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GraphCreatorService]
    });
  });

  it('should be created', inject([GraphCreatorService], (service: GraphCreatorService) => {
    expect(service).toBeTruthy();
  }));
});
