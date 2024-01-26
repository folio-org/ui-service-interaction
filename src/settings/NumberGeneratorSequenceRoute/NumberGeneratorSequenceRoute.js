import { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Route } from '@folio/stripes/core';

import { getIdsFromUrl } from '@folio/stripes-erm-components';


import { useNumberGenerators } from '../../public';

import SequenceSearch from './SequenceSearch';
import SequenceView from './SequenceView';

const NumberGeneratorSequenceRoute = ({
  baseUrl,
  history,
  location,
  match,
}) => {
  const { data: { results: data = [] } = {}, isLoading } = useNumberGenerators();
  // Separate state to trial stuff
  const changeGenerator = useCallback((id) => {
    // Settings routing sucks, use Regex to grab ids
    const urlIds = getIdsFromUrl(location.pathname);
    if (urlIds.length === 2) {
      // If a sequence is open, we want it to remain so
      history.push(`${match.path}/${id}/${urlIds[1]}`);
    } else {
      history.push(`${match.path}/${id}`);
    }
  }, [history, location.pathname, match.path]);


  useEffect(() => {
    // Only take effect once NGs have loaded
    if (!isLoading && data?.length) {
      const ids = getIdsFromUrl(location.pathname);

      if (!ids[0]) {
        changeGenerator(data[0].id);
      }
    }
  }, [
    changeGenerator,
    data,
    history,
    isLoading,
    location,
    match
  ]);

  const renderSequenceSearch = useCallback((innerProps) => (
    <SequenceSearch
      baseUrl={baseUrl}
      changeGenerator={changeGenerator}
      numberGenerators={data}
      {...innerProps}
    />
  ), [baseUrl, changeGenerator, data]);

  const renderSequenceView = useCallback((innerProps) => {
    // Settings routing sucks, use Regex to grab first id
    const urlIds = getIdsFromUrl(location.pathname);
    return (
      <SequenceView
        onClose={() => history.push(`${match.url}/${urlIds[0]}${location.search}`)}
        {...innerProps}
      />
    );
  }, [history, location.pathname, location.search, match.url]);

  return (
    <>
      <Route component={renderSequenceSearch} path={`${match.path}/:numGenId?`} />
      <Route component={renderSequenceView} path={`${match.path}/:numGenId/:seqId`} />
    </>
  );
};

NumberGeneratorSequenceRoute.propTypes = {
  baseUrl: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }),
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  })
};

export default NumberGeneratorSequenceRoute;
