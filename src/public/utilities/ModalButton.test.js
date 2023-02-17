import {
  Button,
  Modal
} from '@folio/stripes/components';

import { IconButtonInteractor, renderWithIntl } from '@folio/stripes-erm-testing';
import { Button as ButtonInteractor } from '@folio/stripes-testing';

import ModalButton from './ModalButton';
import { translationsProperties } from '../../../test/helpers';

const mockOnClose = jest.fn();

describe('ModalButton', () => {
  describe('NumberGeneratorModalButton with generator prop', () => {
    beforeEach(() => {
      renderWithIntl(
        <ModalButton
          id="modal-button-id"
          onClose={mockOnClose}
          renderModal={(mdProps) => (
            <Modal
              id="modal-id"
              label="modal label"
              {...mdProps}
            >
              {/* Render a button inside to check modal is rendering properly */}
              <Button>
                This is a button inside a modal
              </Button>
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
        await ButtonInteractor('Trigger button').click();
      });

      test('renders the modal contents', async () => {
        await ButtonInteractor('This is a button inside a modal').exists();
      });

      describe('Closing the modal', () => {
        beforeEach(async () => {
          await IconButtonInteractor('Dismiss modal').click();
        });

        test('onClose has been called', () => {
          expect(mockOnClose).toHaveBeenCalled();
        });

        test('no longer renders modal contents', async () => {
          await ButtonInteractor('This is a button inside a modal').absent();
        });
      });
    });
  });
});
