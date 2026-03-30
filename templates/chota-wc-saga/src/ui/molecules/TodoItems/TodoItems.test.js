import { render } from '@testing-library/react';
import TodoItems from './TodoItems.component';
import TestProvider from '../../../utils/providers/TestProvider';

describe('<TodoItems />', () => {
  it('Renders successfully without error', () => {
    const { container } = render(
      <TestProvider>
        <TodoItems />
      </TestProvider>,
    );
    expect(container).toBeTruthy();
  });
});