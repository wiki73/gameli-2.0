import { useEscapeKey } from '../../../../hooks/useEscapeKey';

const ModalInventory = ({ isOpen, onClose }) => {
  useEscapeKey(isOpen, onClose);

  return (
    <div className='modal-invent'>
      <h2>Инвентарь</h2>
    </div>
  );
};

export default ModalInventory;
