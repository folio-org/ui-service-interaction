import { useState } from 'react';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';

import { KeyValue as KeyValueComponent } from '@folio/stripes/components';
import {
  Badge,
  KeyValue,
  renderWithIntl,
  Select,
} from '@folio/stripes-erm-testing';

import { translationsProperties } from '../../../test/helpers';
import SequenceFilters from './SequenceFilters';

const KVLabel = 'JSON FILTERS';
const enabledLabel = 'Enabled';
const usageStatusLabel = 'Usage status';

// Set up proxy of filter handlers so we can test what the component does when adding/removing them
const TestComponent = (props) => {
  const [activeFilters, setActiveFilters] = useState({});
  const filterHandlers = {
    state: setActiveFilters
  };

  const activeFiltersString = JSON.stringify(activeFilters);

  return (
    <>
      <SequenceFilters
        activeFilters={activeFilters}
        filterHandlers={filterHandlers}
        {...props}
      />
      <KeyValueComponent
        label={KVLabel}
        value={activeFiltersString}
      />
    </>
  );
};

const runSelectTest = (selectLabel, selectChoice, expectedJSON, initialValue = null) => {
  return describe(`Selecting ${selectLabel} ${selectChoice}`, () => {
    beforeEach(async () => {
      // Allow an initial select before the one we're testing (Needed for default cases to select away and back)
      if (initialValue) {
        await waitFor(async () => {
          await Select(selectLabel).choose(initialValue);
        });
      }

      await waitFor(async () => {
        await Select(selectLabel).choose(selectChoice);
      });
    });

    test('JSON Filters are as expected', async () => {
      await KeyValue(KVLabel).has({ value: expectedJSON });
    });
  });
};

describe('SequenceFilters', () => {
  beforeEach(async () => {
    renderWithIntl(
      <TestComponent totalCount={8} />,
      translationsProperties,
    );
  });

  test('renders expected total count badge', async () => {
    await Badge().has({ value: '8 found' });
  });

  test('renders expected Enabled select with expected default', async () => {
    await Select(enabledLabel).exists();
    await Select(enabledLabel).has({ selectedContent: 'All' });
  });

  test('Enabled select has expected options', async () => {
    await waitFor(async () => {
      await Select(enabledLabel).choose('All');
    });

    await waitFor(async () => {
      await Select(enabledLabel).choose('True');
    });

    await waitFor(async () => {
      await Select(enabledLabel).choose('False');
    });
  });

  test('renders expected Usage status select with expected default', async () => {
    await Select(usageStatusLabel).exists();
    await Select(usageStatusLabel).has({ selectedContent: 'All' });
  });

  test('Usage status select has expected options', async () => {
    await waitFor(async () => {
      await Select(usageStatusLabel).choose('All');
    });

    await waitFor(async () => {
      await Select(usageStatusLabel).choose('At maximum');
    });

    await waitFor(async () => {
      await Select(usageStatusLabel).choose('Below threshold');
    });

    await waitFor(async () => {
      await Select(usageStatusLabel).choose('Over threshold');
    });

    await waitFor(async () => {
      await Select(usageStatusLabel).choose('No maximum set');
    });
  });

  // Tests for Enabled
  runSelectTest(enabledLabel, 'All', '{}', 'True');
  runSelectTest(enabledLabel, 'True', '{"enabled":["true"]}');
  runSelectTest(enabledLabel, 'False', '{"enabled":["false"]}');

  // Tests for Usage status
  runSelectTest(usageStatusLabel, 'All', '{}', 'At maximum');
  runSelectTest(usageStatusLabel, 'At maximum', '{"maximumCheck":["maximumCheck.value==at_maximum"]}');
  runSelectTest(usageStatusLabel, 'Below threshold', '{"maximumCheck":["maximumCheck.value==below_threshold"]}');
  runSelectTest(usageStatusLabel, 'Over threshold', '{"maximumCheck":["maximumCheck.value==over_threshold"]}');
  runSelectTest(usageStatusLabel, 'No maximum set', '{"maximumCheck":["maximumCheck isNull"]}');
});
