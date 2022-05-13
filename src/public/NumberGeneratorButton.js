import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import { Button } from '@folio/stripes/components';
import { useGenerateNumber } from './hooks';


const NumberGeneratorButton = ({
  callback,
  generator, // This is the numberGenerator code
  sequence, // This is the sequence code
}) => {
  const { generate } = useGenerateNumber({
    callback,
    generator,
    sequence
  });

  return (
    <Button onClick={generate}>
      <FormattedMessage id="ui-service-interaction.numberGenerator.generate" />
    </Button>
  );
};

NumberGeneratorButton.propTypes = {
  callback: PropTypes.func.isRequired,
  generator: PropTypes.string.isRequired,
  sequence: PropTypes.string.isRequired
};

export default NumberGeneratorButton;
