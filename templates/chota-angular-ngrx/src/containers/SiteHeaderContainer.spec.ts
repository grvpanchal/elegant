import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';
import SiteHeaderContainerComponent from './SiteHeaderContainer';
import { updateConfig } from '../app/state/config/config.actions';
import { AppState } from '../app/state';

describe('SiteHeaderContainerComponent', () => {
  let component: SiteHeaderContainerComponent;
  let fixture: ComponentFixture<SiteHeaderContainerComponent>;
  let store: MockStore<AppState>;

  const initialMockState: AppState = {
    todo: {
      isLoading: false,
      isActionLoading: false,
      isContentLoading: false,
      error: '',
      todoItems: [],
      currentTodoItem: { id: null, text: '' },
    },
    filters: [],
    config: { name: 'Todo App', theme: 'light' },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteHeaderContainerComponent],
      providers: [provideMockStore({ initialState: initialMockState })],
    }).compileComponents();

    fixture = TestBed.createComponent(SiteHeaderContainerComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should select config state and map to headerData', (done) => {
    fixture.detectChanges();
    component.headerData$.subscribe((data) => {
      expect(data.brandName).toBe('Todo App');
      expect(data.theme).toBe('light');
      done();
    });
  });

  it('should render SiteHeaderComponent when data is available', () => {
    fixture.detectChanges();
    const siteHeader = fixture.debugElement.query(By.css('app-site-header'));
    expect(siteHeader).toBeTruthy();
  });

  it('should pass headerData to SiteHeaderComponent', () => {
    fixture.detectChanges();
    const siteHeader = fixture.debugElement.query(By.css('app-site-header'));
    expect(siteHeader.componentInstance.headerData).toEqual({
      brandName: 'Todo App',
      theme: 'light',
    });
  });

  it('should dispatch updateConfig with dark theme when current is light', () => {
    fixture.detectChanges();
    spyOn(store, 'dispatch');
    component.events.onThemeChangeClick();
    expect(store.dispatch).toHaveBeenCalledWith(
      updateConfig({ payload: { theme: 'dark' } })
    );
  });
});

describe('SiteHeaderContainerComponent (dark theme)', () => {
  let component: SiteHeaderContainerComponent;
  let fixture: ComponentFixture<SiteHeaderContainerComponent>;
  let store: MockStore<AppState>;

  const darkThemeState: AppState = {
    todo: {
      isLoading: false,
      isActionLoading: false,
      isContentLoading: false,
      error: '',
      todoItems: [],
      currentTodoItem: { id: null, text: '' },
    },
    filters: [],
    config: { name: 'Todo App', theme: 'dark' },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteHeaderContainerComponent],
      providers: [provideMockStore({ initialState: darkThemeState })],
    }).compileComponents();

    fixture = TestBed.createComponent(SiteHeaderContainerComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
  });

  it('should dispatch updateConfig with light theme when current is dark', () => {
    fixture.detectChanges();
    spyOn(store, 'dispatch');
    component.events.onThemeChangeClick();
    expect(store.dispatch).toHaveBeenCalledWith(
      updateConfig({ payload: { theme: 'light' } })
    );
  });
});
