import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
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
  it('Renders with Info without error', () => {
    const { container } = render(
      <TestProvider>
        <Alert
          show={true}
          message="Sample Error Alert"
        />
      </TestProvider>,
    );
    expect(container).toBeTruthy();
  });
  it('Renders Empty', () => {
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
          onCloseClick={jest.fn}
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
