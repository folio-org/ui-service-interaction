import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import contains from 'dom-helpers/query/contains';

const ModalButton = ({
  id,
  renderModal,
  renderTrigger,
  ...props
}) => {
  const triggerId = `clickable-${id}-trigger`;

  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useRef();
  const modalTrigger = useRef();

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false, () => {
      if (
        modalRef.current &&
        modalTrigger.current &&
        contains(modalRef.current, document.activeElement)
      ) {
        // Move focus back to trigger if it was inside the modal
        modalTrigger.current.focus();
      }

      if (props.onClose) {
        props.onClose();
      }
    });
  };

  return (
    <>
      {
        renderTrigger({
          buttonRef: modalTrigger,
          id: triggerId,
          onClick: openModal,
        })
      }
      {
        renderModal({
          ref: modalRef,
          dismissible: true,
          onClose: closeModal,
          open: modalOpen,
          ...props
        })
      }
    </>
  );
};

export default ModalButton;
