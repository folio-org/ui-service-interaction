import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import {
  FormModal,
  generateKiwtQueryParams,
  useKiwtSASQuery
} from '@k-int/stripes-kint-components';

import { useCallout, useStripes } from '@folio/stripes/core';
import { SearchAndSortQuery } from '@folio/stripes/smart-components';
import {
  Accordion,
  Button,
  MultiColumnList,
  Pane,
  PaneHeader,
  Select
} from '@folio/stripes/components';

import {
  InfoBox,
  usePrevNextPagination,
  useSASQQIndex
} from '@folio/stripes-erm-components';

import {
  useMutateNumberGeneratorSequence,
  useNumberGeneratorSequences
} from '../../public';
import NumberGeneratorSequenceForm from './NumberGeneratorSequenceForm';

import css from './SequenceSearch.css';
import SequenceSearchBar from './SequenceSearchBar';
import SequenceFilters from './SequenceFilters';

const PER_PAGE = 25;

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
  const stripes = useStripes();
  const { query, queryGetter, querySetter } = useKiwtSASQuery();
  const { qIndexChanged, qIndexSASQProps, searchKey } = useSASQQIndex({ defaultQIndex: 'name,code' });

  // Normally usePrevNextPagination is used split in two, so we have another call to it down the file
  const { currentPage } = usePrevNextPagination();

  const queryParams = useMemo(
    () => generateKiwtQueryParams(
      {
        searchKey,
        filterKeys: {
          'enabled': 'enabled', // This seems remarkably stupid
          'maximumCheck': 'maximumCheck.value'
        },
        filters: [
          {
            path: 'owner.id',
            value: numGenId
          }
        ],
        page: currentPage,
        perPage: PER_PAGE,
      },
      query ?? {}
    ),
    [currentPage, numGenId, query, searchKey]
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

  // We need this twice, as it's normally called once in route and once in view, this component does both
  const { paginationMCLProps, paginationSASQProps } = usePrevNextPagination({
    count: totalCount,
    pageSize: PER_PAGE,
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
        onClick={() => history.push(`${url}/${rowData.id}${location?.search ?? ''}`)}
      >
        {rowData.name}
      </Button>
    );
  }, [history, location?.search, url]);

  const renderMaximumCheck = useCallback((rowData) => {
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

  const sortOrder = query.sort ?? '';
  return (
    <>
      <SearchAndSortQuery
        {...qIndexSASQProps}
        {...paginationSASQProps}
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
              defaultWidth="20%"
              id="settings-numberGeneratorSequences-list"
              renderHeader={(renderProps) => (
                <PaneHeader
                  {...renderProps}
                  dismissible
                  lastMenu={
                    stripes.hasPerm('ui-service-interaction.numberGenerator.manage') &&
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
                <SequenceSearchBar
                  disableReset={disableReset}
                  getSearchHandlers={getSearchHandlers}
                  onSubmitSearch={onSubmitSearch}
                  resetAll={resetAll}
                  searchValue={searchValue}
                  source={{
                    // Fake source from useQuery return values;
                    totalCount: () => totalCount,
                    loaded: () => !isLoading,
                    pending: () => isLoading,
                    failure: () => isError,
                    failureMessage: () => error.message,
                  }}
                />
                <SequenceFilters
                  activeFilters={activeFilters.state}
                  filterHandlers={getFilterHandlers()}
                  totalCount={totalCount}
                />
                <MultiColumnList
                  columnMapping={{
                    name: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.name" />,
                    code: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.code" />,
                    enabled: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.enabled" />,
                    nextValue: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.nextValue" />,
                    maximumNumber: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.maximumNumber" />,
                    maximumCheck: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.maximumCheck" />,
                  }}
                  contentData={sequences}
                  formatter={{
                    name: renderName,
                    enabled: renderEnabled,
                    nextValue: renderNextValue,
                    maximumNumber: renderMaximumNumber,
                    maximumCheck: renderMaximumCheck
                  }}
                  id="number-generator-sequences"
                  interactive={false}
                  nonInteractiveHeaders={['enabled', 'maximumCheck']}
                  onHeaderClick={onSort}
                  sortDirection={sortOrder.startsWith('-') ? 'descending' : 'ascending'}
                  sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                  visibleColumns={['name', 'code', 'enabled', 'nextValue', 'maximumNumber', 'maximumCheck']}
                  {...paginationMCLProps}
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
