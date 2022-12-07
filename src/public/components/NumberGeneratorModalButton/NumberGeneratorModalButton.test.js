import { forwardRef as mockForwardRef } from 'react';

import { Button as MockStripesButton } from '@folio/stripes/components';

import { renderWithIntl } from '@folio/stripes-erm-testing';
import { Button } from '@folio/stripes-testing';

import translationsProperties from '../../../../test/helpers';

import NumberGeneratorModalButton from './NumberGeneratorModalButton';

/*
 * EXAMPLE testing, mocking local Component inline
 * Sometimes trying to set up a component to use as a mock externally
 * just returns undefined.
 *
 * Instead, we can do it inline, provided that all externally
 * scoped references start with `mock`
 */

jest.mock('../NumberGeneratorModal', () => mockForwardRef(() => (
  <MockStripesButton
    onClick={() => null}
  >
    Interior modal button
  </MockStripesButton>
)));

describe('NumberGeneratorModalButton', () => {
  describe('NumberGeneratorModalButton with generator prop', () => {
    beforeEach(() => {
      renderWithIntl(
        <NumberGeneratorModalButton
          callback={jest.fn()}
          generator="numberGen1"
          id="test"
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
        await Button('Interior modal button').exists();
      });
    });
  });
});
