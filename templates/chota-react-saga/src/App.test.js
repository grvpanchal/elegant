import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

describe('<App />', () => {
  it('Renders successfully without error', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it('Renders the main content', () => {
    render(<App />);
    expect(document.querySelector('.container')).toBeInTheDocument();
  });
});
