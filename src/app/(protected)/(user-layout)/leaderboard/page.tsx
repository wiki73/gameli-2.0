import { Suspense } from 'react';
import { LeaderBoard } from '@/src/components/leaderboard/leaderboard-page';
import { Spinner } from '@/src/components/ui/spinner';
import { getLeaderboard } from '@/src/app/actions/user';

export const metadata = {
  title: 'Таблица лидеров',
  description: 'Рейтинг пользователей по уровню и опыту',
};

export default async function LeaderboardPage() {
  const initialData = await getLeaderboard({ page: 1, limit: 10 });

  return (
    <div className='w-full max-w-3xl'>
      <Suspense fallback={<Spinner />}>
        <LeaderBoard initialData={initialData} />
      </Suspense>
    </div>
  );
}
