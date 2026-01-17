type Day = {
  id: string;
  date: string;
};

export type DayApiType = {
  getMany: (_: { userId: string }) => Promise<Day[]>;
  create: (_: { userId: string; date: string }) => Promise<void>;
};
