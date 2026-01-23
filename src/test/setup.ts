import { beforeEach } from 'vitest';

// Mock localStorage
const localStorageMock = {
  getItem: (_key: string) => null,
  setItem: (_key: string, _value: string) => {},
  removeItem: (_key: string) => {},
  clear: () => {},
};

global.localStorage = localStorageMock as Storage;

// Reset mocks before each test
beforeEach(() => {
  localStorage.clear();
});
