import { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import isEqual from 'lodash/isEqual';
import orderBy from 'lodash/orderBy';

import { Field } from 'react-final-form';

import { Pane, Select } from '@folio/stripes/components';
import { ActionList, required as requiredValidator, useRefdata } from '@k-int/stripes-kint-components';

import { useNumberGenerators } from '../public';
import { useMutateNumberGeneratorSequence } from '../public/hooks';

const NumberGeneratorSequenceConfig = ({
  history,
  match
}) => {
  const { data: { results: data = [] } = {}, isLoading } = useNumberGenerators();
  const [numberGenerator, setNumberGenerator] = useState({});

  const findNumberGenerator = useCallback((ngId) => {
    return data?.find(ng => ng?.id === ngId);
  }, [data]);

  // Once data has loaded, default selected number generator to top of list
  useEffect(() => {
    if (!numberGenerator?.id && !isLoading && data?.length) {
      setNumberGenerator(data[0]);
      // All this handling is so we don't need to make a secondary call for the selected generator,
      // when we already have all the information from the initial fetch to populate the select.
    } else if (numberGenerator?.id) {
      const currentNumberGenerator = findNumberGenerator(numberGenerator.id);

      if (!isEqual(numberGenerator, currentNumberGenerator)) {
        setNumberGenerator(currentNumberGenerator);
      }
    }
  }, [data, findNumberGenerator, isLoading, numberGenerator]);

  const {
    put: editSeq,
    post: addSeq,
    delete: removeSeq
  } = useMutateNumberGeneratorSequence({
    id: numberGenerator?.id
  });

  const { 0: { values: checkDigitAlgoOptions = [] } = {} } = useRefdata({
    endpoint: 'servint/refdata',
    desc: 'NumberGeneratorSequence.CheckDigitAlgo'
  });

  const actionAssigner = () => ([
    {
      name: 'edit',
      label: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.edit" />,
      icon: 'edit',
      callback: (newData) => editSeq(newData)
    },
    {
      name: 'delete',
      callback: (rowData) => removeSeq(rowData?.id),
      icon: 'trash'
    }
  ]);

  // Longer term we will support more of the values than these two
  const currentlySupportedChecksums = [
    'none',
    'ean13'
  ];

  const fieldComponents = {
    // eslint-disable-next-line react/prop-types
    'checkDigitAlgo': ({ name, ...fieldProps }) => {
      return (
        <Field
          {...fieldProps}
          component={Select}
          dataOptions={[
            { value: '', label: '', disabled: true },
            ...checkDigitAlgoOptions?.filter(cdao => currentlySupportedChecksums.includes(cdao.value))?.map(cdao => ({ value: cdao.id, label: cdao.label }))
          ]}
          fullWidth
          marginBottom0
          name={`${name}.id`} // checkDigitAlgo should deal with the id
          parse={v => v}
          required
          validate={requiredValidator}
        />
      );
    }
  };

  const sortedNumberGenSequences = useMemo(() => orderBy(numberGenerator?.sequences, ['code']) ?? [], [numberGenerator]);

  return (
    <>
      <Pane
        defaultWidth="fill"
        dismissible
        id="settings-numberGeneratorSequences-list"
        onClose={() => history.push(match.url)}
        paneTitle={<FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences" />}
      >
        <Select
          dataOptions={[...data?.map(ng => ({ value: ng.id, label: ng.name }))]}
          onChange={e => setNumberGenerator(findNumberGenerator(e.target.value))}
          value={numberGenerator.id}
        />
        <ActionList
          actionAssigner={actionAssigner}
          columnMapping={{
            code: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.code" />,
            checkDigitAlgo: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.checkDigitAlgo" />,
            format: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.format" />,
            outputTemplate: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.outputTemplate" />,
            nextValue: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.nextValue" />,
          }}
          contentData={sortedNumberGenSequences}
          creatableFields={{
            nextValue: () => false
          }}
          createCallback={(ngSeq) => addSeq(ngSeq)}
          editableFields={{
            code: () => false,
            nextValue: () => false
          }}
          fieldComponents={fieldComponents}
          formatter={{
            nextValue: (rowData) => (
              rowData.nextValue ?? 0
            ),
            checkDigitAlgo: (rowData) => (
              rowData.checkDigitAlgo?.label ?? rowData.checkDigitAlgo?.value
            )
          }}
          validateFields={{
            code: () => requiredValidator
          }}
          visibleFields={['code', 'checkDigitAlgo', 'format', 'outputTemplate', 'nextValue']}
        />
      </Pane>
    </>
  );
};

NumberGeneratorSequenceConfig.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }),
  match: PropTypes.shape({
    url: PropTypes.string.isRequired
  })
};

export default NumberGeneratorSequenceConfig;
