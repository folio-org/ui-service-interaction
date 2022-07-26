import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { Button } from '@folio/stripes-testing';

import translationsProperties from '../../../../test/helpers';
import { numberGenerator1, numberGenerator2 } from '../../../../test/jest/mockGenerators';

import NumberGeneratorButton from './NumberGeneratorButton';


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

const NumberGeneratorButtonProps = {
  callback,
  generator: 'numberGen1',
  id: 'test',
  sequence: 'seq1.1',
};

describe('NumberGeneratorButton', () => {
  beforeEach(() => {
    renderWithIntl(
      <NumberGeneratorButton
        {...NumberGeneratorButtonProps}
      />,
      translationsProperties
    );
  });

  test('renders the button', async () => {
    await Button('Generate').exists();
  });

  describe('clicking the button', () => {
    test('button gets clicked', async () => {
      await Button('Generate').click();
      // Basically just check button click doesn't crash
      expect(1).toEqual(1);
    });

    test('useGenerateNumber gets called with expected parameters', () => {
      expect(mockUseGenerateNumber).toHaveBeenCalledWith({
        callback,
        generator: NumberGeneratorButtonProps?.generator,
        sequence: NumberGeneratorButtonProps?.sequence
      });
    });

    test('generate function gets called', () => {
      expect(mockGenerateFunc.mock.calls.length).toBe(1);
    });

    test('passed callback gets called', () => {
      expect(callback.mock.calls.length).toBe(1);
    });
  });
});
