import { useState, useEffect, useRef } from 'react';
import './ModalWindowAddTask.css';
import { TASK_SIZES, TASK_SIZE_LABELS } from '../../constants/taskSizes';

function ModalWindowAddTask({ addGoals }) {
    const [open, setOpen] = useState(false);
    const inputRef = useRef(null);
    const isFocusedRef = useRef(false);
    const [selectedSize, setSelectedSize] = useState(TASK_SIZES.LITTLE);


    useEffect(() => {
        function handleEscape(event) {
            if (event.key === 'Escape') setOpen(false);
        }
        function handle123(event) {
            if (!isFocusedRef.current) {
                const key = event.key;
                let size = null;
                if (key === '1' || key === '!') size = TASK_SIZES.LITTLE;
                else if (key === '2' || key === '@') size = TASK_SIZES.MEDIUM;
                else if (key === '3' || key === '#') size = TASK_SIZES.LARGE;
                if (!size) return;
                setSelectedSize(size);
            }
        }
        if (open) {
            document.addEventListener('keydown', handleEscape);
            document.addEventListener('keydown', handle123);
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('keydown', handle123);
        };
    }, [open]);

    useEffect(() => {
        function handleAltT(e) {
            if (e.altKey && e.code === 'KeyT') {
                e.preventDefault();
                setOpen(true);
            }
        }
        document.addEventListener('keydown', handleAltT);
        return () => document.removeEventListener('keydown', handleAltT);
    }, []);

    // focus the input when modal opens
    useEffect(() => {
        if (!open) return;
        // ensure element is in DOM, defer to next tick
        const id = setTimeout(() => {
            inputRef.current?.focus({ preventScroll: true });
        }, 0);
        return () => clearTimeout(id);
    }, [open]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const description = e.target.description.value.trim();
        const sizeTask = e.target.taskSize.value;
        
        if (!description) return;
        
        if (typeof addGoals === 'function') {
            addGoals(description, sizeTask);
        }
        
        setOpen(false);
        e.target.reset();
    };
     
    return (
        <>  
        <div className='btn'>
            <button className='add-modal-window-btn' onClick={() => setOpen(true)}>Добавить задачу</button>
        </div>
            {open && (
                <div className="modal-overlay"  onClick={() => setOpen(false)}>
                    <form className="ModalWindowAddTask" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} >
                        <input className='text-input' tabIndex={1} ref={inputRef} type="text" name="description" onFocus={() => isFocusedRef.current = true} onBlur={() => isFocusedRef.current =false}/>
                        <div className='radio-btn'>
                            <input 
                                type="radio"
                                name="taskSize"
                                value={TASK_SIZES.LITTLE}
                                defaultChecked
                                checked={selectedSize === TASK_SIZES.LITTLE}
                                onChange={(e) => setSelectedSize(e.target.value)} 
                            /> {TASK_SIZE_LABELS[TASK_SIZES.LITTLE]}
                            <input 
                                type="radio"
                                name="taskSize"
                                value={TASK_SIZES.MEDIUM}
                                checked={selectedSize === TASK_SIZES.MEDIUM}
                                onChange={(e) => setSelectedSize(e.target.value)} 
                            /> {TASK_SIZE_LABELS[TASK_SIZES.MEDIUM]}
                            <input 
                                type="radio" 
                                name="taskSize"
                                value={TASK_SIZES.LARGE}
                                checked={selectedSize === TASK_SIZES.LARGE}
                                onChange={(e) => setSelectedSize(e.target.value)} 
                            /> {TASK_SIZE_LABELS[TASK_SIZES.LARGE]}
                        </div>
                        <button className='button-submit' tabIndex={2} type="submit">Отправить</button>
                        <button className="button-close" onClick={() => setOpen(false)}>x</button>
                    </form>
                </div>
            )}

        </>
    );
}

export default ModalWindowAddTask;