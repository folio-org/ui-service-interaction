import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { Button, Select } from '@folio/stripes-testing';

import translationsProperties from '../../../../test/helpers';

import NumberGeneratorModalButton from './NumberGeneratorModalButton';

const callback = jest.fn();
const mockGenerateFunc = jest.fn();
const mockUseGenerateNumber = jest.fn(({ callback: callbackFunc }) => ({
  generate: () => {
    mockGenerateFunc();
    callbackFunc();
  }
}));

const numberGenerator1 = {
  id: 'number-generator-1',
  code: 'numberGen1',
  name: 'Number generator 1',
  sequences: [
    {
      id: 'ng1-seq1',
      code: 'seq1.1',
    },
    {
      id: 'ng1-seq2',
      code: 'seq1.2',
    },
    {
      id: 'ng1-seq3',
      code: 'seq1.3',
    }
  ]
};

const numberGenerator2 = {
  id: 'number-generator-2',
  code: 'numberGen2',
  name: 'Number generator 2',
  sequences: [
    {
      id: 'ng2-seq1',
      code: 'seq2.1',
    },
    {
      id: 'ng2-seq2',
      code: 'seq2.2',
    },
    {
      id: 'ng2-seq3',
      code: 'seq2.3',
    }
  ]
};

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

const NumberGeneratorModalButtonProps = {
  callback,
  generator: 'numberGen1',
  id: 'test',
};

const NumberGeneratorModalButtonPropsNoGenerator = {
  callback,
  id: 'test',
};

const testSelectOption = (numGen, seq) => {
  if (numGen === 1) {
    describe(`choosing ${numberGenerator1?.sequences?.[seq]?.code}`, () => {
      beforeEach(async () => {
        await Select().choose(numberGenerator1?.sequences?.[seq]?.code);
      });

      it('has the expected value', async () => {
        await Select().has({ value: numberGenerator1?.sequences?.[seq]?.id });
      });
    });
  } else {
    describe(`choosing ${numberGenerator2?.sequences?.[seq]?.code}`, () => {
      beforeEach(async () => {
        await Select().choose(numberGenerator2?.sequences?.[seq]?.code);
      });

      it('has the expected value', async () => {
        await Select().has({ value: numberGenerator2?.sequences?.[seq]?.id });
      });
    });
  }
};

describe('NumberGeneratorButton', () => {
  describe('NumberGeneratorModalButton with generator prop', () => {
    beforeEach(() => {
      renderWithIntl(
        <NumberGeneratorModalButton
          {...NumberGeneratorModalButtonProps}
        />,
        translationsProperties
      );
    });

    test('renders the modal open button', async () => {
      await Button('Select generator').exists();
    });

    describe('Opening the modal', () => {
      beforeEach(async () => {
        await Button('Select generator').click();
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
              generator: NumberGeneratorModalButtonProps?.generator,
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

  describe('NumberGeneratorModalButton with no generator prop', () => {
    beforeEach(() => {
      renderWithIntl(
        <NumberGeneratorModalButton
          {...NumberGeneratorModalButtonPropsNoGenerator}
        />,
        translationsProperties
      );
    });

    test('renders the modal open button', async () => {
      await Button('Select generator').exists();
    });

    describe('Opening the modal', () => {
      beforeEach(async () => {
        await Button('Select generator').click();
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
        testSelectOption(2, 1);
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
              generator: NumberGeneratorModalButtonProps?.generator,
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
});
