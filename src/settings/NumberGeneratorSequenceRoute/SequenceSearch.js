import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import { FormModal, generateKiwtQueryParams, useKiwtSASQuery } from '@k-int/stripes-kint-components';

import { useCallout } from '@folio/stripes/core';
import { SearchAndSortQuery } from '@folio/stripes/smart-components';
import {
  Button,
  KeyValue,
  MultiColumnList,
  Pane,
  PaneHeader,
  Select
} from '@folio/stripes/components';
import { useSASQQIndex } from '@folio/stripes-erm-components';

import { useMutateNumberGeneratorSequence, useNumberGeneratorSequences } from '../../public';
import NumberGeneratorSequenceForm from './NumberGeneratorSequenceForm';

const SequenceSearch = ({
  baseUrl,
  changeGenerator,
  history,
  match: {
    params: {
      numGenId
    },
    url,
  },
  numberGenerators
}) => {
  const callout = useCallout();
  const { query, queryGetter, querySetter } = useKiwtSASQuery();
  const { searchKey } = useSASQQIndex({ defaultQIndex: 'name,code,outputTemplate' });

  const queryParams = useMemo(
    () => generateKiwtQueryParams(
      {
        searchKey,
        filters: [
          {
            path: 'owner.id',
            value: numGenId
          }
        ]
      },
      query ?? {}
    ),
    [numGenId, query, searchKey]
  );

  const { data: { results: sequences = [] } = {} } = useNumberGeneratorSequences({
    queryParams,
    queryOptions: {
      enabled: !!numGenId
    },
  });

  const [creating, setCreating] = useState(false);

  const {
    post: addSeq,
  } = useMutateNumberGeneratorSequence({
    afterQueryCalls: {
      post: (res, postValues) => {
        setCreating(false);
        callout.sendCallout({
          message: <FormattedMessage
            id="ui-service-interaction.settings.numberGeneratorSequences.callout.create"
            values={{ name: postValues.code }}
          />
        });
      },
    },
    id: numGenId
  });

  // SonarLint "Do not define components during render" nonsense to remove all code "smells" before submitting for TCA
  const renderEnabled = useCallback((rowData) => (
    rowData?.enabled ?
      <FormattedMessage id="ui-service-interaction.true" /> :
      <FormattedMessage id="ui-service-interaction.false" />
  ), []);

  const renderNextValue = useCallback((rowData) => (
    rowData.nextValue ?? 0
  ), []);

  const renderName = useCallback((rowData) => {
    return (
      <Button
        buttonStyle="link"
        marginBottom0
        onClick={() => history.push(`${url}/${rowData.id}`)}
      >
        {rowData.name}
      </Button>
    );
  }, [history, url]);

  return (
    <>
      <SearchAndSortQuery
        initialFilterState={{ }}
        initialSortState={{ sort: 'name' }}
        queryGetter={queryGetter}
        querySetter={querySetter}
        syncToLocationSearch
      >
        {({
          searchValue,
          getSearchHandlers,
          onSubmitSearch,
          onSort,
          getFilterHandlers,
          activeFilters,
          filterChanged,
          searchChanged,
          resetAll,
        }) => {
          return (
            <>
              <Pane
                defaultWidth="fill"
                id="settings-numberGeneratorSequences-list"
                renderHeader={(renderProps) => (
                  <PaneHeader
                    {...renderProps}
                    dismissible
                    lastMenu={
                      <Button
                        buttonStyle="primary"
                        marginBottom0
                        onClick={() => setCreating(true)}
                      >
                        <FormattedMessage id="ui-service-interaction.new" />
                      </Button>
                    }
                    onClose={() => history.push(baseUrl)}
                    paneTitle={<FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences" />}
                  />
                )}
              >
                <Select
                  dataOptions={numberGenerators?.map(ng => ({ value: ng.id, label: ng.name }))}
                  label={<FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.generator" />}
                  onChange={e => {
                    changeGenerator(e.target.value);
                  }}
                  value={numGenId}
                />
                <KeyValue
                  label={<FormattedMessage id="ui-service-interaction.settings.numberGenerators.sequences" />}
                  value={
                    <MultiColumnList
                      columnMapping={{
                        name: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.name" />,
                        code: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.code" />,
                        enabled: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.enabled" />,
                        nextValue: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.nextValue" />,
                      }}
                      contentData={sequences}
                      formatter={{
                        name: renderName,
                        enabled: renderEnabled,
                        nextValue: renderNextValue,
                      }}
                      id="number-generator-sequences"
                      interactive={false}
                      visibleColumns={['name', 'code', 'nextValue', 'enabled']}
                    />
                  }
                />
              </Pane>
            </>
          );
        }}
      </SearchAndSortQuery>
      {creating &&
        <FormModal
          initialValues={{
            nextValue: 1,
          }}
          modalProps={{
            dismissible: true,
            label: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.newModal" />,
            onClose: () => setCreating(false),
            open: creating
          }}
          onSubmit={addSeq}
        >
          <NumberGeneratorSequenceForm />
        </FormModal>
      }
    </>
  );
};

SequenceSearch.propTypes = {
  baseUrl: PropTypes.string,
  changeGenerator: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      numGenId: PropTypes.string,
    }),
    url: PropTypes.string.isRequired
  }),
  numberGenerators: PropTypes.arrayOf(PropTypes.object)
};

export default SequenceSearch;
