import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { AtomicService } from './AtomicService';
import { getTheme } from '../../state/config/config.selectors';

describe('AtomicService', () => {
  let service: AtomicService;
  let store: MockStore;

  describe('with Store provided', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          AtomicService,
          provideMockStore({
            selectors: [{ selector: getTheme, value: 'dark' }],
          }),
        ],
      });

      service = TestBed.inject(AtomicService);
      store = TestBed.inject(MockStore);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should select theme from store', (done) => {
      service.theme$.subscribe((theme) => {
        expect(theme).toBe('dark');
        done();
      });
    });
  });

  describe('without Store (Optional)', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          AtomicService,
          { provide: MockStore, useValue: null },
        ],
      });

      TestBed.overrideProvider(AtomicService, {
        useFactory: () => new AtomicService(null as any),
      });

      service = TestBed.inject(AtomicService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should default theme$ to "light" when store is null', (done) => {
      service.theme$.subscribe((theme) => {
        expect(theme).toBe('light');
        done();
      });
    });
  });
});
