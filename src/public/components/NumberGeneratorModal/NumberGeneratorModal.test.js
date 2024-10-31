import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { Button as MockButton } from '@folio/stripes/components';
import { Button, renderWithIntl } from '@folio/stripes-erm-testing';

import { translationsProperties } from '../../../../test/helpers';
import {
  numberGenerator1 as mockNG,
} from '../../../../test/jest/mockGenerators';

import NumberGeneratorModal from './NumberGeneratorModal';

const callback = jest.fn();
const mockOnClick = jest.fn();

jest.mock('../NumberGeneratorSelector', () => ({ onSequenceChange }) => (
  <div>
    NumberGeneratorSelector
    <MockButton
      onClick={() => onSequenceChange(mockNG.sequences[0])}
    >
      ChangeSelector
    </MockButton>
  </div>
));

jest.mock('../NumberGeneratorButton', () => ({ callback: callbackProp, sequence }) => (
  <MockButton
    disabled={sequence === ''}
    onClick={() => {
      mockOnClick();
      callbackProp();
    }}
  >
    NumberGeneratorButton
  </MockButton>
));

const NumberGeneratorModalProps = {
  callback,
  generator: 'numberGen1',
  id: 'test',
  open: true
};

// This test is now remarkably small and ought to be improved to get test coverage up later...
describe('NumberGeneratorModal', () => {
  let renderedComponent;
  describe('NumberGeneratorModal with generator prop', () => {
    beforeEach(() => {
      renderedComponent = renderWithIntl(
        <NumberGeneratorModal
          {...NumberGeneratorModalProps}
        />,
        translationsProperties
      );
    });

    test('renders the button', async () => {
      await Button('NumberGeneratorButton').has({ disabled: true });
    });

    test('renders the selector Component', async () => {
      const { getByText } = renderedComponent;
      expect(getByText('NumberGeneratorSelector')).toBeInTheDocument();
    });

    describe('selecting a component', () => {
      beforeEach(async () => {
        await waitFor(async () => {
          await Button('ChangeSelector').click();
        });
      });

      test('button is no longer disabled', async () => {
        await Button('NumberGeneratorButton').has({ disabled: false });
      });

      describe('clicking generate button', () => {
        beforeEach(async () => {
          await waitFor(async () => {
            await Button('NumberGeneratorButton').click();
          });
        });

        test('passed callback gets called', async () => {
          await waitFor(() => {
            expect(callback.mock.calls.length).toBe(1);
          });
        });

        test('passed onClick gets called', async () => {
          await waitFor(() => {
            expect(mockOnClick.mock.calls.length).toBe(1);
          });
        });
      });
    });
  });
});
