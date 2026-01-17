import { useParams } from 'react-router';
// import { useEffect, useState } from 'react';
import { CheckIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../api';
import { Card } from '@/components/common/Card/Card';
import { Timer } from '@/components/widgets/timer/Timer';
import './task-page.css';
import { Button } from '@/components/common/Button/Button';

export const TaskPage = () => {
  const { taskId } = useParams();

  const {} = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => api.getTask(taskId),
  });
  return (
    <div className='task-page'>
      <h2>Кварки</h2>
      <h3>Квантовая Физика</h3>
      <Card className='container-time'>
        <Timer />
      </Card>
      <Button className='btn-submit'>
        <CheckIcon />
        Завершить
      </Button>
    </div>
  );
};
