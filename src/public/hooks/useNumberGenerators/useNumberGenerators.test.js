import { useOkapiKy } from '@folio/stripes/core';
import { render } from '@testing-library/react';
import { useQuery } from 'react-query';

import useNumberGenerators from './useNumberGenerators';
/* EXAMPLE -- testing a hook (Using react-query) */

const mockUseQuery = jest.fn();

const mockGet = jest.fn();

const TestComponentWithCode = () => {
  useNumberGenerators('testing');
  return null;
};

const TestComponentWithoutCode = () => {
  useNumberGenerators();
  return null;
};

const resetMocks = () => {
  mockUseQuery.mockReset();
  mockGet.mockReset();
  // EXAMPLE mock return value undefined, sometimes it needs to be mocked in beforeEach
  // Ensure we can call .json() on return
  mockGet.mockReturnValue({ json: jest.fn() });
};

describe('useNumberGenerators', () => {
  describe('useNumberGenerators with code', () => {
    beforeEach(() => {
      resetMocks();
      useQuery.mockImplementation(mockUseQuery);
      useOkapiKy.mockImplementation(() => ({ get: mockGet }));

      render(
        <TestComponentWithCode />
      );
    });

    // EXAMPLE parsing out particular called arguments in a mock
    test('useNumberGenerators has right param map', () => {
      // Test namespace part of query call
      const mockNamespaceCall = mockUseQuery.mock.calls[0][0];
      // All namespace arguments are present
      expect(mockNamespaceCall.length).toBe(4);
      // query params are as expected
      expect(mockNamespaceCall[1]).toStrictEqual(expect.arrayContaining(['filters=code%3D%3Dtesting']));
      expect(mockNamespaceCall[1].length).toBe(4);

      // Test function part of query call
      const mockFunctionCall = mockUseQuery.mock.calls[0][1];
      expect(mockFunctionCall).toStrictEqual(expect.any(Function));
      mockFunctionCall();
      expect(mockGet).toHaveBeenCalledWith('servint/numberGenerators?filters=code%3D%3Dtesting&sort=enabled%3Basc&sort=name%3Basc&stats=true');
    });
  });

  describe('useNumberGenerators without code', () => {
    beforeEach(() => {
      resetMocks();
      useQuery.mockImplementation(mockUseQuery);
      useOkapiKy.mockImplementation(() => ({ get: mockGet }));

      render(
        <TestComponentWithoutCode />
      );
    });

    // EXAMPLE parsing out particular called arguments in a mock
    test('useNumberGenerators has right param map', () => {
      // Test namespace part of query call
      const mockNamespaceCall = mockUseQuery.mock.calls[0][0];
      // All namespace arguments are present
      expect(mockNamespaceCall.length).toBe(4);
      // query params are as expected
      expect(mockNamespaceCall[1]).not.toStrictEqual(expect.arrayContaining(['filters=code%3D%3Dtesting']));
      expect(mockNamespaceCall[1].length).toBe(3);

      // Test function part of query call
      const mockFunctionCall = mockUseQuery.mock.calls[0][1];
      expect(mockFunctionCall).toStrictEqual(expect.any(Function));
      mockFunctionCall();
      expect(mockGet).toHaveBeenCalledWith('servint/numberGenerators?sort=enabled%3Basc&sort=name%3Basc&stats=true');
    });
  });
});
