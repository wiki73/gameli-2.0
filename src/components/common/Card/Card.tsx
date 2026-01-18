import { PropsWithChildren } from 'react';
import styles from './Card.module.css';

type Props = PropsWithChildren<{
  className?: string;
}>;

export const Card = ({ children, className }: Props) => (
  <div className={`${styles.card} ${className || ''}`}>{children}</div>
);
