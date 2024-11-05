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

/* ****** REPEATED TESTS ****** */

// Keep selected seq and rendered component globally available
let seq;
let renderedComponent;
const renderSelectorAndSelectOptionFromSeqIndex = async (seqIndex, extraProps = {}) => {
  seq = mockNumberGenerator3.sequences[seqIndex];

  renderedComponent = renderWithTranslations(
    <NumberGeneratorSelector
      selectFirstSequenceOnMount={false}
      {...NumberGeneratorSelectorProps}
      {...extraProps}
    />,
  );

  const expectedKeyValue = (seq.maximumCheck && (seq.maximumCheck.label === 'At maximum' || seq.maximumCheck.label === 'Over threshold')) ?
    `${seq.name}·${seq.code}·Next value: ${seq.nextValue}·Usage status${seq.maximumCheck.label}` :
    `${seq.name}·${seq.code}·Next value: ${seq.nextValue}`;

  await waitFor(async () => {
    await Button(`Typedown-sequence_typedown-option-${seq.id}`).click();
  });

  await KeyValue('Typedown-sequence_typedown-selected-option').has({ value: expectedKeyValue });
};

const warningText = '<strong>Warning:</strong> The number generator sequence <strong>{name}</strong> is approaching <strong>{maxVal}</strong>, its maximum value.';
const testWarning = () => test('warning renders', () => {
  const { getByText } = renderedComponent;
  expect(getByText(warningText, { exact: false })).toBeInTheDocument();
});
const testNoWarning = () => test('warning does not render', () => {
  const { queryByText } = renderedComponent;
  expect(queryByText(warningText, { exact: false })).not.toBeInTheDocument();
});

const errorText = '<strong>Error:</strong> The number was not generated because the sequence <strong>{name}</strong> has reached <strong>{maxVal}</strong>, its maximum value. Please select a different sequence or contact your administrator.';
const testError = () => test('error renders', () => {
  const { getByText } = renderedComponent;
  expect(getByText(errorText, { exact: false })).toBeInTheDocument();
});
const testNoError = () => test('error does not render', () => {
  const { queryByText } = renderedComponent;
  expect(queryByText(errorText, { exact: false })).not.toBeInTheDocument();
});

