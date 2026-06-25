import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Alert from './Alert.component';
import TestProvider from '../../../utils/providers/TestProvider';

describe('<Alert />', () => {
  it('Renders successfully without error', () => {
    const { container } = render(
      <TestProvider>
        <Alert
          show={true}
          variant="error"
          message="Sample Error Alert"
        />
      </TestProvider>,
    );
    expect(container).toBeTruthy();
  });

  it('Renders with Info variant without error', () => {
    const { container } = render(
      <TestProvider>
        <Alert
          show={true}
          message="Sample Info Alert"
        />
      </TestProvider>,
    );
    expect(container).toBeTruthy();
  });

  it('Renders Empty when show is false', () => {
    const { container } = render(
      <TestProvider>
        <Alert
          show={false}
          onCloseClick={undefined}
          variant="error"
          message="Sample Error Alert"
        />
      </TestProvider>,
    );
    expect(container).toBeTruthy();
  });

  it('Renders Empty on Close Click', async () => {
    const { container } = render(
      <TestProvider>
        <Alert
          show={true}
          onCloseClick={vi.fn}
          variant="error"
          message="Sample Error Alert"
        />
      </TestProvider>,
    );

    const alertClose = await screen.findByTestId('onAlertCloseClick');

    fireEvent.click(alertClose);

    await waitFor(() => expect(container).toBeEmptyDOMElement());
  });

  it('Displays the alert message', () => {
    render(
      <TestProvider>
        <Alert
          show={true}
          variant="error"
          message="Test message"
        />
      </TestProvider>,
    );
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('Closes without error when onCloseClick is not provided', async () => {
    const { container } = render(
      <TestProvider>
        <Alert
          show={true}
          variant="error"
          message="Sample Error Alert"
        />
      </TestProvider>,
    );
    
    const alertClose = await screen.findByTestId('onAlertCloseClick');
    
    fireEvent.click(alertClose);
    
    await waitFor(() => expect(container).toBeEmptyDOMElement());
  });
});
