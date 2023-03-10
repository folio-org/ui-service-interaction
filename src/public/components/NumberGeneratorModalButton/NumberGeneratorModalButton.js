import { useRef } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import { Button } from '@folio/stripes/components';
import { ModalButton } from '../../utilities';
import NumberGeneratorModal from '../NumberGeneratorModal';

const NumberGeneratorModalButton = ({
  buttonLabel,
  callback,
  generateButtonLabel,
  // This is the numberGenerator code, and is optional.
  // Omitting will result in all sequences appearing in select
  generator,
  id,
  generatorButtonProps,
  modalProps,
  renderBottom,
  renderTop,
  ...buttonProps
}) => {
  const modalButtonRef = useRef();

  const modalComponent = (mdProps) => (
    <NumberGeneratorModal
      callback={(generated) => {
        callback(generated);
        modalButtonRef?.current?.close();
      }}
      generateButtonLabel={generateButtonLabel}
      generator={generator}
      generatorButtonProps={generatorButtonProps}
      id={id}
      renderBottom={renderBottom}
      renderTop={renderTop}
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
          {buttonLabel ??
            <FormattedMessage id="ui-service-interaction.numberGenerator.selectGenerator" />
          }
        </Button>
      )}
    />
  );
};

NumberGeneratorModalButton.propTypes = {
  buttonLabel: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  callback: PropTypes.func.isRequired,
  generateButtonLabel: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  generator: PropTypes.string,
  id: PropTypes.string.isRequired,
  generatorButtonProps: PropTypes.object,
  modalProps: PropTypes.object,
  renderBottom: PropTypes.func,
  renderTop: PropTypes.func,
};

export default NumberGeneratorModalButton;
