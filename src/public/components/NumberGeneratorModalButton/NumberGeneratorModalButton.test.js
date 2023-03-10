import { forwardRef as mockForwardRef } from 'react';

import { Button as MockStripesButton, Modal as MockModal } from '@folio/stripes/components';

import { renderWithIntl } from '@folio/stripes-erm-testing';
import { Button } from '@folio/stripes-testing';

import { translationsProperties } from '../../../../test/helpers';

import NumberGeneratorModalButton from './NumberGeneratorModalButton';

/*
 * EXAMPLE testing, mocking local Component inline
 * Sometimes trying to set up a component to use as a mock externally
 * just returns undefined.
 *
 * Instead, we can do it inline, provided that all externally
 * scoped references start with `mock`
 */

jest.mock('../NumberGeneratorModal', () => mockForwardRef(({
  callback,
  generateButtonLabel: _generateButtonLabel, // We don't need these for our mock
  generator: _generator,
  generatorButtonProps: _generatorButtonProps,
  id: _id,
  renderBottom: _renderBottom,
  renderTop: _renderTop,
  ...modalProps // grab modal props the same way we do in the actual component
}, ref) => {
  return (
    <MockModal
      ref={ref}
      label="Test modal"
      {...modalProps}
    >
      <MockStripesButton
        onClick={() => callback()}
      >
        Interior modal button
      </MockStripesButton>
    </MockModal>
  );
}));

const mockCallback = jest.fn();

describe('NumberGeneratorModalButton', () => {
  describe('NumberGeneratorModalButton with generator prop', () => {
    beforeEach(() => {
      renderWithIntl(
        <NumberGeneratorModalButton
          callback={mockCallback}
          generator="numberGen1"
          id="test"
        />,
        translationsProperties
      );
    });

    test('renders the modal open button', async () => {
      await Button('Select generator').exists();
    });

    test('does not render the button', async () => {
      await Button('Interior modal button').absent();
    });

    describe('Opening the modal', () => {
      beforeEach(async () => {
        await Button('Select generator').click();
      });

      test('renders the button', async () => {
        await Button('Interior modal button').exists();
      });

      describe('Clicking the interior button', () => {
        beforeEach(async () => {
          await Button('Interior modal button').click();
        });

        test('callback has been triggered', () => {
          expect(mockCallback).toHaveBeenCalled();
        });

        test('modal has been closed', async () => {
          await Button('Interior modal button').absent();
        });
      });
    });
  });
});
