import React from 'react';
import { render } from '@testing-library/react';
import Loader from './Loader.component';
import TestProvider from '../../../utils/providers/TestProvider';

describe('<Loader />', () => {
  it('Renders successfully without error', () => {
    const { container } = render(
      <TestProvider>
        <Loader />
      </TestProvider>,
    );
    expect(container).toBeTruthy();
  });

  it('Renders with loader class', () => {
    const { container } = render(
      <TestProvider>
        <Loader />
      </TestProvider>,
    );
    expect(container.querySelector('.loader')).toBeInTheDocument();
  });

  it('Renders with default size', () => {
    const { container } = render(
      <TestProvider>
        <Loader />
      </TestProvider>,
    );
    const loader = container.querySelector('.loader');
    expect(loader).toHaveStyle('height: 48px');
    expect(loader).toHaveStyle('width: 48px');
  });

  it('Renders with custom size', () => {
    const { container } = render(
      <TestProvider>
        <Loader size="24px" />
      </TestProvider>,
    );
    const loader = container.querySelector('.loader');
    expect(loader).toHaveStyle('height: 24px');
    expect(loader).toHaveStyle('width: 24px');
  });

  it('Renders with custom width and color', () => {
    const { container } = render(
      <TestProvider>
        <Loader width="3px" color="#000" />
      </TestProvider>,
    );
    const loader = container.querySelector('.loader');
    expect(loader).toHaveStyle('border: 3px solid #000');
  });

  it('Renders with transparent borderBottomColor', () => {
    const { container } = render(
      <TestProvider>
        <Loader />
      </TestProvider>,
    );
    const loader = container.querySelector('.loader');
    expect(loader).toHaveStyle('border-bottom-color: transparent');
  });
});
