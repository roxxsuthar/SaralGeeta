jest.mock('react-native-network-logger', () => ({
  startNetworkLogging: jest.fn(),
}));
jest.mock('../App', () => 'App');

describe('debug network logger', () => {
  const originalDev = global.__DEV__;

  afterEach(() => {
    jest.resetModules();
    global.__DEV__ = originalDev;
  });

  test('starts network logging in development', () => {
    global.__DEV__ = true;

    require('../index');

    const { startNetworkLogging } = require('react-native-network-logger');
    expect(startNetworkLogging).toHaveBeenCalledWith({ maxRequests: 500 });
  });

  test('does not start network logging outside development', () => {
    global.__DEV__ = false;

    require('../index');

    const { startNetworkLogging } = require('react-native-network-logger');
    expect(startNetworkLogging).not.toHaveBeenCalled();
  });
});
