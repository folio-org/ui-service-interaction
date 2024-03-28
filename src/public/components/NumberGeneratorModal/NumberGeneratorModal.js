import { forwardRef, useState } from 'react';

import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Button, Modal, ModalFooter } from '@folio/stripes/components';

import NumberGeneratorButton from '../NumberGeneratorButton';
import NumberGeneratorSelector from '../NumberGeneratorSelector/NumberGeneratorSelector';


const NumberGeneratorModal = forwardRef(({
  callback,
  displayError = true,
  displayWarning = false,
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
  const [selectedSequence, setSelectedSequence] = useState();

  return (
    <Modal
      ref={ref}
      enforceFocus={false} // Necessary to prevent it fighting focus handler in typedown
      footer={
        <ModalFooter>
          <NumberGeneratorButton
            buttonLabel={generateButtonLabel}
            callback={(generated) => {
              callback(generated);
            }}
            displayError={false} // We are dealing with error/warning manually in the modal
            displayWarning={false}
            generator={selectedSequence?.owner?.code ?? ''}
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
      <NumberGeneratorSelector
        displayError={displayError}
        displayWarning={displayWarning}
        generator={generator}
        onSequenceChange={(seq) => setSelectedSequence(seq)}
      />
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
