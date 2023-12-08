import { waitFor, render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { Field as MockField } from 'react-final-form';

import { Button as MockButton, TextField as MockTextField } from '@folio/stripes/components';
import {
  Button,
  Callout,
  IconButton,
  MultiColumnListCell,
  MultiColumnListHeader,
  Select,
  TextField,
  renderWithIntl
} from '@folio/stripes-erm-testing';

import SequenceSearch from './SequenceSearch';
import { translationsProperties } from '../../../test/helpers';
import { numberGenerator1, numberGenerator2 } from '../../../test/jest/mockGenerators';

const push = jest.fn();
const changeGenerator = jest.fn();
const mockGenerators = [numberGenerator1, numberGenerator2];

const mockUseNumberGenerators = jest.fn(() => {
  return ({
    data: {
      results: mockGenerators
    },
    isLoading: false
  });
});

jest.mock('./SequenceView', () => (props) => {
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

jest.mock('../../public', () => {
  return ({
    ...jest.requireActual('../../public'),
    useNumberGenerators: (code) => mockUseNumberGenerators(code),
    useNumberGeneratorSequences: () => ({ data: { results: mockGenerators[0].sequences } }),
    useMutateNumberGeneratorSequence: ({ afterQueryCalls: { post: postQueryCalls } }) => ({
      post: () => Promise.resolve(true).then(() => postQueryCalls(mockGenerators[0], fakeCalloutInfo)),
    }),
  });
});

/* Overriding the default intl keys etc for use with kint components */
describe('SequenceSearch', () => {
  let renderComponent;
  beforeEach(async () => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <SequenceSearch
          baseUrl="baseUrl"
          changeGenerator={jest.fn()}
          history={{ push }}
          match={{ params: { numGenId: numberGenerator1.id }, url: 'someUrl' }}
          numberGenerators={mockGenerators}
        />
      </MemoryRouter>,
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
      await MultiColumnListHeader({ index: 2 }).has({ content: 'Enabled' }),
      await MultiColumnListHeader({ index: 3 }).has({ content: 'Next value' }),
      await MultiColumnListHeader({ index: 4 }).has({ content: 'Maximum number' }),
      await MultiColumnListHeader({ index: 5 }).has({ content: 'Health check' }),
    ]);
  });

  describe('Clicking a sequence', () => {
    beforeEach(async () => {
      // This is now a button with the name of the sequence the user is selecting
      await waitFor(async () => {
        await Button('sequence 1.1').click();
      });
    });

    test('history push gets called', () => {
      expect(push).toHaveBeenCalledWith('someUrl/ng1-seq1');
    });
  });

  describe('creating a sequence', () => {
    beforeEach(async () => {
      await waitFor(async () => {
        await Button('New').click();
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

      test('create callout fires', async () => {
        // EXAMPLE currently callout interactor doesn't notice variable insertion?
        await Callout('Number generator sequence <strong>{name}</strong> was successfully <strong>created</strong>.').exists();
      });
    });
  });

  describe('closing pane', () => {
    beforeEach(async () => {
      await waitFor(async () => {
        await IconButton('Close ').click();
      });
    });

    test('history push gets called', () => {
      expect(push).toHaveBeenCalledWith('baseUrl');
    });
  });
});
