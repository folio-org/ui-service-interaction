import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { renderWithIntl } from '@folio/stripes-erm-testing';

import useMutateNumberGenerator from './useMutateNumberGenerator';

const mockUseMutation = jest.fn();
const mockMutate = jest.fn();
const mockQueryClient = jest.fn();

const resetMocks = () => {
  mockUseMutation.mockReset();
  mockMutate.mockReset();
  mockQueryClient.mockReset();
  // EXAMPLE mock return value undefined, sometimes it needs to be mocked in beforeEach
  // Ensure we can call .json() on return
  mockUseMutation.mockReturnValue(({ mutateAsync: jest.fn() }));
  mockMutate.mockReturnValue({ json: jest.fn(() => Promise.resolve()) });
};

const TestComponent = () => {
  useMutateNumberGenerator();
  return <div> Component </div>;
};

const testPayload = { id: 'test-id' };

describe('useMutateNumberGenerator', () => {
  let renderComponent;
  describe('useMutateNumberGenerator', () => {
    beforeEach(() => {
      resetMocks();
      useMutation.mockImplementation(mockUseMutation);
      useOkapiKy.mockImplementation(() => ({
        delete: mockMutate,
        post: mockMutate,
        put: mockMutate
      }));

      renderComponent = renderWithIntl(
        <TestComponent />
      );
    });

    test('component renders without failure', () => {
      const { getByText } = renderComponent;
      expect(getByText('Component')).toBeInTheDocument();
    });

    // EXAMPLE parsing out particular called arguments in a mock
    test('useMutateNumberGenerator delete has right param map', () => {
      // Test namespace part of query call
      const mockNamespaceCall = mockUseMutation.mock.calls[0][0];
      // All namespace arguments are present
      expect(mockNamespaceCall.length).toBe(3);
      expect(mockNamespaceCall).toStrictEqual(['ui-service-interaction', 'useMutateNumberGenerator', 'delete']);

      // Test function part of query call
      // EXAMPLE grabbing function from the call to the mock, not as part of the mock
      const mockFunctionCall = mockUseMutation.mock.calls[0][1];
      expect(mockFunctionCall).toStrictEqual(expect.any(Function));
      mockFunctionCall(testPayload.id);
      expect(mockMutate).toHaveBeenCalledWith('servint/numberGenerators/test-id');
    });

    test('useMutateNumberGenerator edit has right param map', () => {
      // Test namespace part of query call
      const mockNamespaceCall = mockUseMutation.mock.calls[1][0];
      // All namespace arguments are present
      expect(mockNamespaceCall.length).toBe(3);
      expect(mockNamespaceCall).toStrictEqual(['ui-service-interaction', 'useMutateNumberGenerator', 'edit']);

      // Test function part of query call
      // EXAMPLE grabbing function from the call to the mock, not as part of the mock
      const mockFunctionCall = mockUseMutation.mock.calls[1][1];
      expect(mockFunctionCall).toStrictEqual(expect.any(Function));
      mockFunctionCall(testPayload);
      expect(mockMutate).toHaveBeenCalledWith('servint/numberGenerators/test-id', { json: testPayload });
    });

    test('useMutateNumberGenerator add has right param map', () => {
      // Test namespace part of query call
      const mockNamespaceCall = mockUseMutation.mock.calls[2][0];
      // All namespace arguments are present
      expect(mockNamespaceCall.length).toBe(3);
      expect(mockNamespaceCall).toStrictEqual(['ui-service-interaction', 'useMutateNumberGenerator', 'add']);

      // Test function part of query call
      // EXAMPLE grabbing function from the call to the mock, not as part of the mock
      const mockFunctionCall = mockUseMutation.mock.calls[2][1];
      expect(mockFunctionCall).toStrictEqual(expect.any(Function));
      mockFunctionCall(testPayload);
      expect(mockMutate).toHaveBeenCalledWith('servint/numberGenerators', { json: testPayload });
    });
  });
});
