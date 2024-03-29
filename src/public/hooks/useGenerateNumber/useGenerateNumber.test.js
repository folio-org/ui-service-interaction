import { useQuery } from 'react-query';
import { render, waitFor } from '@folio/jest-config-stripes/testing-library/react';

import { useOkapiKy } from '@folio/stripes/core';

import { Button as MockButton } from '@folio/stripes/components';
import { Button, Callout, renderWithIntl } from '@folio/stripes-erm-testing';

import useGenerateNumber from './useGenerateNumber';
import useNumberGeneratorSequences from '../useNumberGeneratorSequences';

import { translationsProperties } from '../../../../test/helpers';
import { numberGenerator2 } from '../../../../test/jest/mockGenerators';

jest.mock('../useNumberGeneratorSequences', () => jest.fn());

/*
jest.mock('../useNumberGeneratorSequences', () => {
  const { numberGenerator2 } = jest.requireActual('../../../../test/jest/mockGenerators');
  return (
    () => ({
      data: {
        results: [
          numberGenerator2
        ]
      }
    })
  );
}); */

const mockUseQuery = jest.fn();
const mockGet = jest.fn();
const callback = jest.fn();

const resetMocks = () => {
  callback.mockReset();
  mockUseQuery.mockReset();
  mockGet.mockReset();
  // EXAMPLE mock return value undefined, sometimes it needs to be mocked in beforeEach
  // Ensure we can call .json() on return
  mockGet.mockReturnValue({ json: jest.fn(() => Promise.resolve({ nextValue: 'callback1' })) });
  // This is from mockReactQuery... probably a better way to import this
  mockUseQuery.mockReturnValue(({ data: {}, refetch: jest.fn(), isLoading: false }));

  // Mock implementations again
  useQuery.mockImplementation(mockUseQuery);
  useOkapiKy.mockImplementation(() => ({ get: mockGet }));
};

const TestComponent = ({
  generator,
  sequence
}) => {
  const { generate } = useGenerateNumber({
    callback,
    generator,
    sequence
  });
  return (
    <MockButton
      onClick={() => generate()}
    >
      GENERATE
    </MockButton>
  );
};

describe('useGenerateNumbers', () => {
  describe('render with enabled sequence', () => {
    beforeEach(() => {
      resetMocks();
      useNumberGeneratorSequences.mockImplementation(() => ({
        data: {
          results: [
            numberGenerator2.sequences?.find(s => s.code === 'seq2.1')
          ]
        }
      }));
      renderWithIntl(
        <TestComponent
          generator="numberGen2"
          sequence="seq2.1"
        />,
        translationsProperties,
        render,
        {
          intlKey: 'ui-service-interaction',
          moduleName: '@folio/service-interaction'
        }
      );
    });

    test('renders button', async () => {
      await Button('GENERATE').exists();
    });

    describe('clicking \'GENERATE\'', () => {
      beforeEach(async () => {
        await waitFor(async () => {
          await Button('GENERATE').click();
        });
      });

      test('disabled warning sequence does not render', async () => {
        await Callout('This sequence is marked as disabled and cannot be generated from. Please contact a system admin').absent();
      });

      test('useGenerateNumber has right param map', async () => {
        // Test namespace part of query call ( First call is to get sequences)
        const generateNumberCall = mockUseQuery.mock.calls[0];
        const mockNamespaceCall = generateNumberCall[0];
        // All namespace arguments are present
        expect(mockNamespaceCall.length).toBe(3);

        // Test function part of query call
        const mockFunctionCall = generateNumberCall[1];
        expect(mockFunctionCall).toStrictEqual(expect.any(Function));
        mockFunctionCall();
        expect(mockGet).toHaveBeenCalledWith('servint/numberGenerators/getNextNumber?generator=numberGen2&sequence=seq2.1');
        await waitFor(() => {
          expect(callback).toHaveBeenCalledWith('callback1');
        });
      });
    });
  });

  describe('render with non existant sequence', () => {
    beforeEach(() => {
      resetMocks();
      useNumberGeneratorSequences.mockImplementation(() => ({
        data: {
          results: []
        }
      }));

      renderWithIntl(
        <TestComponent
          generator="numberGen2"
          sequence="fakesequence"
        />,
        translationsProperties,
        render,
        {
          intlKey: 'ui-service-interaction',
          moduleName: '@folio/service-interaction'
        }
      );
    });

    test('renders button', async () => {
      await Button('GENERATE').exists();
    });

    describe('clicking \'GENERATE\'', () => {
      beforeEach(async () => {
        await waitFor(async () => {
          await Button('GENERATE').click();
        });
      });

      test('disabled warning sequence does not render', async () => {
        await Callout('This sequence is marked as disabled and cannot be generated from. Please contact a system admin').absent();
      });

      test('useGenerateNumber has right param map', async () => {
        // Test namespace part of query call ( First call is to get sequences)
        const generateNumberCall = mockUseQuery.mock.calls[0];
        const mockNamespaceCall = generateNumberCall[0];
        // All namespace arguments are present
        expect(mockNamespaceCall.length).toBe(3);

        // Test function part of query call
        const mockFunctionCall = generateNumberCall[1];
        expect(mockFunctionCall).toStrictEqual(expect.any(Function));
        mockFunctionCall();
        expect(mockGet).toHaveBeenCalledWith('servint/numberGenerators/getNextNumber?generator=numberGen2&sequence=fakesequence');
        await waitFor(() => {
          expect(callback).toHaveBeenCalledWith('callback1');
        });
      });
    });
  });

  describe('render with disabled sequence', () => {
    beforeEach(() => {
      resetMocks();
      useNumberGeneratorSequences.mockImplementation(() => ({
        data: {
          results: [
            numberGenerator2.sequences?.find(s => s.code === 'seq2.2')
          ]
        }
      }));

      renderWithIntl(
        <TestComponent
          generator="numberGenerator2"
          sequence="seq2.2"
        />,
        translationsProperties,
        render,
        {
          intlKey: 'ui-service-interaction',
          moduleName: '@folio/service-interaction'
        }
      );
    });

    test('renders button', async () => {
      await Button('GENERATE').exists();
    });

    describe('clicking \'GENERATE\'', () => {
      beforeEach(async () => {
        await waitFor(async () => {
          await Button('GENERATE').click();
        });
      });

      test('disabled warning sequence renders', async () => {
        await Callout('This sequence is marked as disabled and cannot be generated from. Please contact a system admin').exists();
      });
    });
  });
});
