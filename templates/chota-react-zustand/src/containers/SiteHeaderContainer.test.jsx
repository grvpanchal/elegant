import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import useStore from '../state';
import SiteHeaderContainer from './SiteHeaderContainer';

vi.mock('../state', () => ({ default: vi.fn(), createAppStore: vi.fn() }));

const setup = (theme = 'light') => {
  const updateConfig = vi.fn();
  const state = {
    config: { name: 'Todo App', lang: 'en', theme, themeMode: theme },
    updateConfig,
  };
  useStore.mockImplementation((selector) => selector(state));
  return { updateConfig };
};

describe('<SiteHeaderContainer />', () => {
  it('Renders successfully', () => {
    setup();
    const { container } = render(<SiteHeaderContainer />);
    expect(container).toBeTruthy();
  });

  it('Displays the brand name from config', () => {
    setup();
    render(<SiteHeaderContainer />);
    expect(screen.getByText('Todo App')).toBeInTheDocument();
  });

  it('Displays moon icon for light theme', () => {
    setup('light');
    render(<SiteHeaderContainer />);
    expect(screen.getByRole('button', { name: /🌙/ })).toBeInTheDocument();
  });

  it('Displays sun icon for dark theme', () => {
    setup('dark');
    render(<SiteHeaderContainer />);
    expect(screen.getByRole('button', { name: /☀️/ })).toBeInTheDocument();
  });

  it('Calls updateConfig with dark when theme is light', () => {
    const { updateConfig } = setup('light');
    render(<SiteHeaderContainer />);
    fireEvent.click(screen.getByRole('button', { name: /🌙/ }));
    expect(updateConfig).toHaveBeenCalledWith({ theme: 'dark' });
  });

  it('Calls updateConfig with light when theme is dark', () => {
    const { updateConfig } = setup('dark');
    render(<SiteHeaderContainer />);
    fireEvent.click(screen.getByRole('button', { name: /☀️/ }));
    expect(updateConfig).toHaveBeenCalledWith({ theme: 'light' });
  });
});
