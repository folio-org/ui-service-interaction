import { forwardRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import { Modal, Select } from '@folio/stripes/components';
import { useNumberGenerators } from '../../hooks';
import NumberGeneratorButton from '../NumberGeneratorButton';

const NumberGeneratorModal = forwardRef(({
  callback,
  generateButtonLabel,
  // This is the numberGenerator code, and is optional.
  // Omitting will result in all sequences appearing in select
  generator,
  generatorButtonProps,
  id,
  ...modalProps
}, ref) => {
  const { data: { results: data = [] } = {}, isLoading } = useNumberGenerators(generator);

  const optionFromSequence = (seq) => (
    <option
      key={seq.id}
      value={seq.id}
    >
      {seq.code ?? seq.id}
    </option>
  );

  const sequenceGroup = data.reduce((acc, curr) => {
    const generatorCode = curr.code;
    const returnObj = {
      ...acc
    };

    const reduceSequences = [
      ...(curr.sequences ?? [])?.filter(seq => seq.enabled)?.sort((a, b) => {
        if (a.code.toLowerCase() < b.code.toLowerCase()) return -1;
        if (a.code.toLowerCase() > b.code.toLowerCase()) return 1;
        return 0;
      })
    ];

    if (reduceSequences.length) {
      returnObj[generatorCode] = reduceSequences;
    }

    return returnObj;
  }, {});

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
    const sequenceGroupEntries = Object.entries(sequenceGroup);

    if (!isLoading && sequenceGroupEntries.length > 0 && !selectedNG) {
      setSelectedNG(sequenceGroupEntries[0]?.[0]);
      setSelectedSequence(sequenceGroupEntries[0]?.[1]?.[0]);
    }
  }, [isLoading, selectedNG, sequenceGroup]);

  return (
    <Modal
      ref={ref}
      id={`number-generator-modal-${id}`}
      label={<FormattedMessage id="ui-service-interaction.numberGenerator.selectGenerator" />}
      {...modalProps}
    >
      <Select
        label={<FormattedMessage id="ui-service-interaction.numberGenerator.generator" />}
        onChange={(e) => {
          // Find the NG in the data which has the chosen sequence, and set it as the currently selected NG
          const chosenNumberGenerator = data?.find(ng => ng?.sequences?.some(s => s.id === e.target.value))?.code;
          setSelectedNG(chosenNumberGenerator);
          // Within that NG, find the correct sequence by id, and set it as current sequence
          const chosenSequence = sequenceGroup[chosenNumberGenerator]?.find(seq => seq.id === e.target.value);
          setSelectedSequence(chosenSequence);
        }}
        placeholder={null} // placeholder default causes issues
        value={selectedSequence?.id}
      >
        {
          // If we have multiple generators, separate with optgroups, else display all in one
          (Object.keys(sequenceGroup)?.length ?? 0) > 1 ?
            Object.entries(sequenceGroup)?.sort((a, b) => {
              if (a[0].toLowerCase() < b[0].toLowerCase()) return -1;
              if (a[0].toLowerCase() > b[0].toLowerCase()) return 1;
              return 0;
            }).map(([key, value]) => (
              <optgroup
                key={key}
                label={key}
              >
                {value.map(v => (
                  optionFromSequence(v)
                ))}
              </optgroup>
            )) :
            Object.entries(sequenceGroup).map(([_k, value]) => (
              value.map(v => (
                optionFromSequence(v)
              ))
            ))
        }
      </Select>
      <NumberGeneratorButton
        buttonLabel={generateButtonLabel}
        callback={(generated) => {
          callback(generated);
        }}
        generator={selectedNG ?? ''}
        id={id}
        sequence={selectedSequence?.code ?? ''}
        {...generatorButtonProps}
      />
    </Modal>
  );
});

NumberGeneratorModal.propTypes = {
  callback: PropTypes.func.isRequired,
  generateButtonLabel: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  generator: PropTypes.string,
  generatorButtonProps: PropTypes.object,
  id: PropTypes.string.isRequired,
};

export default NumberGeneratorModal;
