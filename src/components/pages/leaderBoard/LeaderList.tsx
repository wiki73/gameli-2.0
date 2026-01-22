import type { User } from '@/api/auth/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
      {leaders.map(({ id, name, level, exp }, index) => (
        <TableRow key={id}>
          <TableCell className='font-medium'>{index + 1}</TableCell>
          <TableCell>{name}</TableCell>
          <TableCell>{level}</TableCell>
          <TableCell className='text-right'>{exp}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
