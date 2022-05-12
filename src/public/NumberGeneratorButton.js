import { Button, Modal, Select } from '@folio/stripes/components';
import { ModalButton } from './utilities';

const NumberGeneratorButton = ({
  id
}) => {
  const modalComponent = (modalProps) => (
    <Modal
      {...modalProps}
    >
      <Select
        dataOptions={[
          {
            id: '12345',
            value: 'staff'
          },
          {
            id: '23456',
            value: 'patron'
          },
          {
            id: '34567',
            value: 'noformat'
          }
        ]}
      />
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
