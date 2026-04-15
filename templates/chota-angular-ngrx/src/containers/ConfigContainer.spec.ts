import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { getTheme } from '../app/state/config/config.selectors';
import ConfigContainerComponent from './ConfigContainer';
import { AppState } from '../app/state';

describe('ConfigContainerComponent', () => {
  let component: ConfigContainerComponent;
  let fixture: ComponentFixture<ConfigContainerComponent>;
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
    document.body.classList.remove('dark');

    await TestBed.configureTestingModule({
      imports: [ConfigContainerComponent],
      providers: [provideMockStore({ initialState: initialMockState })],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigContainerComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
  });

  afterEach(() => {
    document.body.classList.remove('dark');
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not add dark class when theme is light', () => {
    store.overrideSelector(getTheme, 'light');
    store.refreshState();
    fixture.detectChanges();
    expect(document.body.classList.contains('dark')).toBe(false);
  });

  it('should add dark class when theme is dark', () => {
    store.overrideSelector(getTheme, 'dark');
    store.refreshState();
    fixture.detectChanges();
    expect(document.body.classList.contains('dark')).toBe(true);
  });

  it('should remove dark class when theme changes from dark to light', () => {
    store.overrideSelector(getTheme, 'dark');
    store.refreshState();
    fixture.detectChanges();
    expect(document.body.classList.contains('dark')).toBe(true);

    store.overrideSelector(getTheme, 'light');
    store.refreshState();
    fixture.detectChanges();
    expect(document.body.classList.contains('dark')).toBe(false);
  });

  it('should unsubscribe on destroy', () => {
    fixture.detectChanges();
    spyOn(component['sub'], 'unsubscribe').and.callThrough();
    fixture.destroy();
    expect(component['sub'].unsubscribe).toHaveBeenCalled();
  });
});
