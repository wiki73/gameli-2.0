import { useEffect } from "react";

export const useEscapeKey = (isOpen, onClose) => {
    useEffect(() => {
        if (!isOpen) return;

        function handleEscape(event) {
            if (event.key === 'Escape') {
                onClose();
            }
        }

        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);
};
