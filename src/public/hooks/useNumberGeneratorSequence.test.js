import { useOkapiKy } from '@folio/stripes/core';
import { render } from '@folio/jest-config-stripes/testing-library/react';
import { useQuery } from 'react-query';

import useNumberGeneratorSequence from './useNumberGeneratorSequence';
/* EXAMPLE -- testing a hook (Using react-query) */

const mockUseQuery = jest.fn();

const mockGet = jest.fn();

const TestComponent = () => {
  useNumberGeneratorSequence({ id: 'test-id' });
  return null;
};

const resetMocks = () => {
  mockUseQuery.mockReset();
  mockGet.mockReset();
  // EXAMPLE mock return value undefined, sometimes it needs to be mocked in beforeEach
  // Ensure we can call .json() on return
  mockGet.mockReturnValue({ json: jest.fn() });
};

describe('useNumberGeneratorSequences', () => {
  beforeEach(() => {
    resetMocks();
    useQuery.mockImplementation(mockUseQuery);
    useOkapiKy.mockImplementation(() => ({ get: mockGet }));

    render(
      <TestComponent />
    );
  });

  // EXAMPLE parsing out particular called arguments in a mock
  test('useNumberGeneratorSequences has right param map', () => {
    // Test namespace part of query call
    const mockNamespaceCall = mockUseQuery.mock.calls[0][0];
    // All namespace arguments are present
    expect(mockNamespaceCall.length).toBe(3);
    expect(mockNamespaceCall).toStrictEqual(['servint/numberGeneratorSequences/test-id', 'ui-service-interaction', 'test-id']);

    // Test function part of query call
    const mockFunctionCall = mockUseQuery.mock.calls[0][1];
    expect(mockFunctionCall).toStrictEqual(expect.any(Function));
    mockFunctionCall();
    expect(mockGet).toHaveBeenCalledWith('servint/numberGeneratorSequences/test-id');
  });
});
