import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

import { generateKiwtQueryParams } from '@k-int/stripes-kint-components';

import { NUMBER_GENERATOR_SEQUENCES_ENDPOINT } from '../../constants';

const useNumberGeneratorSequences = ({
  queryOptions = {},
  queryParams // Expects to be in the shape output by generateKiwtQueryParams
}) => {
  const ky = useOkapiKy();

  const paramMap = {
    sort: [
      {
        path: 'enabled',
        direction: 'desc'
      },
      {
        path: 'code',
      },
    ],
    filters: [],
  };

  const defaultQueryParams = generateKiwtQueryParams(paramMap, {});
  const qp = queryParams ?? defaultQueryParams;

  return useQuery(
    [NUMBER_GENERATOR_SEQUENCES_ENDPOINT, queryParams, 'ui-service-interaction', 'useNumberGeneratorSequences'],
    () => ky.get(`${NUMBER_GENERATOR_SEQUENCES_ENDPOINT}?${qp.join('&')}`).json(),
    queryOptions
  );
};


export default useNumberGeneratorSequences;
