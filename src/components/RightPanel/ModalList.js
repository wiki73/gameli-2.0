import { useEscapeKey } from '../../hooks/useEscapeKey';

const ModalList = ({ isOpen, onClose }) => {
  useEscapeKey(isOpen, onClose);

  return (
    <div className="modal-list">
      List Content
    </div>
  );
};

export default ModalList;
