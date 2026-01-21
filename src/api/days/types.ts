export type Day = {
  id: string;
  date: Date;
  tasks: { count: number }[];
};

export type DayApiType = {
  getMany: (_: { userId: string }) => Promise<Day[]>;
  create: (_: { userId: string; date: Date }) => Promise<void>;
};
