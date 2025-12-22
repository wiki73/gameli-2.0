import React, { useState, useEffect, useRef, useContext } from 'react';
import './ModalWindowAddTask.css';

function ModalWindowAddTask({ addGoals }) {
    const [open, setOpen] = useState(false);
    const inputRef = useRef(null);
    const isFocusedRef = useRef(false);
    const [selectedSize, setSelectedSize] = useState('little');


    useEffect(() => {
        function handleEscape(event) {
            if (event.key === 'Escape') setOpen(false);
        }
        function handle123(event) {
            // only when modal is open; map 1/2/3 to little/medium/large
            if (!isFocusedRef.current) {
                const key = event.key;
                let size = null;
                if (key === '1' || key === '!' ) size = 'little';
                else if (key === '2' || key === '@') size = 'medium';
                else if (key === '3' || key === '#') size = 'large';
                if (!size) return;
                console.log("Выбран размер:", size);
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
        if (typeof addGoals === 'function'){
            console.log("Зашло 2")
            addGoals(description, sizeTask);
        } 
        setOpen(false);
        e.target.reset();
    }
     
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
                            value="little"
                                defaultChecked
                                checked={selectedSize === 'little'}
                                onChange={(e) => setSelectedSize(e.target.value)} /> Мелкая
                            <input type="radio"
                            name="taskSize"
                            value="medium"
                            checked={selectedSize === 'medium'}
                                onChange={(e) => setSelectedSize(e.target.value)} /> Средняя
                            <input 
                            type="radio" 
                            name="taskSize"
                            value="large"
                            checked={selectedSize === 'large'}
                                onChange={(e) => setSelectedSize(e.target.value)} /> Большая
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