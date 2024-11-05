import { useQuery } from 'react-query';
import { waitFor } from '@folio/jest-config-stripes/testing-library/react';

import { useOkapiKy } from '@folio/stripes/core';

import { Button as MockButton } from '@folio/stripes/components';
import { Button, Callout, renderWithIntl } from '@folio/stripes-erm-testing';

import useGenerateNumber from './useGenerateNumber';
import useNumberGeneratorSequences from '../useNumberGeneratorSequences';

import {
  GENERATE_ERROR_CODE_MAX_REACHED,
  GENERATE_STATUS_ERROR,
  GENERATE_STATUS_WARNING,
  GENERATE_WARNING_CODE_HIT_MAXIMUM,
  GENERATE_WARNING_CODE_OVER_THRESHOLD,
} from '../../constants';

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

const resetMocks = (returnGetValue = { nextValue: 'callback1' }) => {
  callback.mockReset();
  mockUseQuery.mockReset();
  mockGet.mockReset();
  // EXAMPLE mock return value undefined, sometimes it needs to be mocked in beforeEach
  // Ensure we can call .json() on return
  mockGet.mockReturnValue({ json: jest.fn(() => Promise.resolve(returnGetValue)) });
  // This is from mockReactQuery... probably a better way to import this
  mockUseQuery.mockImplementation((_key, func) => ({ data: {}, refetch: jest.fn(() => func()), isLoading: false }));

  // Mock implementations again
  useQuery.mockImplementation(mockUseQuery);
  useOkapiKy.mockImplementation(() => ({ get: mockGet }));
};

const TestComponent = ({
  cb = callback,
  generator,
  sequence,
  ...otherProps
}) => {
  const { generate } = useGenerateNumber({
    callback: cb,
    generator,
    sequence,
    ...otherProps
  });
  return (
    <MockButton
      onClick={() => generate()}
    >
      GENERATE
    </MockButton>
  );
};

describe('useGenerateNumber', () => {
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


  const approachingMaxWarningText = '<strong>Warning:</strong> The number generator sequence <strong>{name}</strong> is approaching <strong>{maxVal}</strong>, its maximum value.';
  const hitMaxWarningText = '<strong>Warning:</strong> The number generator sequence <strong>{name}</strong> has now reached its maximum value of <strong>{maxVal}</strong>and cannot be used again.';
  const testWarningCode = (warningCode, expectedCalloutText, sendWarningCallouts = true) => {
    describe(`Warning code: ${warningCode}`, () => {
      beforeEach(() => {
        resetMocks({ nextValue: 'callback1', status: GENERATE_STATUS_WARNING, warningCode });
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
            sendWarningCallouts={sendWarningCallouts}
            sequence="seq2.1"
          />,
          translationsProperties,
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

        if (sendWarningCallouts) {
          test('expected warning callout renders', async () => {
            await Callout(expectedCalloutText).exists();
          });
        } else {
          test('warning callout does not render', async () => {
            await Callout(expectedCalloutText).absent();
          });
        }
      });
    });
  };

  const errorMax = '<strong>Error:</strong> The number was not generated because the sequence <strong>{name}</strong> has reached <strong>{maxVal}</strong>, its maximum value. Please select a different sequence or contact your administrator.';
  const errorGeneric = '<strong>Error:</strong> Unable to generate a number using the sequence <strong>{name}</strong>. Please try again. If this error recurs contact your administrator.';
  const testErrorCode = (errorCode, expectedCalloutText, sendErrorCallouts = true) => {
    describe(`Error code: ${errorCode}`, () => {
      beforeEach(() => {
        resetMocks({ nextValue: 'callback1', status: GENERATE_STATUS_ERROR, errorCode });
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
            sendErrorCallouts={sendErrorCallouts}
            sequence="seq2.1"
          />,
          translationsProperties,
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

        if (sendErrorCallouts) {
          test('expected error callout renders', async () => {
            await Callout(expectedCalloutText).exists();
          });
        } else {
          test('error callout does not render', async () => {
            await Callout(expectedCalloutText).absent();
          });
        }
      });
    });
  };

  describe('send warning callouts', () => {
    describe('sendWarningCallouts = true', () => {
      testWarningCode(GENERATE_WARNING_CODE_OVER_THRESHOLD, approachingMaxWarningText);
      testWarningCode(GENERATE_WARNING_CODE_HIT_MAXIMUM, hitMaxWarningText);
    });

    describe('sendWarningCallouts = false', () => {
      testWarningCode(GENERATE_WARNING_CODE_OVER_THRESHOLD, approachingMaxWarningText, false);
      testWarningCode(GENERATE_WARNING_CODE_HIT_MAXIMUM, hitMaxWarningText, false);
    });
  });

  describe('send error callouts', () => {
    describe('sendErrorCallouts = true', () => {
      testErrorCode(GENERATE_ERROR_CODE_MAX_REACHED, errorMax);
      testErrorCode('UnknownCode', errorGeneric);
    });

    describe('sendErrorCallouts = false', () => {
      testErrorCode(GENERATE_ERROR_CODE_MAX_REACHED, errorMax, false);
      testErrorCode('UnknownCode', errorGeneric, false);
    });
  });
});
