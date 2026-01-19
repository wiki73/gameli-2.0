import { InputHTMLAttributes } from 'react';
import classes from './Input.module.pcss';

type Props = InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  as?: 'textarea';
};

export const Input = ({ label, error, id, as, ...props }: Props) => (
  <div className={classes.root}>
    {label && (
      <label
        className={classes.label}
        htmlFor={id}
      >
        {label}
      </label>
    )}
    {as === 'textarea' ? (
      <textarea
        className={classes.input}
        id={id}
        {...props}
      />
    ) : (
      <input
        className={classes.input}
        id={id}
        {...props}
      />
    )}
    {error && <p className={classes.error}>{error}</p>}
  </div>
);
