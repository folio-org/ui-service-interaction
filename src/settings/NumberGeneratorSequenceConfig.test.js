import { waitFor } from '@testing-library/dom';
import { render } from '@testing-library/react';

import { Field as MockField } from 'react-final-form';

import { Button as MockButton, TextField as MockTextField } from '@folio/stripes/components';
import { Button, Callout, MultiColumnList, MultiColumnListCell, MultiColumnListHeader, Select, TextField } from '@folio/stripes-testing';
import { IconButtonInteractor, renderWithIntl } from '@folio/stripes-erm-testing';

import NumberGeneratorSequenceConfig from './NumberGeneratorSequenceConfig';
import { translationsProperties } from '../../test/helpers';
import { numberGenerator1, numberGenerator2 } from '../../test/jest/mockGenerators';

const push = jest.fn();
const mockGenerators = [numberGenerator1, numberGenerator2];

const mockUseNumberGenerators = jest.fn(() => {
  return ({
    data: {
      results: mockGenerators
    },
    isLoading: false
  });
});

jest.mock('./NumberGeneratorSequence', () => (props) => {
  return (
    <div>
      NumberGeneratorSequence
      <MockButton
        onClick={props.onClose}
      >
        CloseSequence
      </MockButton>
      <MockButton
        onClick={props.onDelete}
      >
        DeleteSequence
      </MockButton>
      <MockButton
        onClick={props.setEditing}
      >
        EditSequence
      </MockButton>
    </div>
  );
});

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

const fakeCalloutInfo = { id: '123', label: 'numgenName', code: 'numgenCode' };

jest.mock('../public', () => {
  return ({
    ...jest.requireActual('../public'),
    useNumberGenerators: (code) => mockUseNumberGenerators(code),
    useMutateNumberGeneratorSequence: ({ afterQueryCalls: { delete: deleteQueryCalls, post: postQueryCalls, put: putQueryCalls } }) => ({
      post: () => Promise.resolve(true).then(() => postQueryCalls(mockGenerators[0], fakeCalloutInfo)),
      put: () => Promise.resolve(true).then(() => putQueryCalls(mockGenerators[0], fakeCalloutInfo)),
      delete: () => Promise.resolve(true).then(() => deleteQueryCalls()),
    }),
  });
});