/* ****** TEST SUITE ****** */
describe('NumberGeneratorSelector', () => {
  describe('NumberGeneratorSelector with no id prop', () => {
    beforeEach(() => {
      renderedComponent = renderWithTranslations(
        <NumberGeneratorSelector
          {...NumberGeneratorSelectorProps}
        />,
      );
    });

    test('renders the query typedown', () => {
      const { getByText } = renderedComponent;
      expect(getByText('Typedown-sequence_typedown')).toBeInTheDocument();
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

    test('after load onSequenceChange is called with expected parameters', async () => {
      expect(mockOnSequenceChange).toHaveBeenCalledWith({
        ...mockNumberGenerator3.sequences[0],
        owner: {
          code: mockNumberGenerator3.code,
          id: mockNumberGenerator3.id,
          name: mockNumberGenerator3.name
        }
      });
    });
  });

  describe('NumberGeneratorSelector with an id prop', () => {
    beforeEach(() => {
      renderedComponent = renderWithTranslations(
        <NumberGeneratorSelector
          id="my_id"
          {...NumberGeneratorSelectorProps}
        />,
      );
    });

    test('renders the query typedown', async () => {
      const { getByText } = renderedComponent;
      expect(getByText('Typedown-sequence_typedown_my_id')).toBeInTheDocument();
    });
  });

  describe('NumberGeneratorSelector with selectFirstSequenceOnMount turned off', () => {
    beforeEach(() => {
      renderedComponent = renderWithTranslations(
        <NumberGeneratorSelector
          selectFirstSequenceOnMount={false}
          {...NumberGeneratorSelectorProps}
        />,
      );
      // Reset for this last test
      mockOnSequenceChange.mockReset();
    });

    test('after load onSequenceChange is not called', async () => {
      expect(mockOnSequenceChange).not.toHaveBeenCalled();
    });

    test('QueryTypedown KeyValue shows nothing selected', async () => {
      await KeyValue('Typedown-sequence_typedown-selected-option').has({ value: 'Nothing selected' });
    });
  });

  describe('NumberGeneratorSelector display warnings', () => {
    describe('default behaviour -- no warnings', () => {
      const getTestFunc = (ind) => () => {
        beforeEach(() => renderSelectorAndSelectOptionFromSeqIndex(ind));

        testNoWarning();
      };

      describe('selecting sequence with no maximum check value', getTestFunc(0));
      describe('selecting sequence with maximum check value "below_threshold"', getTestFunc(4));
      describe('selecting sequence with maximum check value "over_threshold"', getTestFunc(5));
      describe('selecting sequence with maximum check value "at_maximum"', getTestFunc(2));
    });

    describe('display warnings = false', () => {
      const getTestFunc = (ind) => () => {
        beforeEach(() => renderSelectorAndSelectOptionFromSeqIndex(ind, { displayWarning: false }));

        testNoWarning();
      };

      describe('selecting sequence with no maximum check value', getTestFunc(0));
      describe('selecting sequence with maximum check value "below_threshold"', getTestFunc(4));
      describe('selecting sequence with maximum check value "over_threshold"', getTestFunc(5));
      describe('selecting sequence with maximum check value "at_maximum"', getTestFunc(2));
    });

    describe('display warnings = true', () => {
      const getTestFunc = (ind, expectWarning = false) => () => {
        beforeEach(() => renderSelectorAndSelectOptionFromSeqIndex(ind, { displayWarning: true }));

        if (expectWarning) {
          testWarning();
        } else {
          testNoWarning();
        }
      };

      describe('selecting sequence with no maximum check value', getTestFunc(0));
      describe('selecting sequence with maximum check value "below_threshold"', getTestFunc(4));
      describe('selecting sequence with maximum check value "over_threshold"', getTestFunc(5, true));
      describe('selecting sequence with maximum check value "at_maximum"', getTestFunc(2));
    });
  });

  describe('NumberGeneratorSelector display errors', () => {
    describe('default behaviour -- errors on', () => {
      const getTestFunc = (ind, expectError = false) => () => {
        beforeEach(() => renderSelectorAndSelectOptionFromSeqIndex(ind));

        if (expectError) {
          testError();
        } else {
          testNoError();
        }
      };

      describe('selecting sequence with no maximum check value', getTestFunc(0));
      describe('selecting sequence with maximum check value "below_threshold"', getTestFunc(4));
      describe('selecting sequence with maximum check value "over_threshold"', getTestFunc(5));
      describe('selecting sequence with maximum check value "at_maximum"', getTestFunc(2, true));
    });

    describe('display errors = false', () => {
      const getTestFunc = (ind) => () => {
        beforeEach(() => renderSelectorAndSelectOptionFromSeqIndex(ind, { displayError: false }));

        testNoError();
      };

      describe('selecting sequence with no maximum check value', getTestFunc(0));
      describe('selecting sequence with maximum check value "below_threshold"', getTestFunc(4));
      describe('selecting sequence with maximum check value "over_threshold"', getTestFunc(5));
      describe('selecting sequence with maximum check value "at_maximum"', getTestFunc(2));
    });

    describe('display warnings = true', () => {
      const getTestFunc = (ind, expectError = false) => () => {
        beforeEach(() => renderSelectorAndSelectOptionFromSeqIndex(ind, { displayError: true }));

        if (expectError) {
          testError();
        } else {
          testNoError();
        }
      };

      describe('selecting sequence with no maximum check value', getTestFunc(0));
      describe('selecting sequence with maximum check value "below_threshold"', getTestFunc(4));
      describe('selecting sequence with maximum check value "over_threshold"', getTestFunc(5));
      describe('selecting sequence with maximum check value "at_maximum"', getTestFunc(2, true));
    });
  });
});
