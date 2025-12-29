import React from 'react';
import { render } from '@testing-library/react-native';
import withAppState from '../withAppState';

// Mock react-native components
jest.mock('react-native', () => ({
  AppState: {
    currentState: 'active',
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
}));

// Test component
const TestComponent = (props) => (
  <div data-testid="test-component" {...props} />
);

describe('withAppState', () => {
  const mockAppState = jest.requireMock('react-native').AppState;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAppState.currentState = 'active';
  });

  it('wraps component with app state', () => {
    const WrappedComponent = withAppState(TestComponent);
    const { toJSON } = render(<WrappedComponent />);
    expect(toJSON()).toBeTruthy();
  });

  it('sets up app state change listener', () => {
    const WrappedComponent = withAppState(TestComponent);
    render(<WrappedComponent />);
    expect(mockAppState.addEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );
  });

  it('cleans up event listener on unmount', () => {
    const WrappedComponent = withAppState(TestComponent);
    const { unmount } = render(<WrappedComponent />);
    unmount();
    expect(mockAppState.removeEventListener).toHaveBeenCalled();
  });

  it('sets correct display name', () => {
    const WrappedComponent = withAppState(TestComponent);
    expect(WrappedComponent.displayName).toBe('withAppState(TestComponent)');
  });

  it('handles component without display name', () => {
    const AnonymousComponent = () => <div />;
    const WrappedComponent = withAppState(AnonymousComponent);
    expect(WrappedComponent.displayName).toBe(
      'withAppState(AnonymousComponent)',
    );
  });

  it('handles component without name', () => {
    const NoNameComponent = () => <div />;
    NoNameComponent.name = '';
    const WrappedComponent = withAppState(NoNameComponent);
    expect(WrappedComponent.displayName).toBe('withAppState(NoNameComponent)');
  });

  it('maintains component props', () => {
    const WrappedComponent = withAppState(TestComponent);
    const { toJSON } = render(<WrappedComponent testProp="value" />);
    expect(toJSON()).toBeTruthy();
  });

  it('handles multiple wrapped components', () => {
    const WrappedComponent1 = withAppState(TestComponent);
    const WrappedComponent2 = withAppState(TestComponent);
    const { toJSON: json1 } = render(<WrappedComponent1 />);
    const { toJSON: json2 } = render(<WrappedComponent2 />);
    expect(json1()).toBeTruthy();
    expect(json2()).toBeTruthy();
  });

  it('handles nested HOCs', () => {
    const WrappedComponent = withAppState(withAppState(TestComponent));
    const { toJSON } = render(<WrappedComponent />);
    expect(toJSON()).toBeTruthy();
  });

  it('handles background app state', () => {
    mockAppState.currentState = 'background';
    const WrappedComponent = withAppState(TestComponent);
    const { toJSON } = render(<WrappedComponent />);
    expect(toJSON()).toBeTruthy();
  });

  it('handles inactive app state', () => {
    mockAppState.currentState = 'inactive';
    const WrappedComponent = withAppState(TestComponent);
    const { toJSON } = render(<WrappedComponent />);
    expect(toJSON()).toBeTruthy();
  });

  it('handles unknown app state', () => {
    mockAppState.currentState = 'unknown';
    const WrappedComponent = withAppState(TestComponent);
    const { toJSON } = render(<WrappedComponent />);
    expect(toJSON()).toBeTruthy();
  });
});