/* Overriding the default intl keys etc for use with kint components */
describe('NumberGeneratorSequenceConfig', () => {
  let renderComponent;
  beforeEach(async () => {
    renderComponent = renderWithIntl(
      <NumberGeneratorSequenceConfig
        history={{ push }}
        match={{ url: 'someUrl' }}
      />,
      translationsProperties,
      render,
      {
        intlKey: 'ui-service-interaction',
        moduleName: '@folio/service-interaction'
      }
    );
  });

  test('Select is rendered with default number generator', async () => {
    await Select('Generator').has({ value: 'number-generator-1' });
  });

  test('MultiColumnList is rendered', async () => {
    Promise.all([
      await MultiColumnListHeader({ index: 0 }).has({ content: 'Name' }),
      await MultiColumnListHeader({ index: 1 }).has({ content: 'Code' }),
      await MultiColumnListHeader({ index: 2 }).has({ content: 'Next value' }),
      await MultiColumnListHeader({ index: 3 }).has({ content: 'Enabled' }),
    ]);
  });

  test('MultiColumnList contains expected values', async () => {
    // First sequence
    await MultiColumnListCell({ row: 0, columnIndex: 0 }).has({ content: 'sequence 1.1' });
    await MultiColumnListCell({ row: 0, columnIndex: 1 }).has({ content: 'seq1.1' });
    await MultiColumnListCell({ row: 0, columnIndex: 2 }).has({ content: '1' });
    await MultiColumnListCell({ row: 0, columnIndex: 3 }).has({ content: 'True' });

    // Second sequence
    await MultiColumnListCell({ row: 1, columnIndex: 0 }).has({ content: 'sequence 1.2' });
    await MultiColumnListCell({ row: 1, columnIndex: 1 }).has({ content: 'seq1.2' });
    await MultiColumnListCell({ row: 1, columnIndex: 2 }).has({ content: '1092' });
    await MultiColumnListCell({ row: 1, columnIndex: 3 }).has({ content: 'True' });

    // Third sequence
    await MultiColumnListCell({ row: 2, columnIndex: 0 }).has({ content: '' });
    await MultiColumnListCell({ row: 2, columnIndex: 1 }).has({ content: 'seq1.3' });
    await MultiColumnListCell({ row: 2, columnIndex: 2 }).has({ content: '1' });
    await MultiColumnListCell({ row: 2, columnIndex: 3 }).has({ content: 'True' });
  });

  describe('Choosing another sequence', () => {
    beforeEach(async () => {
      await Select('Generator').choose('Number generator 2');
    });

    test('MultiColumnList contains expected values', async () => {
      // First sequence
      await MultiColumnListCell({ row: 0, columnIndex: 0 }).has({ content: 'sequence 2.1' });
      await MultiColumnListCell({ row: 0, columnIndex: 1 }).has({ content: 'seq2.1' });
      await MultiColumnListCell({ row: 0, columnIndex: 2 }).has({ content: '103' });
      await MultiColumnListCell({ row: 0, columnIndex: 3 }).has({ content: 'True' });

      // Second sequence
      await MultiColumnListCell({ row: 1, columnIndex: 0 }).has({ content: 'sequence 2.3' });
      await MultiColumnListCell({ row: 1, columnIndex: 1 }).has({ content: 'seq2.3' });
      await MultiColumnListCell({ row: 1, columnIndex: 2 }).has({ content: '1' });
      await MultiColumnListCell({ row: 1, columnIndex: 3 }).has({ content: 'True' });

      // Third sequence
      await MultiColumnListCell({ row: 2, columnIndex: 0 }).has({ content: 'sequence 2.2' });
      await MultiColumnListCell({ row: 2, columnIndex: 1 }).has({ content: 'seq2.2' });
      await MultiColumnListCell({ row: 2, columnIndex: 2 }).has({ content: '74' });
      await MultiColumnListCell({ row: 2, columnIndex: 3 }).has({ content: 'False' });
    });
  });

  describe('Clicking a sequence', () => {
    beforeEach(async () => {
      await MultiColumnList().click({ row: 0, column: 0 });
    });

    test('NumberGeneratorSequence gets rendered', () => {
      const { getByText } = renderComponent;
      expect(getByText('NumberGeneratorSequence')).toBeInTheDocument();
    });

    describe('closing the sequence', () => {
      let numSequenceComponent;
      beforeEach(async () => {
        const { getByText } = renderComponent;
        numSequenceComponent = getByText('NumberGeneratorSequence');
        await Button('CloseSequence').click();
      });

      test('NumberGeneratorSequence no longer renders', () => {
        expect(numSequenceComponent).not.toBeInTheDocument();
      });
    });

    describe('deleting the sequence', () => {
      beforeEach(async () => {
        await Button('DeleteSequence').click();
      });

      test('Confirmation modal renders', () => {
        const { getByText } = renderComponent;
        expect(getByText('Number generator sequence <strong>{name}</strong> will be permanently <strong>deleted</strong>.', { exact: false })).toBeInTheDocument();
        expect(getByText('The sequence may be in use in one or more apps. If in doubt, consider disabling the sequence instead.', { exact: false })).toBeInTheDocument();
      });

      describe('clicking delete', () => {
        beforeEach(async () => {
          await Button('Delete').click();
        });

        test('delete callout fires', async () => {
          // EXAMPLE currently callout interactor doesn't notice variable insertion?
          await Callout('Number generator sequence <strong>{name}</strong> was successfully <strong>deleted</strong>.').exists();
        });
      });

      describe('cancelling delete', () => {
        beforeEach(async () => {
          await Button('Cancel').click();
        });

        test('confirmation modal no longer renders', async () => {
          await Button('Cancel').absent();
        });
      });
    });

    describe('editing the sequence', () => {
      beforeEach(async () => {
        await Button('EditSequence').click();
      });

      test('FormModal renders', () => {
        const { getByText } = renderComponent;
        expect(getByText('NumberGeneratorSequenceForm')).toBeInTheDocument();
      });

      describe('saving the sequence', () => {
        beforeEach(async () => {
          await TextField('TEST FIELD').fillIn('new name');
          await waitFor(async () => {
            await Button('Save & close').click();
          });
        });

        test('edit callout fires', async () => {
          // EXAMPLE currently callout interactor doesn't notice variable insertion?
          await Callout('Number generator sequence <strong>{name}</strong> was successfully <strong>edited</strong>.').exists();
        });
      });
    });
  });

  describe('creating a sequence', () => {
    beforeEach(async () => {
      await Button('New').click();
    });

    test('FormModal renders', () => {
      const { getByText } = renderComponent;
      expect(getByText('NumberGeneratorSequenceForm')).toBeInTheDocument();
    });

    describe('saving the sequence', () => {
      beforeEach(async () => {
        await TextField('TEST FIELD').fillIn('new name');
        await waitFor(async () => {
          await Button('Save & close').click();
        });
      });

      test('edit callout fires', async () => {
        // EXAMPLE currently callout interactor doesn't notice variable insertion?
        await Callout('Number generator sequence <strong>{name}</strong> was successfully <strong>created</strong>.').exists();
      });
    });
  });

  describe('closing pane', () => {
    beforeEach(async () => {
      await IconButtonInteractor('Close ').click();
    });

    test('history push gets called', () => {
      expect(push).toHaveBeenCalledWith('someUrl');
    });
  });
});
