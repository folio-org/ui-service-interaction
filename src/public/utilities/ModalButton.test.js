import { waitFor } from '@folio/jest-config-stripes/testing-library/react';

import {
  Button,
  Modal
} from '@folio/stripes/components';

import {
  Button as ButtonInteractor,
  IconButton,
  renderWithIntl
} from '@folio/stripes-erm-testing';

import ModalButton from './ModalButton';
import { translationsProperties } from '../../../test/helpers';

const mockOnClose = jest.fn();
let renderComponent;
describe('ModalButton', () => {
  describe('NumberGeneratorModalButton with generator prop', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <ModalButton
          id="modal-button-id"
          onClose={mockOnClose}
          renderModal={(mdProps) => (
            <Modal
              id="modal-id"
              label="modal label"
              {...mdProps}
            >
              Internal modal contents
            </Modal>
          )}
          renderTrigger={(bprops) => (
            <Button
              {...bprops}
            >
              Trigger button
            </Button>
          )}
        />,
        translationsProperties
      );
    });

    test('renders the trigger button', async () => {
      await ButtonInteractor('Trigger button').exists();
      // Check the trigger id is set as desired
      await ButtonInteractor('Trigger button').has({ id: 'clickable-trigger-modal-modal-button-id' });
    });

    describe('Opening the modal', () => {
      beforeEach(async () => {
        await waitFor(async () => {
          await ButtonInteractor('Trigger button').click();
        });
      });

      test('renders the modal contents', async () => {
        const { getByText } = renderComponent;
        await waitFor(() => {
          expect(getByText('Internal modal contents')).toBeInTheDocument();
        });
      });

      describe('Closing the modal', () => {
        beforeEach(async () => {
          await waitFor(async () => {
            await IconButton('Dismiss modal').click();
          });
        });

        test('onClose has been called', async () => {
          await waitFor(async () => {
            await expect(mockOnClose).toHaveBeenCalled();
          });
        });

        test('no longer renders modal contents', async () => {
          const { queryByText } = renderComponent;
          await waitFor(() => {
            expect(queryByText('Internal modal contents')).not.toBeInTheDocument();
          });
        });
      });
    });
  });
});
