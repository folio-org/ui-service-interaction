import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import {
  Button,
  Checkbox,
  KeyValue,
  mockTypedownGetter,
} from '@folio/stripes-erm-testing';

import {
  numberGenerator2,
  numberGenerator3 as mockNumberGenerator3
} from '../../../../test/jest/mockGenerators';

import NumberGeneratorSelector from './NumberGeneratorSelector';
import { renderWithTranslations } from '../../../../test/helpers';


/* ****** MOCKS ****** */
const mockUseNumberGenerators = jest.fn((code) => {
  let generators = [];
  if (!code) {
    generators = [mockNumberGenerator3, numberGenerator2];
  } else {
    generators = [mockNumberGenerator3];
  }

  return ({
    data: {
      results: generators
    },
    isLoading: false
  });
});

const mockUseParallelBatchFetch = jest.fn(({ generateQueryKey }) => {
  // Ensure generateQueryKey gets called for stupid coverage reasons
  generateQueryKey({ batchParams: 'wibble', offset: 0 });

  return ({
    items: [mockNumberGenerator3, numberGenerator2].reduce((acc, curr) => {
      const newAcc = [
        ...acc,
        ...curr.sequences.map(seq => ({
          ...seq,
          owner: {
            id: curr.id,
            name: curr.name,
            code: curr.code
          }
        }))
      ];
      return newAcc;
    }, []),
    isLoading: false
  });
});

jest.mock('../../hooks', () => ({
  useNumberGenerators: (code) => mockUseNumberGenerators(code)
}));

jest.mock('@folio/stripes-erm-components', () => {
  const { mockErmComponents } = jest.requireActual('@folio/stripes-erm-testing');
  const ErmComps = jest.requireActual('@folio/stripes-erm-components');

  return ({
    ...ErmComps,
    ...mockErmComponents,
    useParallelBatchFetch: (props) => mockUseParallelBatchFetch(props)
  });
});
// Perhaps typedown should have a proper interactor, if not for jest tests at least for cypress tests
jest.mock('@k-int/stripes-kint-components', () => {
  const { mockKintComponents } = jest.requireActual('@folio/stripes-erm-testing');
  const KintComps = jest.requireActual('@k-int/stripes-kint-components');

  return ({
    ...KintComps,
    ...mockKintComponents,
    QueryTypedown: mockTypedownGetter(mockNumberGenerator3.sequences)
  });
});

const mockOnSequenceChange = jest.fn();

/* ****** PROPS ****** */
const NumberGeneratorSelectorProps = {
  generator: 'numberGen1',
  onSequenceChange: mockOnSequenceChange
};

// Keep selected seq and rendered component globally available
let seq;
let renderedComponent;

/* ****** TEST SUITE ****** */

const getTypedownLabelFromSequence = (sequence) => {
  return (sequence.maximumCheck && (sequence.maximumCheck.label === 'At maximum' || sequence.maximumCheck.label === 'Over threshold')) ?
    `${sequence.name}·${sequence.code}·Next value: ${sequence.nextValue}·Usage status${sequence.maximumCheck.label}` :
    `${sequence.name}·${sequence.code}·Next value: ${sequence.nextValue}`;
};

