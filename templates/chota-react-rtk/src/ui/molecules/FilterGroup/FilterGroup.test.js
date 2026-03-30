import React from 'react';
import { render } from '@testing-library/react';
import FilterGroup from './FilterGroup.component';
import TestProvider from '../../../utils/providers/TestProvider';

describe('<FilterGroup />', () => {
  it('Renders successfully without error', () => {
    const { container } = render(
      <TestProvider>
        <FilterGroup filterItem={[]} />
      </TestProvider>,
    );
    expect(container).toBeTruthy();
  });
});