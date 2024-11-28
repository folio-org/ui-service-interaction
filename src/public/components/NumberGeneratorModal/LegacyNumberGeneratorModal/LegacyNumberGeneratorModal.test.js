import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { Button, Select } from '@folio/stripes-erm-testing';

import { numberGenerator1, numberGenerator2 } from '../../../../../test/jest/mockGenerators';

import LegacyNumberGeneratorModal from './LegacyNumberGeneratorModal';
import { renderWithTranslations } from '../../../../../test/helpers';

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

jest.mock('../../../hooks', () => ({
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

const LegacyNumberGeneratorModalProps = {
  callback,
  generator: 'numberGen1',
  id: 'test',
  open: true
};

const LegacyNumberGeneratorModalPropsNoGenerator = {
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
        await waitFor(async () => {
          await Select().choose(selectedSeqOption?.name ?? selectedSeqOption?.code);
        });
      });

      it('has the expected value', async () => {
        await Select().has({ value: selectedSeqOption?.id });
      });
    });
  } else {
    // As far as I can see there's no way to test for SelectOption == absent
  }
};

describe('LegacyNumberGeneratorModal', () => {
  let renderedComponent;
  describe('LegacyNumberGeneratorModal with generator prop', () => {
    beforeEach(() => {
      renderWithTranslations(
        <LegacyNumberGeneratorModal
          {...LegacyNumberGeneratorModalProps}
        />,
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
      beforeEach(async () => {
        mockGenerateFunc.mockClear();
        callback.mockClear();
        await waitFor(async () => {
          await Button('Generate').click();
        });
      });

      test('useGenerateNumber gets called with expected parameters', () => {
        expect(mockUseGenerateNumber).toHaveBeenCalledWith(
          expect.objectContaining({
            generator: LegacyNumberGeneratorModalProps?.generator,
            sequence: numberGenerator1?.sequences?.[0]?.code
          })
        );
      });

      test('generate function gets called', async () => {
        await waitFor(() => {
          expect(mockGenerateFunc.mock.calls.length).toBe(1);
        });
      });

      test('passed callback gets called', async () => {
        await waitFor(() => {
          expect(callback.mock.calls.length).toBe(1);
        });
      });
    });
  });

  // Use no generator again, but with sorting messed up to test sorting code
  describe('LegacyNumberGeneratorModal with no generator prop and wrong order', () => {
    beforeEach(() => {
      mockUseNumberGenerators.mockImplementationOnce(() => {
        return ({
          data: {
            results: [numberGenerator2, numberGenerator1]
          },
          isLoading: false
        });
      });

      renderWithTranslations(
        <LegacyNumberGeneratorModal
          {...LegacyNumberGeneratorModalPropsNoGenerator}
        />
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

  describe('LegacyNumberGeneratorModal with no generator prop', () => {
    beforeEach(() => {
      renderWithTranslations(
        <LegacyNumberGeneratorModal
          {...LegacyNumberGeneratorModalPropsNoGenerator}
        />
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
      beforeEach(async () => {
        mockGenerateFunc.mockClear();
        callback.mockClear();
        await waitFor(async () => {
          await Button('Generate').click();
        });
      });

      test('useGenerateNumber gets called with expected parameters', () => {
        expect(mockUseGenerateNumber).toHaveBeenCalledWith(
          expect.objectContaining({
            generator: LegacyNumberGeneratorModalProps?.generator,
            sequence: numberGenerator1?.sequences?.[0]?.code
          })
        );
      });

      test('generate function gets called', async () => {
        await waitFor(() => {
          expect(mockGenerateFunc.mock.calls.length).toBe(1);
        });
      });

      test('passed callback gets called', async () => {
        await waitFor(() => {
          expect(callback.mock.calls.length).toBe(1);
        });
      });
    });
  });

  describe('LegacyNumberGeneratorModal with renderBottom/renderTop properties', () => {
    beforeEach(() => {
      renderedComponent = renderWithTranslations(
        <LegacyNumberGeneratorModal
          renderBottom={() => <div>BOTTOM</div>}
          renderTop={() => <div>TOP</div>}
          {...LegacyNumberGeneratorModalPropsNoGenerator}
        />
      );
    });

    test('renders top', () => {
      const { getByText } = renderedComponent;
      expect(getByText('TOP')).toBeInTheDocument();
    });

    test('renders bottom', () => {
      const { getByText } = renderedComponent;
      expect(getByText('BOTTOM')).toBeInTheDocument();
    });
  });
});
