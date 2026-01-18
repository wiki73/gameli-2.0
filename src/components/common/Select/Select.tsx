import { useEffect, useRef, useState } from 'react';
import styles from './Select.module.pcss';

export type SelectOption<T extends string = string> = {
  value: T;
  label: string;
  disabled?: boolean;
};

export type SelectProps<T extends string = string> = {
  value?: T;
  options: SelectOption<T>[];
  placeholder?: string;
  onChange: (value: T) => void;
  className?: string;
};

export const Select = <T extends string>({
  value,
  options,
  placeholder = 'Select...',
  onChange,
  className,
}: SelectProps<T>) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find(o => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div
      className={[styles.root, open && styles.open, className]
        .filter(Boolean)
        .join(' ')}
      ref={ref}
    >
      <button
        aria-expanded={open}
        aria-haspopup='listbox'
        className={styles.trigger}
        onClick={() => setOpen(o => !o)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(o => !o);
          }
          if (e.key === 'Escape') {
            setOpen(false);
          }
        }}
        type='button'
      >
        <span>{selected?.label ?? placeholder}</span>
        <Chevron className={styles.chevron} />
      </button>

      {open && (
        <ul
          className={styles.content}
          role='listbox'
        >
          {options.map(option => (
            <li
              aria-selected={option.value === value}
              className={[
                styles.item,
                option.value === value && styles.selected,
                option.disabled && styles.disabled,
              ]
                .filter(Boolean)
                .join(' ')}
              key={option.value}
              onClick={() => {
                if (option.disabled) return;
                onChange(option.value);
                setOpen(false);
              }}
              role='option'
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Chevron = ({ className }: { className?: string }) => (
  <svg
    className={className}
    height='16'
    viewBox='0 0 24 24'
    width='16'
  >
    <path
      d='M6 9l6 6 6-6'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
    />
  </svg>
);
