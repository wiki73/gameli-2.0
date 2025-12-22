import { useEscapeKey } from "../../hooks/useEscapeKey";

function ModalInventory({ isOpen, onClose }) {
    useEscapeKey(isOpen, onClose);

    return (
        <div className="modal-invent">
            <h2>Инвентарь</h2>
        </div>
    );
}

export default ModalInventory;
