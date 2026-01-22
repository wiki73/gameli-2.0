import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FullScreenSpinner } from '@/components/ui/spinner';
import { LeaderList } from './LeaderList';

export const LeaderBoard = () => {
  const { data: leaders, isPending } = useQuery({
    queryKey: ['users'],
    queryFn: api.auth.user.getMany,
  });

  if (isPending) {
    return <FullScreenSpinner />;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Таблица лидеров</CardTitle>
        <CardDescription>Наши звёздочки ⭐</CardDescription>
      </CardHeader>
      <CardContent>{!!leaders && <LeaderList leaders={leaders} />}</CardContent>
    </Card>
  );
};
