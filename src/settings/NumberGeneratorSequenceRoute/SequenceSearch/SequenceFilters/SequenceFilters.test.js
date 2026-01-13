import { useState } from 'react';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';

import { KeyValue as KeyValueComponent } from '@folio/stripes/components';
import {
  Badge,
  KeyValue,
  Select,
} from '@folio/stripes-erm-testing';

import SequenceFilters from './SequenceFilters';
import { renderWithTranslations } from '../../../../../test/helpers';

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

describe('SequenceFilters', () => {
  beforeEach(async () => {
    renderWithTranslations(
      <TestComponent totalCount={8} />,
    );
  });

  test('renders expected total count badge', async () => {
    await Badge().has({ value: '8 found' });
  });

  describe.each([
    {
      selectLabel: enabledLabel,
      selectOptions: [
        { label: 'All', isDefault: true, selectedJSON: '{}' },
        { label: 'True', selectedJSON: '{"enabled":["true"]}' },
        { label: 'False', selectedJSON: '{"enabled":["false"]}' }
      ],
    },
    {
      selectLabel: usageStatusLabel,
      selectOptions: [
        { label: 'All', isDefault: true, selectedJSON: '{}' },
        { label: 'At maximum', selectedJSON: '{"maximumCheck":["maximumCheck.value==at_maximum"]}' },
        { label: 'Below threshold', selectedJSON: '{"maximumCheck":["maximumCheck.value==below_threshold"]}' },
        { label: 'Over threshold', selectedJSON: '{"maximumCheck":["maximumCheck.value==over_threshold"]}' },
        { label: 'No threshold set', selectedJSON: '{"maximumCheck":["maximumCheck isNull"]}' }
      ],
    }
  ])('$selectLabel select', ({ selectLabel, selectOptions }) => {
    const expectedDefault = selectOptions.find(so => so.isDefault).label;
    const firstNonDefaultOption = selectOptions.find(so => !so.isDefault).label;

    test(`renders expected ${selectLabel} select with expected default: ${expectedDefault}`, async () => {
      await Select(selectLabel).exists();
      await Select(selectLabel).has({ selectedContent: expectedDefault });
    });

    describe.each(selectOptions)(`choosing ${selectLabel} option $label`, ({ label, isDefault, selectedJSON }) => {
      beforeEach(async () => {
        if (isDefault) {
          // For the default we need to briefly switch away and back again
          await waitFor(async () => {
            await Select(selectLabel).choose(firstNonDefaultOption);
          });
        }

        await waitFor(async () => {
          await Select(selectLabel).choose(label);
        });
      });

      test('JSON Filters are as expected', async () => {
        await KeyValue(KVLabel).has({ value: selectedJSON });
      });
    });
  });
});
