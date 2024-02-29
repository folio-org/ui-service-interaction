import { useMemo } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import { Button } from '@folio/stripes/components';

import { AT_MAXIMUM, OVER_THRESHOLD } from '../../constants';
import { useGenerateNumber, useNumberGenerators } from '../../hooks';

import css from '../../Styles.css';

const NumberGeneratorButton = ({
  buttonLabel,
  callback,
  disabled, // Take control of disabling the button manually
  displayError = true,
  displayWarning = false,
  id,
  generator, // This is the numberGenerator code
  sequence, // This is the sequence code
  /* useGenerateNumber callback, generator and sequence are handled by direct props
   * but the rest of the parameters for useGenerateNumber can be passed here.
   * (Including the above 3, where this prop will take precedence)
   */
  useGenerateNumberParams = {},
  ...buttonProps
}) => {
  const { data: { results: { 0: { sequences = [] } = {} } = [] } = {} } = useNumberGenerators(generator, { enabled: !!generator && !!sequence });

  const selectedSequence = useMemo(() => sequences.find(seq => seq.code === sequence), [sequence, sequences]);
  const enabled = useMemo(() => selectedSequence?.enabled ?? false, [selectedSequence]);

  const overThreshold = useMemo(() => selectedSequence?.maximumCheck?.value === OVER_THRESHOLD, [selectedSequence?.maximumCheck?.value]);
  const atMaximum = useMemo(() => selectedSequence?.maximumCheck?.value === AT_MAXIMUM, [selectedSequence?.maximumCheck?.value]);

  const { generate } = useGenerateNumber({
    callback,
    generator,
    sequence,
    ...useGenerateNumberParams
  });

  const renderWarningsAndErrors = () => {
    if (displayWarning && overThreshold) {
      return (
        <div className={css.warningText}>
          <FormattedMessage id="ui-service-interaction.numberGenerator.warning.sequenceOverThresholdWarning" values={{ name: selectedSequence.name, maxVal: selectedSequence.maximumNumber }} />
        </div>
      );
    }

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
    <>
      <Button
        buttonStyle="primary"
        disabled={disabled ?? (!enabled || atMaximum)}
        id={`clickable-trigger-number-generator-${id}`}
        onClick={generate}
        {...buttonProps}
      >
        {
          buttonLabel ??
          <FormattedMessage id="ui-service-interaction.numberGenerator.generate" />
        }
      </Button>
      {renderWarningsAndErrors()}
    </>
  );
};

NumberGeneratorButton.propTypes = {
  buttonLabel: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  callback: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  displayError: PropTypes.bool,
  displayWarning: PropTypes.bool,
  id: PropTypes.string.isRequired,
  generator: PropTypes.string.isRequired,
  sequence: PropTypes.string.isRequired,
  useGenerateNumberParams: PropTypes.object
};

export default NumberGeneratorButton;
