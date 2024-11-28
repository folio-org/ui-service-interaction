import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import {
  Checkbox,
  Select,
  TestForm,
  TextArea,
  TextField,
} from '@folio/stripes-erm-testing';

import NumberGeneratorSequenceForm from './NumberGeneratorSequenceForm';
import { renderWithTranslations } from '../../../../test/helpers';
import refdata from '../../../../test/jest/refdata';
import { BASE_TEMPLATE } from '../../../public';

const onSubmit = jest.fn();

// Need to specify each manual mock I guess...
// TODO I think the agreements one is borked
jest.mock('../../../hooks/useSIRefdata/useSIRefdata');

describe('NumberGeneratorSequenceForm', () => {
  beforeEach(async () => {
    renderWithTranslations(
      <TestForm
        initialValues={{
          checkDigitAlgo: {
            id: refdata.find(rdc => rdc.desc === 'NumberGeneratorSequence.CheckDigitAlgo')
              ?.values?.find(rdv => rdv.value === 'none')
              ?.id
          }
        }}
        onSubmit={onSubmit}
      >
        <NumberGeneratorSequenceForm />
      </TestForm>,
    );
  });

  // TODO this test should also check infoPopovers are present
  // ALSO needs to check extra validate logic
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

  test('renders expected note field', async () => {
    await TextArea('Note').exists();
    // Force "parse" function to get triggered for test coverage
    await waitFor(async () => {
      await TextArea('Note').fillIn('this is a description');
    });
  });

  test('renders expected checkDigitAlgo field', async () => {
    await Select('Method*').exists();
  });

  // TODO this is only true where there's initialValues... perhaps fill out other options
  test('renders disabled preChecksumTemplate field', async () => {
    await TextArea('Input template').has({ disabled: true });
  });

  describe('choosing a checkDigitAlgo', () => {
    beforeEach(async () => {
      await waitFor(async () => {
        await Select('Method*').chooseAndBlur('31-RTL-mod10-I (EAN)');
      });
    });

    test('preChecksum field is no longer disabled', async () => {
      await waitFor(async () => {
        await TextArea('Input template').has({ disabled: false });
      });
    });

    test('preChecksum field get pre-filled with default template', async () => {
      await waitFor(async () => {
        await TextArea('Input template').has({ value: BASE_TEMPLATE });
      });
    });

    describe('choosing checkDigitAlgo none again', () => {
      beforeEach(async () => {
        await waitFor(async () => {
          await Select('Method*').chooseAndBlur('None');
        });
      });

      test('preChecksum field is once more disabled', async () => {
        await waitFor(async () => {
          await TextArea('Input template').has({ disabled: true });
        });
      });

      test('preChecksum field has been emptied', async () => {
        await waitFor(async () => {
          await TextArea('Input template').has({ value: '' });
        });
      });
    });
  });

  test('renders expected format field', async () => {
    await TextField('Format').exists();
    // Force "parse" function to get triggered for test coverage
    await waitFor(async () => {
      await TextField('Format').fillIn('this is a format');
    });
  });

  test('renders expected output template field', async () => {
    await TextArea('Output template*').exists();
    // Force "parse" function to get triggered for test coverage
    await waitFor(async () => {
      await TextArea('Output template*').fillIn('this is an output template');
    });
  });

  describe('validating next value', () => {
    beforeEach(async () => {
      await waitFor(async () => {
        await TextField('Next value').fillIn('0');
        await Select('Method*').chooseAndBlur('31-RTL-mod10-I (EAN)');
      });
    });

    test('renders validation error', async () => {
      await Select('Method*').has({ error: 'Using a checksum with a value < 1 is not supported.' });
    });
  });
});
