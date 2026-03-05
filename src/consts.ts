import type { ChartConfig } from './components/ui/chart';

export const ROUTES = {
  MAIN: '/',
  AUTH: '/auth',
  PROFILE: '/profile',
  DASHBOARD: '/dashboard',
  CATEGORY: '/category/:categoryId',
  TASK: '/task/:taskId',
  LEADERBOARD: '/leaderboard',
  HABITS: '/habits',
  CALENDAR: '/calendar',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
} as const;

export const QUERY_KEY_TYPES = {
  TASKS: 'tasks',
  TASK: 'task',
  USER_TASKS: 'user_tasks',
  CATEGORIES: 'categories',
  CATEGORY: 'category',
  USER: 'user',
  USERS: 'users',
  DAYS: 'days',
  SESSION: 'session',
  UNKNOWN: 'unknown',
} as const;

export const WEEK_DAYS = [
  { label: 'Понедельник', value: 1 },
  { label: 'Вторник', value: 2 },
  { label: 'Среда', value: 3 },
  { label: 'Четверг', value: 4 },
  { label: 'Пятница', value: 5 },
  { label: 'Суббота', value: 6 },
  { label: 'Воскресенье', value: 7 },
];

export const NAME_MIN_LENGTH = 3;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 25;

export type QueryKey =
  | {
      type: typeof QUERY_KEY_TYPES.TASKS;
      payload: { userId: string; dayId: string; page: number };
    }
  | {
      type: typeof QUERY_KEY_TYPES.TASK;
      payload: { taskId: string };
    }
  | {
      type: typeof QUERY_KEY_TYPES.USER_TASKS;
      payload: { userId: string };
    }
  | {
      type: typeof QUERY_KEY_TYPES.CATEGORIES;
      payload: { userId: string; page: number | 'all' };
    }
  | {
      type: typeof QUERY_KEY_TYPES.CATEGORY;
      payload: { categoryId: string };
    }
  | {
      type: typeof QUERY_KEY_TYPES.USER;
      payload: object;
    }
  | {
      type: typeof QUERY_KEY_TYPES.USERS;
      payload: { page: number };
    }
  | {
      type: typeof QUERY_KEY_TYPES.DAYS;
      payload: { userId: string };
    }
  | {
      type: typeof QUERY_KEY_TYPES.SESSION;
      payload: object;
    }
  | {
      type: typeof QUERY_KEY_TYPES.UNKNOWN;
      payload: object;
    };

export const getQueryKey = (key: QueryKey): string[] => {
  switch (key.type) {
    case QUERY_KEY_TYPES.TASKS:
      return [
        QUERY_KEY_TYPES.TASKS,
        key.payload.userId,
        key.payload.dayId,
        String(key.payload.page),
      ];
    case QUERY_KEY_TYPES.TASK:
      return [QUERY_KEY_TYPES.TASK, key.payload.taskId];
    case QUERY_KEY_TYPES.USER_TASKS:
      return [QUERY_KEY_TYPES.USER_TASKS, key.payload.userId];
    case QUERY_KEY_TYPES.CATEGORIES:
      return [
        QUERY_KEY_TYPES.CATEGORIES,
        key.payload.userId,
        String(key.payload.page),
      ];
    case QUERY_KEY_TYPES.CATEGORY:
      return [QUERY_KEY_TYPES.CATEGORY, key.payload.categoryId];
    case QUERY_KEY_TYPES.USER:
      return [QUERY_KEY_TYPES.USER];
    case QUERY_KEY_TYPES.USERS:
      return [QUERY_KEY_TYPES.USERS, String(key.payload.page)];
    case QUERY_KEY_TYPES.DAYS:
      return [QUERY_KEY_TYPES.DAYS, key.payload.userId];
    case QUERY_KEY_TYPES.SESSION:
      return [QUERY_KEY_TYPES.SESSION];
    default:
      return [QUERY_KEY_TYPES.UNKNOWN];
  }
};

export const TIME = {
  SECONDS_IN_MINUTE: 60,
  MINUTE_IN_HOUR: 60,
  HOURS_IN_DAY: 24,
  SECOND: 1000,
  MINUTE: 60_000,
  HOUR: 3_600_000,
  DAY: 86_400_000,
} as const;

export const LEVELS = {
  L3: 3,
  L7: 7,
  L10: 10,
  L15: 15,
  L20: 20,
  L25: 25,
  L30: 30,
  L35: 35,
  L40: 40,
  L45: 45,
} as const;

const EXPERIENCE_DEFAULT = {
  VERY_LOW: 200,
  LOW: 300,
  MEDIUM: 500,
  HIGH: 750,
  VERY_HIGH: 1000,
} as const;

export const EXPERIENCE = {
  VERY_LOW: EXPERIENCE_DEFAULT.VERY_LOW,
  LOW: EXPERIENCE_DEFAULT.LOW,
  MEDIUM: EXPERIENCE_DEFAULT.MEDIUM,
  HIGH: EXPERIENCE_DEFAULT.HIGH,
  VERY_HIGH: EXPERIENCE_DEFAULT.VERY_HIGH,
} as const;

