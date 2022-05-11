import { Button, Modal } from '@folio/stripes/components';
import { ModalButton } from './utilities';

const NumberGeneratorButton = ({
  id
}) => {
  const modalComponent = (modalProps) => (
    <Modal
      {...modalProps}
    >
      <div>Hello world modal</div>
    </Modal>
  );

  return (
    <ModalButton
      id={`number-generator-${id}`}
      renderModal={modalComponent}
      renderTrigger={(buttonProps) => (
        <Button
          {...buttonProps}
        >
          FIXME Generate
        </Button>
      )}
    />
  );
};

export default NumberGeneratorButton;
