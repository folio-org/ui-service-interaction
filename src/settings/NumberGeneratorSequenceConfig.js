import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Field } from 'react-final-form';

import { Pane, Select } from '@folio/stripes/components';
import { ActionList, useRefdata } from '@k-int/stripes-kint-components';

import { useNumberGenerators } from '../public';
import { useMutateNumberGeneratorSequence } from '../public/hooks';

const NumberGeneratorSequenceConfig = ({
  history,
  match
}) => {
  const { data: { results: data = [] } = {}, isLoading } = useNumberGenerators();
  const [numberGenerator, setNumberGenerator] = useState({});

  const findNumberGenerator = (ngId) => {
    return data?.find(ng => ng?.id === ngId);
  };

  // Once data has loaded, default selected number generator to top of list
  useEffect(() => {
    if (!numberGenerator?.id && !isLoading && data?.length) {
      setNumberGenerator(data[0]);
    }
  }, [data, isLoading, numberGenerator]);

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

  const fieldComponents = {
    'checkDigitAlgo.id': ({ ...fieldProps }) => {
      // FIXME this isn't working as expected, select fields may be complicated in ActionList
      // Might be able to get away without the 'id' once it's expanded
      return (
        <Field
          {...fieldProps}
          component={Select}
          dataOptions={checkDigitAlgoOptions?.map(cdao => ({ value: cdao.id, label: cdao.label }))}
          fullWidth
          marginBottom0
          parse={v => v}
        />
      );
    }
  };

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
            'checkDigitAlgo.id': <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.checkDigitAlgo" />,
            outputTemplate: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.outputTemplate" />,
            nextValue: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.nextValue" />,
          }}
          contentData={numberGenerator?.sequences?.sort((a, b) => {
            if (a.code > b.code) {
              return 1;
            }

            if (b.code > a.code) {
              return -1;
            }

            return 0;
          })}
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
            'checkDigitAlgo.id': (rowData) => (
              // FIXME when expanded can use label directly
              checkDigitAlgoOptions?.find(cdao => cdao.id === rowData?.checkDigitAlgo?.id)?.label
            )
          }}
          visibleFields={['code', 'checkDigitAlgo.id', 'outputTemplate', 'nextValue']}
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
