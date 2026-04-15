import React from 'react';
import { render, screen } from '@testing-library/react';
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

  it('Renders with default size and width', () => {
    render(
      <TestProvider>
        <Loader />
      </TestProvider>,
    );
    const loader = document.querySelector('.loader');
    expect(loader).toHaveStyle('height: 48px');
    expect(loader).toHaveStyle('width: 48px');
    expect(loader).toHaveStyle('border: 5px solid #fff');
  });

  it('Renders with custom size', () => {
    render(
      <TestProvider>
        <Loader size="24px" />
      </TestProvider>,
    );
    const loader = document.querySelector('.loader');
    expect(loader).toHaveStyle('height: 24px');
    expect(loader).toHaveStyle('width: 24px');
  });

  it('Renders with custom width', () => {
    render(
      <TestProvider>
        <Loader width="3px" />
      </TestProvider>,
    );
    const loader = document.querySelector('.loader');
    expect(loader).toHaveStyle('border: 3px solid #fff');
  });

  it('Renders with custom color', () => {
    render(
      <TestProvider>
        <Loader color="#000" />
      </TestProvider>,
    );
    const loader = document.querySelector('.loader');
    expect(loader).toHaveStyle('border: 5px solid #000');
  });

  it('Renders with transparent bottom border', () => {
    render(
      <TestProvider>
        <Loader />
      </TestProvider>,
    );
    const loader = document.querySelector('.loader');
    expect(loader).toHaveStyle('border-bottom-color: transparent');
  });

  it('Renders with all custom props', () => {
    render(
      <TestProvider>
        <Loader size="1.2rem" width="2px" color="#fff" />
      </TestProvider>,
    );
    const loader = document.querySelector('.loader');
    expect(loader).toHaveStyle('height: 1.2rem');
    expect(loader).toHaveStyle('width: 1.2rem');
    expect(loader).toHaveStyle('border: 2px solid #fff');
  });
});
