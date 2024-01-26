import { useMemo } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import { Button } from '@folio/stripes/components';
import { useGenerateNumber, useNumberGenerators } from '../../hooks';
import css from '../../Styles.css';

const NumberGeneratorButton = ({
  buttonLabel,
  callback,
  id,
  generator, // This is the numberGenerator code
  sequence, // This is the sequence code
  suppressWarning = true,
  suppressError = false,
  ...buttonProps
}) => {
  const { data: { results: { 0: { sequences = [] } = {} } = [] } = {} } = useNumberGenerators(generator);

  const selectedSequence = useMemo(() => sequences.find(seq => seq.code === sequence), [sequence, sequences]);
  const enabled = useMemo(() => selectedSequence?.enabled ?? false, [selectedSequence]);

  const overThreshold = useMemo(() => selectedSequence?.maximumCheck?.value === 'over_threshold', [selectedSequence?.maximumCheck?.value]);
  const atMaximum = useMemo(() => selectedSequence?.maximumCheck?.value === 'at_maximum', [selectedSequence?.maximumCheck?.value]);

  const { generate } = useGenerateNumber({
    callback,
    generator,
    sequence,
  });

  const renderWarningsAndErrors = () => {
    if (overThreshold && !suppressWarning) {
      return (
        <div className={css.warningText}>
          <FormattedMessage id="ui-service-interaction.numberGenerator.sequenceOverThresholdWarning" />
        </div>
      );
    }

    if (atMaximum && !suppressError) {
      return (
        <div className={css.errorText}>
          <FormattedMessage id="ui-service-interaction.numberGenerator.sequenceOverMaximumError" />
        </div>
      );
    }

    return undefined;
  };

  return (
    <>
      <Button
        buttonStyle="primary"
        disabled={!enabled || atMaximum}
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
  id: PropTypes.string.isRequired,
  generator: PropTypes.string.isRequired,
  sequence: PropTypes.string.isRequired,
  suppressWarning: PropTypes.bool,
  suppressError: PropTypes.bool
};

export default NumberGeneratorButton;
