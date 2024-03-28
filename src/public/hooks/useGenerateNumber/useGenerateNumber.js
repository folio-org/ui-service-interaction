import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useQuery, useQueryClient } from 'react-query';

import { generateKiwtQueryParams } from '@k-int/stripes-kint-components';

import { useCallout, useOkapiKy } from '@folio/stripes/core';

import useNumberGeneratorSequences from '../useNumberGeneratorSequences';

import { NUMBER_GENERATORS_ENDPOINT, NUMBER_GENERATOR_SEQUENCES_ENDPOINT } from '../../utilities';
import {
  GENERATE_ERROR_CODE_MAX_REACHED,
  GENERATE_STATUS_ERROR,
  GENERATE_STATUS_WARNING,
  GENERATE_WARNING_CODE_HIT_MAXIMUM,
  GENERATE_WARNING_CODE_OVER_THRESHOLD,
} from '../../constants';

const useGenerateNumber = ({
  callback = () => null,
  errorCalloutParams,
  generator, // This is the numberGenerator code
  queryOptions,
  sequence, // This is the sequence code
  sendWarningCallouts = true,
  sendErrorCallouts = true,
  warningCalloutParams
}) => {
  const callout = useCallout();
  const ky = useOkapiKy();
  const intl = useIntl();
  const queryClient = useQueryClient();

  const invalidateNumberGenerators = () => queryClient.invalidateQueries(NUMBER_GENERATORS_ENDPOINT);
  const invalidateNumberGeneratorSequences = () => queryClient.invalidateQueries(NUMBER_GENERATOR_SEQUENCES_ENDPOINT);

  const queryParams = generateKiwtQueryParams(
    {
      filters: [
        {
          path: 'owner.code',
          value: generator
        },
        {
          path: 'code',
          value: sequence
        }
      ],
    },
    {}
  );

  const {
    data: {
      results: { 0: sequenceObj } = [],
    } = {},
  } = useNumberGeneratorSequences({
    queryParams,
    queryOptions: {
      enabled: !!generator && !!sequence
    },
  });

  /* const { data: { results: { 0: { sequences = [] } = {} } = [] } = {} } = useNumberGenerators(generator);
  // Find full sequence object from DB
  const sequenceObj = sequences.find(seq => seq.code === sequence); */
  // If sequence object does not exist at all, allow generation.
  // If sequence object _does_ exist and "enabled" is NOT true, do not allow generation.
  const sequenceEnabled = sequenceObj?.enabled ?? true;

  const handleCallouts = useCallback((generateResponse) => {
    const values = { name: sequenceObj?.name, maxVal: sequenceObj?.maximumNumber };
    if (sendWarningCallouts && generateResponse.status === GENERATE_STATUS_WARNING) {
      let message = 'ui-service-interaction.numberGenerator.warning';
      if (generateResponse.warningCode === GENERATE_WARNING_CODE_OVER_THRESHOLD) {
        message += '.sequenceOverThresholdWarning';
      } else if (generateResponse.warningCode === GENERATE_WARNING_CODE_HIT_MAXIMUM) {
        message += '.sequenceHitMaximumWarning';
      }

      callout.sendCallout(warningCalloutParams ?? {
        message: intl.formatMessage({ id: message }, values),
        type: 'warning',
      });
    } else if (sendErrorCallouts && generateResponse.status === GENERATE_STATUS_ERROR) {
      let message = 'ui-service-interaction.numberGenerator.error';
      if (generateResponse.errorCode === GENERATE_ERROR_CODE_MAX_REACHED) {
        message += '.sequenceOverMaximumError';
      }

      callout.sendCallout(errorCalloutParams ?? {
        message: intl.formatMessage({ id: message }, values),
        type: 'error',
      });
    }

    return generateResponse;
  }, [
    callout,
    intl,
    errorCalloutParams,
    sendErrorCallouts,
    sendWarningCallouts,
    sequenceObj?.maximumNumber,
    sequenceObj?.name,
    warningCalloutParams
  ]);

  const path = `servint/numberGenerators/getNextNumber?generator=${generator}&sequence=${sequence}`;
  const queryObject = useQuery(
    [path, 'ui-service-interaction', 'useGenerateNumber'],
    () => ky.get(path).json()
      .then(res => {
        callback(res?.nextValue);
        return res;
      }).then(handleCallouts)
      .then((res) => {
        invalidateNumberGenerators();
        invalidateNumberGeneratorSequences();
        return res;
      }),
    {
      enabled: false,
      cacheTime: 0,
      ...queryOptions
    }
  );

  const sendDisabledSequenceCallout = () => callout.sendCallout({
    message: intl.formatMessage({ id: 'ui-service-interaction.numberGenerator.generateDisabledSequenceError' }),
    type: 'error',
  });

  return ({
    generate: sequenceEnabled ? queryObject.refetch : sendDisabledSequenceCallout,
    queryObject
  });
};

export default useGenerateNumber;
