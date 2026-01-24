import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HabitCard } from './HabitCard';

export const HabitsPage = () => {
  const habits = [
    { id: '1', title: 'Сделать зарядку', is_done: false },
    { id: '2', title: 'Выпить утром поленый стакан воды', is_done: false },
    { id: '3', title: 'прогулка(хотябы 15 минут)', is_done: false },
    { id: '4', title: 'позанимать спортом', is_done: false },
    { id: '5', title: 'прочитать книжку', is_done: false },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle className='pt-4 pl-4 text-3xl'>Привычки</CardTitle>
      </CardHeader>
      <CardContent>
        {!!habits &&
          habits.map(habit => (
            <HabitCard
              habit={habit}
              key={habit.id}
            />
          ))}
      </CardContent>
    </Card>
  );
};
