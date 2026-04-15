import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SiteHeader from './SiteHeader.component';
import TestProvider from '../../../utils/providers/TestProvider';

describe('<SiteHeader />', () => {
  const headerData = {
    brandName: 'My Todo App',
    theme: 'light',
  };

  const events = {
    onThemeChangeClick: jest.fn(),
  };

  it('Renders successfully without error', () => {
    const { container } = render(
      <TestProvider>
        <SiteHeader headerData={headerData} events={events} />
      </TestProvider>,
    );
    expect(container).toBeTruthy();
  });

  it('Displays the brand name', () => {
    render(
      <TestProvider>
        <SiteHeader headerData={headerData} events={events} />
      </TestProvider>,
    );
    expect(screen.getByText('My Todo App')).toBeInTheDocument();
  });

  it('Calls onThemeChangeClick when theme toggle is clicked', () => {
    render(
      <TestProvider>
        <SiteHeader headerData={headerData} events={events} />
      </TestProvider>,
    );
    const themeToggle = screen.getByRole('button', { name: /🌙/ });
    fireEvent.click(themeToggle);
    expect(events.onThemeChangeClick).toHaveBeenCalled();
  });

  it('Displays moon icon for light theme', () => {
    render(
      <TestProvider>
        <SiteHeader headerData={headerData} events={events} />
      </TestProvider>,
    );
    expect(screen.getByText('🌙')).toBeInTheDocument();
  });

  it('Displays sun icon for dark theme', () => {
    const darkHeaderData = { ...headerData, theme: 'dark' };
    render(
      <TestProvider>
        <SiteHeader headerData={darkHeaderData} events={events} />
      </TestProvider>,
    );
    expect(screen.getByText('☀️')).toBeInTheDocument();
  });

  it('Renders with header class', () => {
    const { container } = render(
      <TestProvider>
        <SiteHeader headerData={headerData} events={events} />
      </TestProvider>,
    );
    expect(container.querySelector('.header')).toBeInTheDocument();
  });
});
