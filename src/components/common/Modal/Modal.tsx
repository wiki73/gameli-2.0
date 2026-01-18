import { Cross1Icon } from '@radix-ui/react-icons';
import { PropsWithChildren, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.pcss';

type Props = PropsWithChildren<{
  isOpen: boolean;
  onClose?: () => void;
}>;

export const Modal = ({ isOpen, onClose, children }: Props) => {
  const [open, setOpen] = useState(isOpen);

  const closeModal = () => {
    onClose?.();
    setOpen(false);
  };

  if (!open) return null;

  return createPortal(
    <div
      className={styles.modalOverlay}
      onClick={closeModal}
    >
      <div
        className={styles.modalContent}
        onClick={e => e.stopPropagation()}
      >
        <button
          className={styles.modalCloseButton}
          onClick={closeModal}
          type='button'
        >
          <Cross1Icon />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
};
