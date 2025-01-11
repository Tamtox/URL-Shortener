import { Test, TestingModule } from '@nestjs/testing';
import { UrlShortenerRepositoryService } from './url-shortener-repository.service';

describe('UrlShortenerRepositoryService', () => {
  let service: UrlShortenerRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlShortenerRepositoryService],
    }).compile();

    service = module.get<UrlShortenerRepositoryService>(UrlShortenerRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
