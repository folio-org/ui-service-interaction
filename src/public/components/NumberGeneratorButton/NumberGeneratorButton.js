import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import { Button } from '@folio/stripes/components';
import { useGenerateNumber, useNumberGenerators } from '../../hooks';

const NumberGeneratorButton = ({
  buttonLabel,
  callback,
  id,
  generator, // This is the numberGenerator code
  sequence, // This is the sequence code
  ...buttonProps
}) => {
  const { data: { results: { 0: { sequences = [] } = {} } = [] } = {} } = useNumberGenerators(generator);
  const enabled = sequences.find(seq => seq.code === sequence)?.enabled ?? false;

  const { generate } = useGenerateNumber({
    callback,
    generator,
    sequence,
  });

  return (
    <Button
      buttonStyle="primary"
      disabled={!enabled}
      id={`clickable-trigger-number-generator-${id}`}
      onClick={generate}
      {...buttonProps}
    >
      {
        buttonLabel ??
        <FormattedMessage id="ui-service-interaction.numberGenerator.generate" />
      }
    </Button>
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
  sequence: PropTypes.string.isRequired
};

export default NumberGeneratorButton;