describe('NumberGeneratorSelector', () => {
  describe.each([
    { title: 'no id prop', componentProps: {} },
    { title: 'with id prop', componentProps: { id: 'my_id' } },
    { title: 'with selectFirstSequenceOnMount turned off', componentProps: { selectFirstSequenceOnMount: false } },
  ])('$title', ({ componentProps }) => {
    let typedownGetterString = 'Typedown-sequence_typedown';
    if (componentProps.id) {
      typedownGetterString = `${typedownGetterString}_${componentProps.id}`;
    }
    beforeEach(() => {
      mockOnSequenceChange.mockReset();

      renderedComponent = renderWithTranslations(
        <NumberGeneratorSelector
          {...NumberGeneratorSelectorProps}
          {...componentProps}
        />,
      );
    });

    test('renders the query typedown', () => {
      const { getByText } = renderedComponent;
      expect(getByText(typedownGetterString)).toBeInTheDocument();
    });

    test('renders the query typedown footer', async () => {
      await Checkbox({ id: 'includeAtMaxSequences_label' }).exists();
      await Checkbox({ id: 'exact_match_label' }).exists();
    });

    describe('Selecting include max sequences checkbox', () => {
      beforeEach(async () => {
        await waitFor(async () => {
          await Checkbox({ id: 'includeAtMaxSequences_label' }).click();
        });
      });

      test('Include max sequences checkbox is checked', async () => {
        await Checkbox({ id: 'includeAtMaxSequences_label' }).has({ checked: true });
      });
    });

    describe('Selecting exact match checkbox', () => {
      beforeEach(async () => {
        await waitFor(async () => {
          await Checkbox({ id: 'exact_match_label' }).click();
        });
      });

      test('Include max sequences checkbox is checked', async () => {
        await Checkbox({ id: 'exact_match_label' }).has({ checked: true });
      });
    });

    test('after load onSequenceChange is called with expected parameters', () => {
      if (componentProps.selectFirstSequenceOnMount !== false) {
        expect(mockOnSequenceChange).toHaveBeenCalledWith({
          ...mockNumberGenerator3.sequences[0],
          owner: {
            code: mockNumberGenerator3.code,
            id: mockNumberGenerator3.id,
            name: mockNumberGenerator3.name
          }
        });
      } else {
        expect(mockOnSequenceChange).not.toHaveBeenCalled();
      }
    });

    test('QueryTypedown KeyValue shows expected value', async () => {
      if (componentProps.selectFirstSequenceOnMount !== false) {
        await KeyValue(`${typedownGetterString}-selected-option`).has({ value: getTypedownLabelFromSequence(mockNumberGenerator3.sequences[0]) });
      } else {
        await KeyValue(`${typedownGetterString}-selected-option`).has({ value: 'Nothing selected' });
      }
    });
  });

  describe('NumberGeneratorSelector display errors/warnings', () => {
    describe.each([
      { label: 'default behaviour', componentProps: {}, expectWarnings: [], expectErrors: ['at_maximum'] },
      { label: 'displayWarning = false', componentProps: { displayWarning: false }, expectWarnings: [], expectErrors: ['at_maximum'] },
      { label: 'displayError = false', componentProps: { displayError: false }, expectWarnings: [], expectErrors: [] },
      { label: 'displayWarning = true', componentProps: { displayWarning: true }, expectWarnings: ['over_threshold'], expectErrors: ['at_maximum'] },
      { label: 'displayError = true', componentProps: { displayError: true }, expectWarnings: [], expectErrors: ['at_maximum'] },
      { label: 'displayWarning = true, displayError = false', componentProps: { displayWarning: true, displayError: false }, expectWarnings: ['over_threshold'], expectErrors: [] },
    ])('$label', ({ componentProps, expectErrors, expectWarnings }) => {
      beforeEach(async () => {
        // Render the selector with extra props
        renderedComponent = renderWithTranslations(
          <NumberGeneratorSelector
            selectFirstSequenceOnMount={false}
            {...NumberGeneratorSelectorProps}
            {...componentProps}
          />,
        );
      });

      describe.each([
        { maxCheckValue: undefined, sequenceIndex: 0 },
        { maxCheckValue: 'below_threshold', sequenceIndex: 4 },
        { maxCheckValue: 'over_threshold', sequenceIndex: 5 },
        { maxCheckValue: 'at_maximum', sequenceIndex: 2 },
      ])('selecting sequence with maximum check value $maxCheckValue', ({ maxCheckValue }) => {
        beforeEach(async () => {
          seq = mockNumberGenerator3.sequences.find(s => s.maximumCheck?.value === maxCheckValue);

          await waitFor(async () => {
            await Button(`Typedown-sequence_typedown-option-${seq.id}`).click();
          });
        });

        test('correct sequence was selected', async () => {
          // Not thrilled with having to do all this work
          const expectedKeyValue = getTypedownLabelFromSequence(seq);
          await KeyValue('Typedown-sequence_typedown-selected-option').has({ value: expectedKeyValue });
        });

        describe.each([
          {
            type: 'warning',
            includesArray: expectWarnings,
            text: '<strong>Warning:</strong> The number generator sequence <strong>{name}</strong> is approaching <strong>{maxVal}</strong>, its maximum value.'
          },
          {
            type: 'error',
            includesArray: expectErrors,
            text: '<strong>Error:</strong> The number was not generated because the sequence <strong>{name}</strong> has reached <strong>{maxVal}</strong>, its maximum value. Please select a different sequence or contact your administrator.'
          },
        ])('', ({ includesArray, text, type }) => {
          if (includesArray.includes(maxCheckValue)) {
            test(`${type} renders`, async () => {
              const { queryByText } = renderedComponent;
              await waitFor(() => {
                expect(queryByText(text, { exact: false })).toBeInTheDocument();
              });
            });
          } else {
            test(`${type} does not render`, async () => {
              const { queryByText } = renderedComponent;
              await waitFor(() => {
                expect(queryByText(text, { exact: false })).not.toBeInTheDocument();
              });
            });
          }
        });
      });
    });
  });
});
