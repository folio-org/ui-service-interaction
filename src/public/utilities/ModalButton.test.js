import {
  Button,
  Modal
} from '@folio/stripes/components';

import { renderWithIntl } from '@folio/stripes-erm-testing';
import { Button as ButtonInteractor } from '@folio/stripes-testing';

import ModalButton from './ModalButton';

describe('ModalButton', () => {
  describe('NumberGeneratorModalButton with generator prop', () => {
    beforeEach(() => {
      renderWithIntl(
        <ModalButton
          id="modal-button-id"
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
        />
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
    });
  });
});
