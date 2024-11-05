import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { Field as MockField } from 'react-final-form';

import { TextField as MockTextField } from '@folio/stripes/components';

import { Button, Callout, KeyValue, TextField, renderWithIntl } from '@folio/stripes-erm-testing';

import SequenceView from './SequenceView';
import { translationsProperties } from '../../../test/helpers';
import { numberGenerator1, numberGenerator2 } from '../../../test/jest/mockGenerators';

const onClose = jest.fn();
const mockSequence = numberGenerator1?.sequences[0];
const mockGenerators = [numberGenerator1, numberGenerator2];

const fakeCalloutInfo = { id: '123', label: 'numgenName', code: 'numgenCode' };

jest.mock('../../public', () => ({
  ...jest.requireActual('../../public'),
  useNumberGeneratorSequence: jest.fn(() => ({ data: mockSequence })),
  useMutateNumberGeneratorSequence: ({ afterQueryCalls: { delete: deleteQueryCalls, put: putQueryCalls } }) => ({
    put: () => Promise.resolve(true).then(() => putQueryCalls(mockGenerators[0], fakeCalloutInfo)),
    delete: () => Promise.resolve(true).then(() => deleteQueryCalls()),
  }),
}));

/* EXAMPLE Mocking form modal by passing in intlKey to get around intl shenanigans */
/* This is no longer required because our default harness instead sets those up, with the ability to override with extraOptions */
/* jest.mock('@k-int/stripes-kint-components', () => {
  const { mockKintComponents } = jest.requireActual('@folio/stripes-erm-testing');
  const KintComps = jest.requireActual('@k-int/stripes-kint-components');

  return ({
    ...KintComps,
    ...mockKintComponents,
    FormModal: (fmProps) => <KintComps.FormModal {...fmProps} intlKey="ui-service-interaction" />
  });
}); */

jest.mock('./NumberGeneratorSequenceForm', () => () => {
  return (
    <>
      NumberGeneratorSequenceForm
      {/* Setting up mock field so we can edit/save formModal (Since we're using the real component for that) */}
      <MockField
        component={MockTextField}
        label="TEST FIELD"
        name="name"
      />
    </>
  );
});

let renderComponent;
describe('SequenceView', () => {
  beforeEach(async () => {
    renderComponent = renderWithIntl(
      <SequenceView
        match={{ params: { seqId: mockSequence?.id } }}
        onClose={onClose}
      />,
      translationsProperties,
      // Ensure right intl key is used in kint-comps
      {
        intlKey: 'ui-service-interaction',
        moduleName: '@folio/service-interaction'
      }
    );
  });

  test('renders expected sequence name', async () => {
    await KeyValue('Name').has({ value: 'sequence 1.1' });
  });

  test('renders expected sequence code', async () => {
    await KeyValue('Code').has({ value: 'seq1.1' });
  });

  test('renders expected sequence note', async () => {
    await KeyValue('Note').has({ value: 'this is a description' });
  });

  test('renders expected sequence checkDigitAlgo', async () => {
    await KeyValue('Checksum').has({ value: 'EAN13' });
  });

  test('renders expected sequence enabled', async () => {
    await KeyValue('Enabled').has({ value: 'True' });
  });

  test('renders expected sequence next value', async () => {
    await KeyValue('Next value').has({ value: '1' });
  });

  test('renders expected sequence format', async () => {
    await KeyValue('Format').has({ value: 'No value set-' });
  });

  test('renders expected sequence outputTemplate', async () => {
    // eslint-disable-next-line no-template-curly-in-string
    await KeyValue('Output template').has({ value: 'sequence-1.1-${generated_number}-${checksum}' });
  });

  test('renders action button with expected options', async () => {
    await Button('Actions').exists();
  });

  describe('actions', () => {
    beforeEach(async () => {
      await waitFor(async () => {
        await Button('Actions').click();
      });
    });

    describe('editing the sequence', () => {
      beforeEach(async () => {
        await waitFor(async () => {
          await Button('Edit').click();
        });
      });

      test('FormModal renders', async () => {
        const { getByText } = renderComponent;
        await waitFor(() => {
          expect(getByText('NumberGeneratorSequenceForm')).toBeInTheDocument();
        });
      });

      describe('saving the sequence', () => {
        beforeEach(async () => {
          await waitFor(async () => {
            await TextField('TEST FIELD').fillIn('new name');
            await Button('Save & close').click();
          });
        });

        test('edit callout fires', async () => {
          // EXAMPLE currently callout interactor doesn't notice variable insertion?
          await waitFor(async () => {
            await Callout('Number generator sequence <strong>{name}</strong> was successfully <strong>edited</strong>.').exists();
          });
        });
      });
    });

    describe('deleting the sequence', () => {
      beforeEach(async () => {
        await waitFor(async () => {
          await Button('Delete').click();
        });
      });

      test('Confirmation modal renders', async () => {
        const { getByText } = renderComponent;
        await waitFor(async () => {
          await expect(getByText('Number generator sequence <strong>{name}</strong> will be permanently <strong>deleted</strong>.', { exact: false })).toBeInTheDocument();
          await expect(getByText('The sequence may be in use in one or more apps. If in doubt, consider disabling the sequence instead.', { exact: false })).toBeInTheDocument();
        });
      });

      describe('clicking delete', () => {
        // Make sure we click the modal button
        beforeEach(async () => {
          await waitFor(async () => {
            await Button({ id: 'clickable-delete-sequence-confirm' }).click();
          });
        });

        test('delete callout fires', async () => {
          // EXAMPLE currently callout interactor doesn't notice variable insertion?
          await waitFor(async () => {
            await Callout('Number generator sequence <strong>{name}</strong> was successfully <strong>deleted</strong>.').exists();
          });
        });
      });

      describe('cancelling delete', () => {
        beforeEach(async () => {
          await waitFor(async () => {
            await Button('Cancel').click();
          });
        });

        test('confirmation modal no longer renders', async () => {
          const { queryByText } = renderComponent;
          await waitFor(() => {
            expect(queryByText('Number generator sequence <strong>{name}</strong> will be permanently <strong>deleted</strong>.', { exact: false })).not.toBeInTheDocument();
            expect(queryByText('The sequence may be in use in one or more apps. If in doubt, consider disabling the sequence instead.', { exact: false })).not.toBeInTheDocument();
          });
        });
      });
    });
  });
});
