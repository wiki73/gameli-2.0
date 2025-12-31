import { useEffect, useRef, useState } from 'react';
import { TASK_SIZE_LABELS, TASK_SIZES } from '../../../../constants/taskSizes';
import './ModalWindowAddTask.css';

const ModalWindowAddTask = ({ addGoals }) => {
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

  const handleSubmit = e => {
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
        <button
          className='add-modal-window-btn'
          onClick={() => setOpen(true)}
          type='button'
        >
          Добавить задачу
        </button>
      </div>
      {open ? (
        <div
          className='modal-overlay'
          onClick={() => setOpen(false)}
        >
          <form
            className='ModalWindowAddTask'
            onClick={e => e.stopPropagation()}
            onSubmit={handleSubmit}
          >
            <input
              className='text-input'
              name='description'
              onBlur={() => (isFocusedRef.current = false)}
              onFocus={() => (isFocusedRef.current = true)}
              ref={inputRef}
              tabIndex={1}
              type='text'
            />
            <div className='radio-btn'>
              <input
                checked={selectedSize === TASK_SIZES.LITTLE}
                name='taskSize'
                onChange={e => setSelectedSize(e.target.value)}
                type='radio'
                value={TASK_SIZES.LITTLE}
              />{' '}
              {TASK_SIZE_LABELS[TASK_SIZES.LITTLE]}
              <input
                checked={selectedSize === TASK_SIZES.MEDIUM}
                name='taskSize'
                onChange={e => setSelectedSize(e.target.value)}
                type='radio'
                value={TASK_SIZES.MEDIUM}
              />{' '}
              {TASK_SIZE_LABELS[TASK_SIZES.MEDIUM]}
              <input
                checked={selectedSize === TASK_SIZES.LARGE}
                name='taskSize'
                onChange={e => setSelectedSize(e.target.value)}
                type='radio'
                value={TASK_SIZES.LARGE}
              />{' '}
              {TASK_SIZE_LABELS[TASK_SIZES.LARGE]}
            </div>
            <button
              className='button-submit'
              tabIndex={3}
              type='submit'
            >
              Отправить
            </button>
            <button
              className='button-close'
              onClick={() => setOpen(false)}
              type='button'
            >
              x
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
};

export default ModalWindowAddTask;
