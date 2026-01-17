import { useParams } from 'react-router';
// import { useEffect, useState } from 'react';
import { CheckIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '../../../api/api';
import { FullScreenSpinner } from '../../common/spinner/FullScreenSpinner';
import classes from './task-page.module.css';
import { Card } from '@/components/common/Card/Card';
import { Timer } from '@/components/widgets/timer/Timer';
import { Button } from '@/components/common/Button/Button';

export const TaskPage = () => {
  const { taskId } = useParams();
  const [modeForTimer, setModeForTimer] = useState('TIMER');

  const { data: task, isFetching } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => api.tasks.getOne({ id: taskId }),
    enabled: !!taskId,
  });

  const { data: category, isFetching: isCategoryFetching } = useQuery({
    queryKey: ['category', task],
    queryFn: () => api.categories.getOne({ id: task.category_id }),
    enabled: !!taskId,
  });

  if (isFetching || isCategoryFetching) {
    return <FullScreenSpinner />;
  }

  const handelSubmit = () => {
    setModeForTimer('COMPLEET');
  };
  const handelPause = () => {
    if (modeForTimer === 'TIMER') {
      setModeForTimer('PAUSE');
    } else {
      setModeForTimer('TIMER');
    }
  };

  return (
    <div className={classes.taskPage}>
      <h2 className={classes.title}>{task.title}</h2>
      <h3 className={classes.category}>{category.name}</h3>
      <Card className={classes.containerTime}>
        <Timer mode={modeForTimer} />
        {modeForTimer === 'COMPLEET' && (
          <div className={classes.containerForCompleet}>
            <h4>Заработанно</h4>
            <div className={classes.textForCompleet}>
              <p>Опыт</p>
              <p>{274}</p>
            </div>
            <div className={classes.textForCompleet}>
              <div>Опыт</div>
              <div>{23}</div>
            </div>
          </div>
        )}
      </Card>
      <Button
        className={classes.btnSubmit}
        onClick={handelSubmit}
      >
        <CheckIcon />
        Завершить
      </Button>
      <Button onClick={handelPause}>
        {modeForTimer === 'TIMER' || modeForTimer === 'COMPLEET' ? (
          <p>Пауза</p>
        ) : (
          <p>Снять паузы</p>
        )}
      </Button>
    </div>
  );
};
