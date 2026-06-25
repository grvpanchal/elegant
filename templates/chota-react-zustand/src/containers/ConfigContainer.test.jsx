import React from 'react';
import { render } from '@testing-library/react';
import useStore from '../state';
import ConfigContainer from './ConfigContainer';

vi.mock('../state', () => ({ default: vi.fn(), createAppStore: vi.fn() }));

const mkState = (theme = 'light') => ({
  config: { name: 'Todo App', lang: 'en', theme, themeMode: theme },
});

describe('<ConfigContainer />', () => {
  beforeEach(() => {
    document.body.classList.remove('dark');
  });

  it('Renders successfully and returns null', () => {
    useStore.mockImplementation((selector) => selector(mkState('light')));
    const { container } = render(<ConfigContainer />);
    expect(container.innerHTML).toBe('');
  });

  it('Removes dark class when theme is light', () => {
    useStore.mockImplementation((selector) => selector(mkState('light')));
    render(<ConfigContainer />);
    expect(document.body.classList.contains('dark')).toBe(false);
  });

  it('Adds dark class when theme is dark', () => {
    useStore.mockImplementation((selector) => selector(mkState('dark')));
    render(<ConfigContainer />);
    expect(document.body.classList.contains('dark')).toBe(true);
  });
});
