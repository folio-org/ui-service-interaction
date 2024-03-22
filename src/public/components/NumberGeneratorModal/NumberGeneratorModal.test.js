import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { Button, renderWithIntl } from '@folio/stripes-erm-testing';

import { translationsProperties } from '../../../../test/helpers';
import { numberGenerator1, numberGenerator2 } from '../../../../test/jest/mockGenerators';

import NumberGeneratorModal from './NumberGeneratorModal';

const callback = jest.fn();
const mockGenerateFunc = jest.fn();
const mockUseGenerateNumber = jest.fn(({ callback: callbackFunc }) => ({
  generate: () => {
    mockGenerateFunc();
    callbackFunc();
  }
}));

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
  useGenerateNumber: ({
    callback: callbackFunc,
    generator,
    sequence
  }) => mockUseGenerateNumber({
    callback: callbackFunc,
    generator,
    sequence
  }),
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
    QueryTypedown: () => <div>QueryTypedown</div>
  });
});

const NumberGeneratorModalProps = {
  callback,
  generator: 'numberGen1',
  id: 'test',
  open: true
};

// This test is now remarkably small and ought to be improved to get test coverage up later...
describe('NumberGeneratorModal', () => {
  let renderedComponent;
  describe('NumberGeneratorModal with generator prop', () => {
    beforeEach(() => {
      renderedComponent = renderWithIntl(
        <NumberGeneratorModal
          {...NumberGeneratorModalProps}
        />,
        translationsProperties
      );
    });

    test('renders the button', async () => {
      await Button('Generate').exists();
    });

    test('renders the query typedown', async () => {
      const { getByText } = renderedComponent;
      expect(getByText('QueryTypedown')).toBeInTheDocument();
    });

    describe('clicking generate button', () => {
      test('button gets clicked', async () => {
        await waitFor(async () => {
          await Button('Generate').click();
        });
        // Basically just check button click doesn't crash
        expect(1).toEqual(1);
      });

      test('useGenerateNumber gets called with expected parameters', () => {
        expect(mockUseGenerateNumber).toHaveBeenCalledWith(
          expect.objectContaining({
            generator: NumberGeneratorModalProps?.generator,
            sequence: numberGenerator1?.sequences?.[0]?.code
          })
        );
      });

      test('generate function gets called', () => {
        expect(mockGenerateFunc.mock.calls.length).toBe(1);
      });

      test('passed callback gets called', () => {
        expect(callback.mock.calls.length).toBe(1);
      });
    });
  });
});
