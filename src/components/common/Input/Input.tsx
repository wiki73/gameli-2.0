import { InputHTMLAttributes } from 'react';
import classes from './Input.module.pcss';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = ({ label, error, id, ...props }: Props) => {
  return (
    <div className={classes.root}>
      {label && (
        <label
          className={classes.label}
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <input
        className={classes.input}
        id={id}
        {...props}
      />
      {error && <p className={classes.error}>{error}</p>}
    </div>
  );
};
