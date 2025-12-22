import { useEscapeKey } from "../../hooks/useEscapeKey";

function ModalList({ isOpen, onClose }) {
    useEscapeKey(isOpen, onClose);

    return (
        <div className="modal-list">
            List Content
        </div>
    );
}

export default ModalList;
