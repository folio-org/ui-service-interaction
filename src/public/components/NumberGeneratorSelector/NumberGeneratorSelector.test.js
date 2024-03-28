import { renderWithIntl } from '@folio/stripes-erm-testing';

import { translationsProperties } from '../../../../test/helpers';
import { numberGenerator1, numberGenerator2 } from '../../../../test/jest/mockGenerators';

import NumberGeneratorSelector from './NumberGeneratorSelector';

const mockUseNumberGenerators = jest.fn((code) => {
  let generators = [];
  if (!code) {
    generators = [numberGenerator1, numberGenerator2];
  } else {
    generators = [numberGenerator1];
  }

  return ({
    data: {
      results: generators
    },
    isLoading: false
  });
});

const mockUseParallelBatchFetch = jest.fn(() => {
  return ({
    items: [numberGenerator1, numberGenerator2].reduce((acc, curr) => {
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
    useParallelBatchFetch: () => mockUseParallelBatchFetch()
  });
});
// Perhaps typedown should have a proper interactor, if not for jest tests at least for cypress tests
jest.mock('@k-int/stripes-kint-components', () => {
  const { mockKintComponents } = jest.requireActual('@folio/stripes-erm-testing');
  const KintComps = jest.requireActual('@k-int/stripes-kint-components');

  return ({
    ...KintComps,
    ...mockKintComponents,
    QueryTypedown: ({ id }) => <div>{`QueryTypedown-${id}`}</div>
  });
});

const mockOnSequenceChange = jest.fn();

const NumberGeneratorSelectorProps = {
  generator: 'numberGen1',
  onSequenceChange: mockOnSequenceChange
};

// This test is now remarkably small and ought to be improved to get test coverage up later...
describe('NumberGeneratorSelector', () => {
  let renderedComponent;
  describe('NumberGeneratorSelector with no id prop', () => {
    beforeEach(() => {
      renderedComponent = renderWithIntl(
        <NumberGeneratorSelector
          {...NumberGeneratorSelectorProps}
        />,
        translationsProperties
      );
    });

    test('renders the query typedown', async () => {
      const { getByText } = renderedComponent;
      expect(getByText('QueryTypedown-sequence_typedown')).toBeInTheDocument();
    });

    test('after load onSequenceChange is called with expected parameters', async () => {
      expect(mockOnSequenceChange).toHaveBeenCalledWith({
        ...numberGenerator1.sequences[0],
        owner: {
          code: numberGenerator1.code,
          id: numberGenerator1.id,
          name: numberGenerator1.name
        }
      });
    });
  });

  describe('NumberGeneratorSelector with an id prop', () => {
    beforeEach(() => {
      renderedComponent = renderWithIntl(
        <NumberGeneratorSelector
          id="my_id"
          {...NumberGeneratorSelectorProps}
        />,
        translationsProperties
      );
    });

    test('renders the query typedown', async () => {
      const { getByText } = renderedComponent;
      expect(getByText('QueryTypedown-sequence_typedown_my_id')).toBeInTheDocument();
    });
  });

  describe('NumberGeneratorSelector with selectFirstSequenceOnMount turned off', () => {
    beforeEach(() => {
      renderedComponent = renderWithIntl(
        <NumberGeneratorSelector
          selectFirstSequenceOnMount={false}
          {...NumberGeneratorSelectorProps}
        />,
        translationsProperties
      );
      // Reset for this last test
      mockOnSequenceChange.mockReset();
    });

    test('after load onSequenceChange is not called', async () => {
      expect(mockOnSequenceChange).not.toHaveBeenCalled();
    });
  });
});
