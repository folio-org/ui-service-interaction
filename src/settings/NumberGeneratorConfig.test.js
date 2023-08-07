import { waitFor } from '@folio/jest-config-stripes/testing-library/react';

import { Button as MockButton } from '@folio/stripes/components';
import {
  Button,
  Callout,
  IconButton,
  renderWithIntl
} from '@folio/stripes-erm-testing';

import NumberGeneratorConfig from './NumberGeneratorConfig';
import { translationsProperties } from '../../test/helpers';
import { numberGenerator1, numberGenerator2 } from '../../test/jest/mockGenerators';

const push = jest.fn();
const mockUseNumberGenerators = jest.fn((code) => {
  let generators = [];
  if (!code) {
    generators = [numberGenerator1, numberGenerator2];
  } else {
    generators = [numberGenerator1];
  }

  return ({
    data: {
      results: generators
    },
    isLoading: false
  });
});

const fakeCalloutInfo = { id: '123', label: 'numgenName', code: 'numgenCode' };

jest.mock('../public', () => {
  return ({
    ...jest.requireActual('../public'),
    useNumberGenerators: (code) => mockUseNumberGenerators(code),
    useMutateNumberGenerator: ({ afterQueryCalls: { delete: deleteQueryCalls, post: postQueryCalls, put: putQueryCalls } }) => ({
      post: () => Promise.resolve(true).then(() => postQueryCalls(fakeCalloutInfo)),
      put: () => Promise.resolve(true).then(() => putQueryCalls(fakeCalloutInfo)),
      delete: () => Promise.resolve(true).then(() => deleteQueryCalls()),
    }),
  });
});


// EXAMPLE: We're going to mock ActionList to test the callouts handed to the edit/create/delete functions in actionAssigner
jest.mock('@k-int/stripes-kint-components', () => {
  const { mockStripesKintComponents } = jest.requireActual('@folio/stripes-erm-testing');

  return ({
    ...jest.requireActual('@k-int/stripes-kint-components'),
    ...mockStripesKintComponents,
    ActionList: ({ actionAssigner, createCallback }) => {
      const actions = actionAssigner();
      const editAction = actions?.find(action => action?.name === 'edit');
      const deleteAction = actions?.find(action => action?.name === 'delete');

      return (
        <div>
          ActionList {/* Text to ensure it renders */}
          {
            /*
             * We have callouts on edit/delete,
             * mock buttons using callbacks to
             * test those fire
             */
          }
          <MockButton
            onClick={() => editAction?.callback()}
          >
            EditButton
          </MockButton>
          <MockButton
            onClick={() => deleteAction?.callback(fakeCalloutInfo)} // Set the remove id for the confirmation modal
          >
            DeleteButton
          </MockButton>
          <MockButton
            onClick={() => createCallback()}
          >
            CreateButton
          </MockButton>
        </div>
      );
    },
  });
});

describe('NumberGeneratorConfig', () => {
  let renderComponent;
  beforeEach(async () => {
    renderComponent = renderWithIntl(
      <NumberGeneratorConfig
        history={{ push }}
        match={{ url: 'someUrl' }}
      />,
      translationsProperties
    );
  });

  test('ActionList is rendered', () => {
    const { getByText } = renderComponent;
    expect(getByText('ActionList')).toBeInTheDocument();
  });

  describe('edit', () => {
    beforeEach(async () => {
      await waitFor(async () => {
        await Button('EditButton').click();
      });
    });

    test('edit callback is fired', async () => {
      // EXAMPLE currently callout interactor doesn't notice variable insertion?
      await Callout('Number generator <strong>{name}</strong> was successfully <strong>edited</strong>.').exists();
    });
  });

  describe('create', () => {
    beforeEach(async () => {
      await waitFor(async () => {
        await Button('CreateButton').click();
      });
    });

    test('create callback is fired', async () => {
      // EXAMPLE currently callout interactor doesn't notice variable insertion?
      await Callout('Number generator <strong>{name}</strong> was successfully <strong>created</strong>.').exists();
    });
  });

  describe('delete', () => {
    beforeEach(async () => {
      await waitFor(async () => {
        await Button('DeleteButton').click();
      });
    });

    test('confirmation modal renders', async () => {
      const { getByText } = renderComponent;
      await waitFor(() => {
        expect(getByText('Number generator <strong>{name}</strong> will be permanently <strong>deleted</strong>.')).toBeInTheDocument();
      });
    });

    describe('confirming delete in modal', () => {
      beforeEach(async () => {
        await waitFor(async () => {
          await Button('Delete').click();
        });
      });

      test('delete callback is fired', async () => {
        // EXAMPLE currently callout interactor doesn't notice variable insertion?
        await Callout('Number generator <strong>{name}</strong> was successfully <strong>deleted</strong>.').exists();
      });
    });

    describe('cancelling delete in modal', () => {
      beforeEach(async () => {
        await waitFor(async () => {
          await Button('Cancel').click();
        });
      });

      test('confirmation modal no longer renders', async () => {
        const { queryByText } = renderComponent;
        await waitFor(() => {
          expect(queryByText('Number generator <strong>{name}</strong> will be permanently <strong>deleted</strong>.')).not.toBeInTheDocument();
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
        expect(push).toHaveBeenCalledWith('someUrl');
      });
    });
  });
});
