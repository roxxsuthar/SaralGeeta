import React, { useContext } from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import AppStateContext from '../AppStateContext';

// Component to consume AppStateContext
function TestComponent() {
  const value = useContext(AppStateContext);
  return <Text>{value ? 'Context Provided' : 'No Context'}</Text>;
}

describe('AppStateContext', () => {
  it('provides undefined by default', () => {
    const { getByText } = render(<TestComponent />);
    expect(getByText('No Context')).toBeTruthy();
  });

  it('provides value when wrapped in Provider', () => {
    const testValue = { user: 'demo' };
    const { getByText } = render(
      <AppStateContext.Provider value={testValue}>
        <TestComponent />
      </AppStateContext.Provider>,
    );
    expect(getByText('Context Provided')).toBeTruthy();
  });
});
