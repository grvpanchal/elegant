import React from 'react';
import { render, screen } from '@testing-library/react';
import Image from './Image.component';
import TestProvider from '../../../utils/providers/TestProvider';

describe('<Image />', () => {
  it('Renders successfully without error', () => {
    const { container } = render(
      <TestProvider>
        <Image />
      </TestProvider>,
    );
    expect(container).toBeTruthy();
  });

  it('Renders an img element', () => {
    render(
      <TestProvider>
        <Image />
      </TestProvider>,
    );
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('Renders with alt text', () => {
    render(
      <TestProvider>
        <Image alt="Test image" src="test.jpg" />
      </TestProvider>,
    );
    const img = screen.getByAltText('Test image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'test.jpg');
  });

  it('Passes through additional props', () => {
    render(
      <TestProvider>
        <Image alt="Test" src="test.jpg" data-testid="test-image" />
      </TestProvider>,
    );
    expect(screen.getByTestId('test-image')).toBeInTheDocument();
  });
});
