import styles from './Select.module.css';

export const Select = ({ options, defaultValue, onClick, value }) => {
  return (
    <select
      className={styles.select}
      defaultValue={defaultValue}
      onChange={onClick}
      value={value}
    >
      {options.map(option => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};
