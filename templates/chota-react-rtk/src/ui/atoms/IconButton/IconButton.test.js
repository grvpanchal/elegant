import React from 'react';
import { render, screen } from '@testing-library/react';
import IconButton from './IconButton.component';
import TestProvider from '../../../utils/providers/TestProvider';

describe('<IconButton />', () => {
  it('Renders successfully without error', () => {
    const { container } = render(
      <TestProvider>
        <IconButton iconName="edit" alt="edit" size="16" />
      </TestProvider>,
    );
    expect(container).toBeTruthy();
  });

  it('Renders with correct icon URL', () => {
    render(
      <TestProvider>
        <IconButton iconName="trash-2" alt="delete" size="24" />
      </TestProvider>,
    );
    const img = screen.getByAltText('delete');
    expect(img).toHaveAttribute('src', expect.stringContaining('trash-2'));
    expect(img).toHaveAttribute('src', expect.stringContaining('size=24'));
  });

  it('Renders with custom color', () => {
    render(
      <TestProvider preloadedState={{ config: { theme: 'light', name: 'Test', lang: 'en' } }}>
        <IconButton iconName="edit" alt="edit" size="16" color="ff0000" />
      </TestProvider>,
    );
    const img = screen.getByAltText('edit');
    expect(img).toHaveAttribute('src', expect.stringContaining('color=ff0000'));
  });

  it('Uses theme color when no color is provided and theme is dark', () => {
    render(
      <TestProvider preloadedState={{ config: { theme: 'dark', name: 'Test', lang: 'en' } }}>
        <IconButton iconName="edit" alt="edit" size="16" />
      </TestProvider>,
    );
    const img = screen.getByAltText('edit');
    expect(img).toHaveAttribute('src', expect.stringContaining('color=ffffff'));
  });

  it('Uses empty theme color when no color is provided and theme is light', () => {
    render(
      <TestProvider preloadedState={{ config: { theme: 'light', name: 'Test', lang: 'en' } }}>
        <IconButton iconName="edit" alt="edit" size="16" />
      </TestProvider>,
    );
    const img = screen.getByAltText('edit');
    expect(img).toHaveAttribute('src', expect.stringContaining('color='));
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
    const onClick = jest.fn();
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
