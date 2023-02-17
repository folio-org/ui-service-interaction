import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import contains from 'dom-helpers/query/contains';

const ModalButton = forwardRef(({
  id,
  onClose,
  renderModal,
  renderTrigger,
  ...props
}, ref) => {
  const triggerId = `clickable-trigger-modal-${id}`;

  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useRef();
  const modalTrigger = useRef();

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    if (
      modalRef.current &&
      modalTrigger.current &&
      contains(modalRef.current, document.activeElement)
    ) {
      // Move focus back to trigger if it was inside the modal
      modalTrigger.current.focus();
    }

    if (onClose) {
      onClose();
    }
  };

  useImperativeHandle(ref, () => ({
    close: closeModal,
    open: openModal
  }));

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
});

ModalButton.propTypes = {
  id: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  renderModal: PropTypes.func.isRequired,
  renderTrigger: PropTypes.func.isRequired
};

export default ModalButton;
