import { renderWithIntl } from '@folio/stripes-erm-testing';
import { Button, Select } from '@folio/stripes-testing';

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

const NumberGeneratorModalProps = {
  callback,
  generator: 'numberGen1',
  id: 'test',
  open: true
};

const NumberGeneratorModalPropsNoGenerator = {
  callback,
  id: 'test',
  open: true
};

const testSelectOption = (numGen, seq, expected = true) => {
  const selectedNumGen = numGen === 1 ? numberGenerator1 : numberGenerator2;

  const selectedSeqOption = selectedNumGen?.sequences?.[seq];

  if (expected) {
    describe(`choosing ${selectedSeqOption?.name ?? selectedSeqOption?.code}`, () => {
      beforeEach(async () => {
        await Select().choose(selectedSeqOption?.name ?? selectedSeqOption?.code);
      });

      it('has the expected value', async () => {
        await Select().has({ value: selectedSeqOption?.id });
      });
    });
  } else {
    // As far as I can see there's no way to test for SelectOption == absent
  }
};

describe('NumberGeneratorModal', () => {
  describe('NumberGeneratorModal with generator prop', () => {
    beforeEach(() => {
      renderWithIntl(
        <NumberGeneratorModal
          {...NumberGeneratorModalProps}
        />,
        translationsProperties
      );
    });

    test('renders the button', async () => {
      await Button('Generate').exists();
    });

    test('renders the select with the first sequence default', async () => {
      await Select().has({ value: numberGenerator1?.sequences?.[0]?.id });
    });

    describe('Select contains all expected options', () => {
      testSelectOption(1, 0);
      testSelectOption(1, 1);
      testSelectOption(1, 2);
    });

    describe('clicking generate button', () => {
      test('button gets clicked', async () => {
        await Button('Generate').click();
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

  // Use no generator again, but with sorting messed up to test sorting code
  describe('NumberGeneratorModal with no generator prop and wrong order', () => {
    beforeEach(() => {
      mockUseNumberGenerators.mockImplementationOnce(() => {
        return ({
          data: {
            results: [numberGenerator2, numberGenerator1]
          },
          isLoading: false
        });
      });

      renderWithIntl(
        <NumberGeneratorModal
          {...NumberGeneratorModalPropsNoGenerator}
        />,
        translationsProperties
      );
    });

    test('renders the select with the first sequence default', async () => {
      await Select().has({ value: numberGenerator2?.sequences?.[0]?.id });
    });

    describe('Select contains all expected options', () => {
      testSelectOption(1, 0);
      testSelectOption(1, 1);
      testSelectOption(1, 2);
      testSelectOption(2, 0);
      testSelectOption(2, 1, false);
      testSelectOption(2, 2);
    });
  });

  describe('NumberGeneratorModal with no generator prop', () => {
    beforeEach(() => {
      renderWithIntl(
        <NumberGeneratorModal
          {...NumberGeneratorModalPropsNoGenerator}
        />,
        translationsProperties
      );
    });

    test('renders the button', async () => {
      await Button('Generate').exists();
    });

    test('renders the select with the first sequence default', async () => {
      await Select().has({ value: numberGenerator1?.sequences?.[0]?.id });
    });

    describe('Select contains all expected options', () => {
      testSelectOption(1, 0);
      testSelectOption(1, 1);
      testSelectOption(1, 2);
      testSelectOption(2, 0);
      testSelectOption(2, 1, false);
      testSelectOption(2, 2);
    });

    describe('clicking generate button', () => {
      test('button gets clicked', async () => {
        await Button('Generate').click();
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
        expect(mockGenerateFunc.mock.calls.length).toBe(2);
      });

      test('passed callback gets called', () => {
        expect(callback.mock.calls.length).toBe(2);
      });
    });
  });
});
