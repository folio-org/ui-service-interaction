import { useRef } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import { Button } from '@folio/stripes/components';
import { ModalButton } from '../../utilities';
import NumberGeneratorModal from '../NumberGeneratorModal';

const NumberGeneratorModalButton = ({
  callback,
  // This is the numberGenerator code, and is optional.
  // Omitting will result in all sequences appearing in select
  generator,
  id,
  generatorButtonProps,
  modalProps,
  ...buttonProps
}) => {
  const modalButtonRef = useRef();

  const modalComponent = (mdProps) => (
    <NumberGeneratorModal
      callback={(generated) => {
        callback(generated);
        modalButtonRef?.current?.close();
      }}
      generator={generator}
      generatorButtonProps={generatorButtonProps}
      id={id}
      {...modalProps}
      {...mdProps}
    />
  );

  return (
    <ModalButton
      ref={modalButtonRef}
      id={`number-generator-${id}`}
      renderModal={modalComponent}
      renderTrigger={(bprops) => (
        <Button
          {...bprops}
          {...buttonProps}
        >
          <FormattedMessage id="ui-service-interaction.numberGenerator.selectGenerator" />
        </Button>
      )}
    />
  );
};

NumberGeneratorModalButton.propTypes = {
  callback: PropTypes.func.isRequired,
  generator: PropTypes.string,
  id: PropTypes.string.isRequired,
  generatorButtonProps: PropTypes.object,
  modalProps: PropTypes.object
};

export default NumberGeneratorModalButton;