export const TIME_INTERVALS = {
  LOW: 15,
  MEDIUM: 30,
  HIGH: 60,
  VERY_HIGH: 90,
} as const;

export const TIME_INTERVAL_RATIOS = {
  LOW: 0.75,
  MEDIUM: 1,
  HIGH: 1.5,
  VERY_HIGH: 2,
} as const;

export const MAX_CATEGORY_RATIO = 5;
export const DEFAUL_CATEGORY_RATIO = 2.5;
export const MIN_CATEGORY_RATIO = 1;
export const EXPERIENCE_CALCULATION_RATIO = 100;
export const HUNDRED_PERCENT = 100;

export const LEVEL_THRESHOLDS = [
  { level: LEVELS.L3, expPerLevel: EXPERIENCE.VERY_LOW },
  { level: LEVELS.L7, expPerLevel: EXPERIENCE.LOW },
  { level: LEVELS.L10, expPerLevel: EXPERIENCE.LOW },
  { level: LEVELS.L15, expPerLevel: EXPERIENCE.MEDIUM },
  { level: LEVELS.L20, expPerLevel: EXPERIENCE.MEDIUM },
  { level: LEVELS.L25, expPerLevel: EXPERIENCE.MEDIUM },
  { level: LEVELS.L30, expPerLevel: EXPERIENCE.HIGH },
  { level: LEVELS.L35, expPerLevel: EXPERIENCE.HIGH },
  { level: LEVELS.L40, expPerLevel: EXPERIENCE.VERY_HIGH },
  { level: Infinity, expPerLevel: EXPERIENCE.VERY_HIGH },
] as const;

const ACCUMULATED_EXP: number[] = [];
let acc = 0;

for (const [i, current] of LEVEL_THRESHOLDS.entries()) {
  const prev = i > 0 ? LEVEL_THRESHOLDS[i - 1] : undefined;

  ACCUMULATED_EXP[i] = acc;

  const delta =
    i === 0
      ? current.level
      : current.level === Infinity
        ? 0
        : current.level - (prev?.level ?? 0);

  acc += delta * current.expPerLevel;
}

export const PROGRESS_BAR_ANIMATION_DURATIONS = {
  SHORT: 1,
  LONG: 2.8,
} as const;

export const PAGE_SIZES = {
  [QUERY_KEY_TYPES.USERS]: 10,
  [QUERY_KEY_TYPES.CATEGORIES]: 10,
  [QUERY_KEY_TYPES.TASKS]: 10,
} as const;

/**
 * Function for getting color css variable by subject level to use in styles.
 * @param level subject (User or Category) Level
 * @returns css color variable
 */
export const getColorBySubjectLevel = (level = 0): string => {
  if (level < LEVELS.L7) return '--level-3';
  if (level < LEVELS.L10) return '--level-7';
  if (level < LEVELS.L15) return '--level-10';
  if (level < LEVELS.L20) return '--level-15';
  if (level < LEVELS.L25) return '--level-20';
  if (level < LEVELS.L30) return '--level-25';
  if (level < LEVELS.L35) return '--level-30';
  if (level < LEVELS.L40) return '--level-35';
  if (level < LEVELS.L45) return '--level-40';
  return '--level-45';
};

export const getExperienceByLevel = (level: number): number => {
  if (level <= 0) return 0;

  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    const current = LEVEL_THRESHOLDS[i];
    if (!current) continue;

    const prev = i > 0 ? LEVEL_THRESHOLDS[i - 1] : undefined;

    const thresholdLevel =
      current.level === Infinity ? Number.MAX_SAFE_INTEGER : current.level;
    const prevLevel = prev ? prev.level : 0;

    const expPerLevel = current.expPerLevel ?? 0;
    const prevExp = ACCUMULATED_EXP[i] ?? 0;

    if (level < thresholdLevel) {
      return prevExp + (level - prevLevel) * expPerLevel;
    }
  }

  // Если уровень выше всех
  const lastIndex = LEVEL_THRESHOLDS.length - 1;
  const lastExp = ACCUMULATED_EXP[lastIndex] ?? 0;
  const lastExpPerLevel = LEVEL_THRESHOLDS[lastIndex]?.expPerLevel ?? 0;

  return lastExp + (level - LEVELS.L45) * lastExpPerLevel;
};

export const getLevelByExperience = (experience: number): number => {
  if (experience <= 0) return 1;

  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    const current = LEVEL_THRESHOLDS[i];
    if (!current) continue;

    const prev = i > 0 ? LEVEL_THRESHOLDS[i - 1] : undefined;

    const thresholdLevel =
      current.level === Infinity ? Number.MAX_SAFE_INTEGER : current.level;
    const prevLevel = prev ? prev.level : 0;

    const expPerLevel = current.expPerLevel ?? 0;
    const prevExp = ACCUMULATED_EXP[i] ?? 0;

    const blockExp = (thresholdLevel - prevLevel) * expPerLevel;

    if (experience < prevExp + blockExp) {
      return Math.max(
        1,
        Math.floor(prevLevel + (experience - prevExp) / expPerLevel),
      );
    }
  }

  const lastIndex = LEVEL_THRESHOLDS.length - 1;
  const lastLevel = LEVELS.L45;
  const lastExp = ACCUMULATED_EXP[lastIndex] ?? 0;
  const lastExpPerLevel = LEVEL_THRESHOLDS[lastIndex]?.expPerLevel ?? 0;

  return lastLevel + (experience - lastExp) / lastExpPerLevel;
};

