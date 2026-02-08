import { headers } from 'next/headers';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { auth } from '@/src/server/auth';
import { getHabitsWithEntries } from '../../actions/habits';
import { HabitCreateEditDialog } from './habits-create-edit-dialog';
import { HabitCard } from './habit-card';

export default async function HabitsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    return <div className='p-8 text-center'>Пожалуйста, авторизуйтесь</div>;
  }

  const userId = session.user.id;

  const habits = await getHabitsWithEntries(userId);

  const totalUserXp = habits.reduce((sum, habit) => sum + habit.totalXp, 0); // это для отображаения я её ещё делал когда было на vite скорее всего идея хорошая но реализация фигня

  const totalHabits = habits.length;
  const totalStreak =
    habits.length > 0 ? Math.max(...habits.map(h => h.currentStreak)) : 0; // это уже крутая готовая штука

  return (
    <div className='w-full max-w-3xl'>
      <Card className='w-full'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='text-4xl'>Привычки</CardTitle>
          <HabitCreateEditDialog
            modeForm='CREATE'
            userId={userId}
          />
        </CardHeader>
        <CardContent>
          <div className='bg-muted/50 mb-6 flex flex-wrap gap-4 rounded-lg p-4'>
            <div className='bg-primary/10 min-w-30 rounded-lg p-3 text-center'>
              <div className='text-primary text-2xl font-bold'>
                {totalHabits}
              </div>
              <div className='text-muted-foreground text-sm'>Привычек</div>
            </div>

            <div className='min-w-30 rounded-lg bg-amber-50 p-3 text-center'>
              <div className='text-2xl font-bold text-amber-700'>
                {totalStreak}
              </div>
              <div className='text-muted-foreground text-sm'>Лучший стрик</div>
            </div>

            <div className='min-w-30 rounded-lg bg-blue-50 p-3 text-center'>
              <div className='text-2xl font-bold text-blue-700'>
                {totalUserXp}
              </div>
              <div className='text-muted-foreground text-sm'>Общий XP</div>
            </div>
          </div>

          {habits.length === 0 ? (
            <div className='text-muted-foreground p-8 text-center'>
              У вас пока нет привычек. Создайте первую!
            </div>
          ) : (
            <div className='space-y-6'>
              {habits.map(habit => (
                <HabitCard
                  habit={habit}
                  key={habit.id}
                  userId={userId}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
