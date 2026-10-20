import React from 'react';
import { render, screen } from '@testing-library/react';
import IconButton from './IconButton.component';
import TestProvider from '../../../utils/providers/TestProvider';

// The icon is an inlined SVG (src/utils/icons.js); read what it draws.
const svgOf = (img) => decodeURIComponent(img.getAttribute('src').replace('data:image/svg+xml,', ''));

describe('<IconButton />', () => {
  it('Renders successfully without error', () => {
    const { container } = render(
      <TestProvider>
        <IconButton iconName="edit" alt="edit" size="16" />
      </TestProvider>,
    );
    expect(container).toBeTruthy();
  });

  it('Renders the named icon at its size', () => {
    render(
      <TestProvider>
        <IconButton iconName="trash-2" alt="delete" size="24" />
      </TestProvider>,
    );
    const img = screen.getByAltText('delete');
    expect(svgOf(img)).toContain('points="3 6 5 6 21 6"');
    expect(svgOf(img)).toContain('width="24"');
  });

  it('Renders with custom color', () => {
    render(
      <TestProvider preloadedState={{ config: { theme: 'light', name: 'Test', lang: 'en' } }}>
        <IconButton iconName="edit" alt="edit" size="16" color="ff0000" />
      </TestProvider>,
    );
    const img = screen.getByAltText('edit');
    expect(svgOf(img)).toContain('stroke="#ff0000"');
  });

  it('Uses theme color when no color is provided and theme is dark', () => {
    render(
      <TestProvider preloadedState={{ config: { theme: 'dark', name: 'Test', lang: 'en' } }}>
        <IconButton iconName="edit" alt="edit" size="16" />
      </TestProvider>,
    );
    const img = screen.getByAltText('edit');
    expect(svgOf(img)).toContain('stroke="#ffffff"');
  });

  it('Draws black when no color is provided and theme is light', () => {
    render(
      <TestProvider preloadedState={{ config: { theme: 'light', name: 'Test', lang: 'en' } }}>
        <IconButton iconName="edit" alt="edit" size="16" />
      </TestProvider>,
    );
    const img = screen.getByAltText('edit');
    expect(svgOf(img)).toContain('stroke="#000000"');
  });

  it('Renders with variant class', () => {
    const { container } = render(
      <TestProvider>
        <IconButton iconName="x" alt="close" size="16" variant="clear" />
      </TestProvider>,
    );
    const button = container.querySelector('button');
    expect(button).toHaveClass('icon-only');
    expect(button).toHaveClass('clear');
  });

  it('Passes data-testid and data-value props', () => {
    render(
      <TestProvider>
        <IconButton iconName="edit" alt="edit" size="16" data-testid="custom-id" data-value="test" />
      </TestProvider>,
    );
    expect(screen.getByTestId('custom-id')).toHaveAttribute('data-value', 'test');
  });

  it('Calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(
      <TestProvider>
        <IconButton iconName="edit" alt="edit" size="16" onClick={onClick} />
      </TestProvider>,
    );
    const button = screen.getByRole('button');
    button.click();
    expect(onClick).toHaveBeenCalled();
  });
});
