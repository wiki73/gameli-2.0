import { LeaderBoard } from '@/src/components/leaderboard/leaderboard-page';
import { DailyLeaders } from '@/src/components/leaderboard/daily-leaders';
import { getDailyLeaders, getLeaderboard } from '@/src/app/actions/user';

export const metadata = {
  title: 'Таблица лидеров',
  description: 'Рейтинг пользователей по уровню и опыту',
};

export default async function LeaderboardPage() {
  const [leaderboardData, dailyLeadersData] = await Promise.all([
    getLeaderboard({ page: 1, limit: 10 }),
    getDailyLeaders({ limit: 5 }),
  ]);

  return (
    <div className='container mx-auto space-y-8 py-8'>
      <DailyLeaders initialData={dailyLeadersData} />
      <LeaderBoard initialData={leaderboardData} />
    </div>
  );
}
