import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import styles from './taskComplete.module.css';

export const TaskCompleteEffect = ({ open, onClose, timeForClose }) => {
  useEffect(() => {
    if (!open) return;

    const end = Date.now() + 1800;
    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 60,
        spread: 360,
        startVelocity: 30,
        origin: {
          x: Math.random(),
          y: Math.random() * 0.6,
        },
      });
    }, 250);

    const timeout = setTimeout(() => {
      onClose();
    }, timeForClose);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [open, onClose, timeForClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          animate={{ opacity: 1 }}
          className={styles.overlay}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            animate={{ scale: 1, opacity: 1 }}
            className={styles.content}
            initial={{ scale: 0.8, opacity: 0 }}
          >
            <h1>🎉 Задача выполнена!</h1>
            <p>Отличная работа</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
