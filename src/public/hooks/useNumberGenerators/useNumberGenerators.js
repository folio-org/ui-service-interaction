import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

import { generateKiwtQueryParams } from '@k-int/stripes-kint-components';

import { NUMBER_GENERATORS_ENDPOINT } from '../../constants';

const useNumberGenerators = (code, queryOptions = {}) => {
  const ky = useOkapiKy();

  const paramMap = {
    sort: [
      {
        path: 'enabled'
      },
      {
        path: 'name'
      }
    ],
    filters: []
  };

  if (code) {
    paramMap.filters.push({
      path: 'code',
      value: code
    });
  }

  const queryParams = generateKiwtQueryParams(paramMap, {});
  return useQuery(
    [NUMBER_GENERATORS_ENDPOINT, queryParams, 'ui-service-interaction', 'useNumberGenerators'],
    () => ky.get(`${NUMBER_GENERATORS_ENDPOINT}?${queryParams.join('&')}`).json(),
    queryOptions
  );
};


export default useNumberGenerators;
