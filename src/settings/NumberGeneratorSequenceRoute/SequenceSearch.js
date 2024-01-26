import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import {
  FormModal,
  SearchField,
  generateKiwtQueryParams,
  useKiwtSASQuery
} from '@k-int/stripes-kint-components';

import { useCallout } from '@folio/stripes/core';
import { SearchAndSortQuery } from '@folio/stripes/smart-components';
import {
  Accordion,
  Button,
  KeyValue,
  MultiColumnList,
  Pane,
  PaneHeader,
  Select
} from '@folio/stripes/components';

import {
  InfoBox,
  SearchKeyControl,
  useHandleSubmitSearch,
  useSASQQIndex
} from '@folio/stripes-erm-components';

import {
  useMutateNumberGeneratorSequence,
  useNumberGeneratorSequences
} from '../../public';
import NumberGeneratorSequenceForm from './NumberGeneratorSequenceForm';

import css from './SequenceSearch.css';

const SequenceSearch = ({
  baseUrl,
  changeGenerator,
  history,
  location,
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
  const { qIndexChanged, qIndexSASQProps, searchKey } = useSASQQIndex({ defaultQIndex: 'name,code,outputTemplate' });

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

  const {
    data: {
      results: sequences = [],
      totalRecords: totalCount = 0
    } = {},
    error,
    isLoading,
    isError
  } = useNumberGeneratorSequences({
    queryParams,
    queryOptions: {
      enabled: !!numGenId
    },
  });

  const { handleSubmitSearch } = useHandleSubmitSearch({
    // Fake source from useQuery return values;
    totalCount: () => totalCount,
    loaded: () => !isLoading,
    pending: () => isLoading,
    failure: () => isError,
    failureMessage: () => error.message,
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

  const renderMaximumNumber = useCallback((rowData) => (
    rowData.maximumNumber
  ), []);

  const renderName = useCallback((rowData) => {
    return (
      <Button
        buttonStyle="link"
        marginBottom0
        onClick={() => history.push(`${url}/${rowData.id}${location.search}`)}
      >
        {rowData.name}
      </Button>
    );
  }, [history, url]);

  const renderHealthCheck = useCallback((rowData) => {
    if (rowData.maximumCheck?.value === 'at_maximum') {
      return (
        <InfoBox
          className={css.noMarginLeft}
          type="error"
        >
          <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.maximumCheck.atMax" />
        </InfoBox>
      );
    }

    if (rowData.maximumCheck?.value === 'over_threshold') {
      return (
        <InfoBox
          className={css.noMarginLeft}
          type="warn"
        >
          <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.maximumCheck.overThreshold" />
        </InfoBox>
      );
    }

    if (rowData.maximumCheck?.value === 'below_threshold') {
      return (
        <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.maximumCheck.belowThreshold" />
      );
    }

    return null;
  }, []);

  return (
    <>
      <SearchAndSortQuery
        {...qIndexSASQProps}
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
          const disableReset = () => !filterChanged && !searchChanged && !qIndexChanged;

          return (
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
              <Accordion
                id="numgen-sequence-search-sequences"
                label={<FormattedMessage id="ui-service-interaction.settings.numberGenerators.sequences" />}
              >
                <form
                  onSubmit={(e) => handleSubmitSearch(e, onSubmitSearch)}
                >
                  <SearchField
                    data-test-sequence-search-input
                    id="input-sequence-search"
                    marginBottom0
                    name="query"
                    onChange={getSearchHandlers().query}
                    onClear={getSearchHandlers().reset}
                    value={searchValue.query}
                  />
                  {/* The options here reflect the constant defaultQIndex */}
                  <SearchKeyControl
                    options={[
                      {
                        label: (
                          <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.name" />
                        ),
                        key: 'name',
                      },
                      {
                        label: (
                          <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.code" />
                        ),
                        key: 'code',
                      },
                      {
                        label: (
                          <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.description" />
                        ),
                        key: 'description',
                      },
                      {
                        label: (
                          <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.outputTemplate" />
                        ),
                        key: 'outputTemplate',
                      },
                    ]}
                  />
                  <Button
                    buttonStyle="primary"
                    disabled={
                      !searchValue.query || searchValue.query === ''
                    }
                    fullWidth
                    id="clickable-search-sequences"
                    marginBottom0
                    type="submit"
                  >
                    <FormattedMessage id="stripes-smart-components.search" />
                  </Button>
                </form>
                <MultiColumnList
                  columnMapping={{
                    name: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.name" />,
                    code: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.code" />,
                    enabled: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.enabled" />,
                    nextValue: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.nextValue" />,
                    maximumNumber: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.maximumNumber" />,
                    healthCheck: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.maximumCheck" />,
                  }}
                  contentData={sequences}
                  formatter={{
                    name: renderName,
                    enabled: renderEnabled,
                    nextValue: renderNextValue,
                    maximumNumber: renderMaximumNumber,
                    healthCheck: renderHealthCheck
                  }}
                  id="number-generator-sequences"
                  interactive={false}
                  visibleColumns={['name', 'code', 'enabled', 'nextValue', 'maximumNumber', 'healthCheck']}
                />
              </Accordion>
            </Pane>
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
  location: PropTypes.shape({
    search: PropTypes.string,
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