/**
 * Returns time interval ratio for task.
 * @param time Time in seconds
 * @returns time interval ratio
 */
export const getTimeIntervarRatio = (time: number): number => {
  const minutes = Math.trunc(time / TIME.SECONDS_IN_MINUTE);
  switch (true) {
    case minutes <= TIME_INTERVALS.LOW:
      return TIME_INTERVAL_RATIOS.LOW;
    case minutes <= TIME_INTERVALS.MEDIUM:
      return TIME_INTERVAL_RATIOS.MEDIUM;
    case minutes <= TIME_INTERVALS.HIGH:
      return TIME_INTERVAL_RATIOS.HIGH;
    default:
      return TIME_INTERVAL_RATIOS.VERY_HIGH;
  }
};

/**
 * Returns experience earned by time spent on task.
 * @param time Time in seconds
 * @param categoryRatio Category ratio
 * @returns experience earned
 */
export const getExperience = (time: number, categoryRatio?: number): number => {
  if (
    !categoryRatio ||
    categoryRatio < MIN_CATEGORY_RATIO ||
    categoryRatio > MAX_CATEGORY_RATIO ||
    time <= 0
  )
    return 0;

  return Math.round(
    (time * categoryRatio * getTimeIntervarRatio(time)) /
      EXPERIENCE_CALCULATION_RATIO,
  );
};

export const chartConfig = {
  total: {
    label: 'Всего',
    theme: {
      light: 'var(--chart-light-3)',
      dark: 'var(--chart-dark-1)',
    },
  },
  completed: {
    label: 'Выполнено',
    theme: {
      light: 'var(--chart-light-2)',
      dark: 'var(--chart-dark-2)',
    },
  },
  level: {
    label: 'Уровень',
    theme: {
      light: 'var(--chart-light-3)',
      dark: 'var(--chart-dark-1)',
    },
  },
  experience: {
    label: 'Опыт',
    theme: {
      light: 'var(--chart-light-2)',
      dark: 'var(--chart-dark-2)',
    },
  },
} satisfies ChartConfig;

export type BarData = {
  currentExp: number | undefined;
  addExperience: number | undefined;
  level: number | undefined;
  categoryName: string | undefined;
};

export const getWeekdayColor = (date: Date) => {
  const day = date.getDay();

  const map = [
    {
      accent: 'bg-[var(--sunday)]',
      light: 'bg-[var(--sunday-light)]',
      text: 'text-[var(--sunday)]',
      ring: 'ring-3 ring-[var(--sunday)]',
      shadow: 'shadow-[0_0_20px_var(--sunday)]',
    },
    {
      accent: 'bg-[var(--monday)]',
      light: 'bg-[var(--monday-light)]',
      text: 'text-[var(--monday)]',
      ring: 'ring-3 ring-[var(--monday)]',
      shadow: 'shadow-[0_0_20px_var(--monday)]',
    },
    {
      accent: 'bg-[var(--tuesday)]',
      light: 'bg-[var(--tuesday-light)]',
      text: 'text-[var(--tuesday)]',
      ring: 'ring-3 ring-[var(--tuesday)]',
      shadow: 'shadow-[0_0_20px_var(--tuesday)]',
    },
    {
      accent: 'bg-[var(--wednesday)]',
      light: 'bg-[var(--wednesday-light)]',
      text: 'text-[var(--wednesday)]',
      ring: 'ring-3 ring-[var(--wednesday)]',
      shadow: 'shadow-[0_0_20px_var(--wednesday)]',
    },
    {
      accent: 'bg-[var(--thursday)]',
      light: 'bg-[var(--thursday-light)]',
      text: 'text-[var(--thursday)]',
      ring: 'ring-3 ring-[var(--thursday)]',
      shadow: 'shadow-[0_0_20px_var(--thursday)]',
    },
    {
      accent: 'bg-[var(--friday)]',
      light: 'bg-[var(--friday-light)]',
      text: 'text-[var(--friday)]',
      ring: 'ring-3 ring-[var(--friday)]',
      shadow: 'shadow-[0_0_20px_var(--friday)]',
    },
    {
      accent: 'bg-[var(--saturday)]',
      light: 'bg-[var(--saturday-light)]',
      text: 'text-[var(--saturday)]',
      ring: 'ring-3 ring-[var(--saturday)]',
      shadow: 'shadow-[0_0_20px_var(--saturday)]',
    },
  ];

  return map[day];
};
