import { forwardRef as mockForwardRef } from 'react';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { Button as MockStripesButton, Modal as MockModal } from '@folio/stripes/components';
import { Button } from '@folio/stripes-erm-testing';

import NumberGeneratorModalButton from './NumberGeneratorModalButton';
import { renderWithTranslations } from '../../../../test/helpers';

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
      Interior modal content
      <MockStripesButton
        onClick={() => callback()}
      >
        Interior modal button
      </MockStripesButton>
    </MockModal>
  );
}));

const mockCallback = jest.fn();
let renderComponent;
describe('NumberGeneratorModalButton', () => {
  describe('NumberGeneratorModalButton with generator prop', () => {
    beforeEach(() => {
      renderComponent = renderWithTranslations(
        <NumberGeneratorModalButton
          callback={mockCallback}
          generator="numberGen1"
          id="test"
        />
      );
    });

    test('renders the modal open button', async () => {
      await Button('Select generator').exists();
    });

    test('does not render the modal', async () => {
      const { queryByText } = renderComponent;
      await waitFor(() => {
        expect(queryByText('Interior modal content')).not.toBeInTheDocument();
      });
    });

    describe('Opening the modal', () => {
      beforeEach(async () => {
        await waitFor(async () => {
          await Button('Select generator').click();
        });
      });

      test('renders the modal', async () => {
        const { queryByText } = renderComponent;
        await waitFor(() => {
          expect(queryByText('Interior modal content')).toBeInTheDocument();
        });
      });

      describe('Clicking the interior button', () => {
        beforeEach(async () => {
          await waitFor(async () => {
            await Button('Interior modal button').click();
          });
        });

        test('callback has been triggered', async () => {
          await waitFor(() => {
            expect(mockCallback).toHaveBeenCalled();
          });
        });

        test('modal has been closed', async () => {
          const { queryByText } = renderComponent;
          await waitFor(() => {
            expect(queryByText('Interior modal content')).not.toBeInTheDocument();
          });
        });
      });
    });
  });
});
