import { KeyValue } from '@folio/stripes-testing';
import { renderWithIntl } from '@folio/stripes-erm-testing';

import NumberGeneratorSequence from './NumberGeneratorSequence';
import { translationsProperties } from '../../test/helpers';
import { numberGenerator1 } from '../../test/jest/mockGenerators';

const onClose = jest.fn();
const onDelete = jest.fn();
const setEditing = jest.fn();

describe('NumberGeneratorSequence', () => {
  beforeEach(async () => {
    renderWithIntl(
      <NumberGeneratorSequence
        onClose={onClose}
        onDelete={onDelete}
        sequence={numberGenerator1?.sequences[0]}
        setEditing={setEditing}
      />,
      translationsProperties,
    );
  });

  test('renders expected sequence name', async () => {
    await KeyValue('Name').has({ value: 'sequence 1.1' });
  });

  test('renders expected sequence code', async () => {
    await KeyValue('Code').has({ value: 'seq1.1' });
  });

  test('renders expected sequence description', async () => {
    await KeyValue('Description').has({ value: 'this is a description' });
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
});
