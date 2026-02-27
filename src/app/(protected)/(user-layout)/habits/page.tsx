import { headers } from 'next/headers';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { auth } from '@/src/server/auth';
import { getHabitsWithEntries } from '@/src/app/actions/habits';
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
    <div className='w-full px-2 py-2'>
      <Card className='w-full'>
        <CardHeader className='flex flex-col gap-2 px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4'>
          <CardTitle className='text-2xl sm:text-4xl'>Привычки</CardTitle>
          <HabitCreateEditDialog
            modeForm='CREATE'
            userId={userId}
          />
        </CardHeader>

        <CardContent className='px-2 sm:px-6'>
          <div className='bg-muted/50 mb-4 grid grid-cols-3 gap-1 rounded-lg p-2 sm:mb-6 sm:gap-3 sm:p-4'>
            <div className='bg-primary/10 rounded-lg p-2 text-center sm:p-4'>
              <div className='text-primary text-lg font-bold sm:text-2xl'>
                {totalHabits}
              </div>
              <div className='text-muted-foreground text-[10px] leading-tight sm:text-sm'>
                Привычек
              </div>
            </div>

            <div className='rounded-lg bg-amber-50 p-2 text-center sm:p-4'>
              <div className='text-lg font-bold text-amber-700 sm:text-2xl'>
                {totalStreak}
              </div>
              <div className='text-muted-foreground text-[10px] leading-tight sm:text-sm'>
                Лучший стрик
              </div>
            </div>

            <div className='rounded-lg bg-blue-50 p-2 text-center sm:p-4'>
              <div className='text-lg font-bold text-blue-700 sm:text-2xl'>
                {totalUserXp}
              </div>
              <div className='text-muted-foreground text-[10px] leading-tight sm:text-sm'>
                Общий XP
              </div>
            </div>
          </div>

          {habits.length === 0 ? (
            <div className='text-muted-foreground p-4 text-center text-sm sm:p-8'>
              У вас пока нет привычек. Создайте первую!
            </div>
          ) : (
            <div className='space-y-3 sm:space-y-6'>
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
