'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';

type User = {
  id: string;
  name: string;
  level: number;
  experience: number;
  image: string | null;
};

type Props = {
  leaders: User[];
};

export const LeaderList = ({ leaders }: Props) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className='w-25'>Место</TableHead>
        <TableHead>Имя</TableHead>
        <TableHead>Уровень</TableHead>
        <TableHead className='text-right'>Опыт</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {leaders.map((user, index) => (
        <TableRow key={user.id}>
          <TableCell className='font-medium'>{index + 1}</TableCell>
          <TableCell className='flex items-center gap-2'>
            {user.image && (
              <img
                alt={user.name || ''}
                className='h-6 w-6 rounded-full'
                src={user.image}
              />
            )}
            {user.name}
          </TableCell>
          <TableCell>{user.level}</TableCell>
          <TableCell className='text-right'>{user.experience}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
