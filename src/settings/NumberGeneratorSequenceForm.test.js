import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import {
  Checkbox,
  renderWithIntl,
  Select,
  TestForm,
  TextArea,
  TextField,
} from '@folio/stripes-erm-testing';

import { translationsProperties } from '../../test/helpers';
import NumberGeneratorSequenceForm from './NumberGeneratorSequenceForm';

const onSubmit = jest.fn();

jest.mock('../hooks/useSIRefdata');

describe('NumberGeneratorSequenceForm', () => {
  beforeEach(async () => {
    renderWithIntl(
      <TestForm onSubmit={onSubmit}>
        <NumberGeneratorSequenceForm />
      </TestForm>,
      translationsProperties,
    );
  });

  test('renders expected name field', async () => {
    await TextField('Name*').exists();
  });

  test('renders expected code field', async () => {
    await TextField('Code*').exists();
  });

  test('renders expected enabled field', async () => {
    await Checkbox('Enabled').exists();
  });

  test('renders expected next value field', async () => {
    await TextField('Next value').exists();
  });

  test('renders expected description field', async () => {
    await TextArea('Description').exists();
    // Force "parse" function to get triggered for test coverage
    await waitFor(async () => {
      await TextArea('Description').fillIn('this is a description');
    });
  });

  test('renders expected checkDigitAlgo field', async () => {
    await Select('Checksum*').exists();
  });

  test('renders expected format field', async () => {
    await TextField('Format').exists();
    // Force "parse" function to get triggered for test coverage
    await waitFor(async () => {
      await TextField('Format').fillIn('this is a format');
    });
  });

  test('renders expected output template field', async () => {
    await TextArea('Output template').exists();
    // Force "parse" function to get triggered for test coverage
    await waitFor(async () => {
      await TextArea('Output template').fillIn('this is an output template');
    });
  });

  describe('validating next value', () => {
    beforeEach(async () => {
      await waitFor(async () => {
        await TextField('Next value').fillIn('0');
        await Select('Checksum*').chooseAndBlur('EAN13');
      });
    });

    test('renders validation error', async () => {
      await Select('Checksum*').has({ error: 'Using a checksum with a value < 1 is not supported.' });
    });
  });
});
