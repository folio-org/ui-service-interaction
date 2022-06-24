import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import { Modal, Select } from '@folio/stripes/components';
import { useNumberGenerators } from '../../hooks';
import NumberGeneratorButton from '../NumberGeneratorButton';

const NumberGeneratorModal = ({
  callback,
  // This is the numberGenerator code, and is optional.
  // Omitting will result in all sequences appearing in select
  generator,
  generatorButtonProps,
  id,
  ...modalProps
}) => {
  const { data: { results: data = [] } = {}, isLoading } = useNumberGenerators(generator);
  const sequenceOptions = data?.reduce((acc, cur) => {
    return [...acc, ...cur?.sequences?.map(seq => ({ value: seq.id, label: seq.code }))];
  }, []);

  /* Track which number generator has been selected.
   * Obviously if a code is provided it will only be one,
   * but if no code/in future maybe a list of codes are provided
   * then this gives us a way to still send the correct generator down.
   *
   * Make the select a controlled form component, so we can set the selectedNG on change
   */
  const [selectedNG, setSelectedNG] = useState();
  const [selectedSequence, setSelectedSequence] = useState('');

  useEffect(() => {
    if (!isLoading && data.length > 0 && !selectedNG) {
      setSelectedNG(data[0]);
      setSelectedSequence(data[0].sequences[0].id);
    }
  }, [data, isLoading, selectedNG]);

  return (
    <Modal
      id={`number-generator-modal-${id}`}
      label={<FormattedMessage id="ui-service-interaction.numberGenerator.selectGenerator" />}
      {...modalProps}
    >
      <Select
        dataOptions={sequenceOptions}
        onChange={(e) => {
          // Find the NG in the data which has the chosen sequence, and set it as the currently selected NG
          setSelectedNG(data?.find(ng => ng?.sequences?.filter(s => s.id === e.target.value)?.length > 0));
          setSelectedSequence(e.target.value);
        }}
        value={selectedSequence}
      />
      <NumberGeneratorButton
        callback={(generated) => {
          callback(generated);
        }}
        generator={selectedNG?.code ?? ''}
        id={id}
        sequence={selectedNG?.sequences?.find(seq => seq.id === selectedSequence)?.code ?? ''}
        {...generatorButtonProps}
      />
    </Modal>
  );
};

NumberGeneratorModal.propTypes = {
  callback: PropTypes.func.isRequired,
  generator: PropTypes.string,
  id: PropTypes.string.isRequired,
  generatorButtonProps: PropTypes.object
};

export default NumberGeneratorModal;
