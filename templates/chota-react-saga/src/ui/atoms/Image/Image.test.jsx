import React from 'react';
import { render } from '@testing-library/react';
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

  it('Renders with src prop', () => {
    render(
      <TestProvider>
        <Image src="test.jpg" />
      </TestProvider>,
    );
    const img = document.querySelector('img');
    expect(img).toBeTruthy();
  });

  it('Renders with alt prop', () => {
    render(
      <TestProvider>
        <Image alt="test image" />
      </TestProvider>,
    );
    const img = document.querySelector('img');
    expect(img).toBeTruthy();
  });
});
