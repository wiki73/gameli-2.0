import styles from './Input.module.css';

export const Input = ({
  autoComplete,
  id,
  type,
  value,
  onChange,
  placeholder,
  max,
  min,
  as,
}) => {
  return (
    <div className={styles.wrapper}>
      <label
        className={styles.label}
        htmlFor={id}
      >
        {placeholder}
      </label>
      {as === 'textarea' ? (
        <textarea
          autoComplete={autoComplete}
          className={styles.input}
          id={id}
          onChange={onChange}
          placeholder={placeholder}
          type={type}
          value={value}
        />
      ) : (
        <input
          autoComplete={autoComplete}
          className={styles.input}
          id={id}
          max={max}
          min={min}
          onChange={onChange}
          placeholder={placeholder}
          type={type}
          value={value}
        />
      )}
    </div>
  );
};
