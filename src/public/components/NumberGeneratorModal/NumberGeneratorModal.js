import { forwardRef, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import orderBy from 'lodash/orderBy';
import isEqual from 'lodash/isEqual';

import { Button, Modal, ModalFooter, Select } from '@folio/stripes/components';

import { AT_MAXIMUM, OVER_THRESHOLD } from '../../constants';
import { useNumberGenerators } from '../../hooks';
import NumberGeneratorButton from '../NumberGeneratorButton';

import css from '../../Styles.css';

const NumberGeneratorModal = forwardRef(({
  callback,
  displayError = true,
  displayWarning = true,
  generateButtonLabel,
  // This is the numberGenerator code, and is optional.
  // Omitting will result in all sequences appearing in select
  generator,
  generatorButtonProps,
  id,
  renderTop,
  renderBottom,
  ...modalProps
}, ref) => {
  const { data: { results: data = [] } = {}, isFetching } = useNumberGenerators(generator);
  const sequenceCount = data.reduce((acc, curr) => {
    return acc + curr?.sequences?.length;
  }, 0);

  const optionFromSequence = (seq) => (
    <option
      key={seq.id}
      value={seq.id}
    >
      {seq.name ?? seq.code ?? seq.id}
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
      returnObj[generatorCode] = {
        name: curr.name,
        code: curr.code,
        sequences: reduceSequences
      };
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

    if (!isFetching) {
      if (sequenceGroupEntries.length > 0 && !selectedNG) {
        setSelectedNG(sequenceGroupEntries[0]?.[0]);
        setSelectedSequence(sequenceGroupEntries[0]?.[1]?.sequences?.[0]);
      }

      // Check if we have more up to date versions of NG and Seq, if so set them in state
      const selectedNGInData = data?.filter(ng => ng.code === selectedNG)?.[0];
      if (!!selectedNGInData && !isEqual(selectedNG, selectedNGInData)) {
        // Refetched NG differs, setNG
        setSelectedNG(selectedNGInData?.code);
      }

      const selectedSequenceInData = selectedNGInData?.sequences?.filter(sq => sq.id === selectedSequence?.id)?.[0];
      if (!!selectedSequenceInData && !isEqual(selectedSequence, selectedSequenceInData)) {
        // Refetched SS differs, setSS
        setSelectedSequence(selectedSequenceInData);
      }
    }
  }, [data, isFetching, selectedNG, selectedSequence, sequenceGroup]);

  const overThreshold = useMemo(() => selectedSequence?.maximumCheck?.value === OVER_THRESHOLD, [selectedSequence?.maximumCheck?.value]);
  const atMaximum = useMemo(() => selectedSequence?.maximumCheck?.value === AT_MAXIMUM, [selectedSequence?.maximumCheck?.value]);

  const renderSelectOptions = () => {
    // If we have multiple generators, separate with optgroups, else display all in one
    if ((Object.keys(sequenceGroup)?.length ?? 0) > 1) {
      return (
        orderBy(Object.entries(sequenceGroup), '0.code')?.map(([key, value]) => (
          <optgroup
            key={key}
            label={value?.name ?? value?.code}
          >
            {value?.sequences?.map(v => (
              optionFromSequence(v)
            ))}
          </optgroup>
        ))
      );
    }

    return (
      Object.entries(sequenceGroup).map(([_k, value]) => (
        value?.sequences?.map(v => (
          optionFromSequence(v)
        ))
      ))
    );
  };

  const renderWarningText = () => {
    if (displayWarning && overThreshold) {
      return (
        <div className={css.warningText}>
          <FormattedMessage id="ui-service-interaction.numberGenerator.warning.sequenceOverThresholdWarning" values={{ name: selectedSequence.name, maxVal: selectedSequence.maximumNumber }} />
        </div>
      );
    }

    return undefined;
  };

  const renderErrorText = () => {
    if (displayError && atMaximum) {
      return (
        <div className={css.errorText}>
          <FormattedMessage id="ui-service-interaction.numberGenerator.error.sequenceOverMaximumError" values={{ name: selectedSequence.name, maxVal: selectedSequence.maximumNumber }} />
        </div>
      );
    }

    return undefined;
  };

  return (
    <Modal
      ref={ref}
      footer={
        <ModalFooter>
          <NumberGeneratorButton
            buttonLabel={generateButtonLabel}
            callback={(generated) => {
              callback(generated);
            }}
            displayError={false} // We are dealing with error/warning manually in the modal
            displayWarning={false}
            generator={selectedNG ?? ''}
            id={id}
            marginBottom0
            sequence={selectedSequence?.code ?? ''}
            {...generatorButtonProps}
          />
          <Button
            marginBottom0
            onClick={modalProps.onClose}
          >
            <FormattedMessage id="ui-service-interaction.cancel" />
          </Button>
        </ModalFooter>
      }
      id={`number-generator-modal-${id}`}
      label={<FormattedMessage id="ui-service-interaction.numberGenerator.selectGenerator" />}
      {...modalProps}
    >
      {renderTop ? renderTop() : null}
      <Select
        disabled={sequenceCount <= 1}
        error={renderErrorText()}
        label={<FormattedMessage id="ui-service-interaction.numberGenerator.generator" />}
        onChange={(e) => {
          // Find the NG in the data which has the chosen sequence, and set it as the currently selected NG
          const chosenNumberGenerator = data?.find(ng => ng?.sequences?.some(s => s.id === e.target.value))?.code;
          setSelectedNG(chosenNumberGenerator);
          // Within that NG, find the correct sequence by id, and set it as current sequence
          const chosenSequence = sequenceGroup[chosenNumberGenerator]?.sequences?.find(seq => seq.id === e.target.value);
          setSelectedSequence(chosenSequence);
        }}
        placeholder={null} // placeholder default causes issues
        value={selectedSequence?.id}
        warning={renderWarningText()}
      >
        {renderSelectOptions()}
      </Select>
      {renderBottom ? renderBottom() : null}
    </Modal>
  );
});

NumberGeneratorModal.propTypes = {
  callback: PropTypes.func.isRequired,
  displayError: PropTypes.bool,
  displayWarning: PropTypes.bool,
  generateButtonLabel: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  generator: PropTypes.string,
  generatorButtonProps: PropTypes.object,
  id: PropTypes.string.isRequired,
  renderBottom: PropTypes.func,
  renderTop: PropTypes.func,
};

export default NumberGeneratorModal;
