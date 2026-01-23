import type { Category } from './api/categories/types';
import type { Task } from './api/tasks/types';
import type { User } from './api/auth/types';

const getEnv = <K extends keyof ImportMetaEnv>(key: K): ImportMetaEnv[K] => {
  const value = import.meta.env[key];

  if (!value) {
    throw new Error(`Missing env variable: ${String(key)}`);
  }

  return value;
};

export const supabaseConfig = {
  url: getEnv('VITE_SUPABASE_URL'),
  key: getEnv('VITE_SUPABASE_KEY'),
};

export const ROUTES = {
  MAIN: '/',
  AUTH: '/auth',
  PROFILE: '/profile',
  DASHBOARD: '/dashboard',
  TASK: '/task/:taskId',
  LEADERBOARD: '/leaderboard',
} as const;

export const QUERY_KEY_TYPES = {
  TASKS: 'tasks',
  TASK: 'task',
  USER_TASKS: 'user_tasks',
  CATEGORIES: 'categories',
  USER: 'user',
  USERS: 'users',
  DAYS: 'days',
  SESSION: 'session',
} as const;

export type QueryKey =
  | {
      type: typeof QUERY_KEY_TYPES.TASKS;
      payload: { userId: string; dayId: string };
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
      payload: { userId: string };
    }
  | {
      type: typeof QUERY_KEY_TYPES.USER;
      payload: object;
    }
  | {
      type: typeof QUERY_KEY_TYPES.USERS;
      payload: object;
    }
  | {
      type: typeof QUERY_KEY_TYPES.DAYS;
      payload: { userId: string };
    }
  | {
      type: typeof QUERY_KEY_TYPES.SESSION;
      payload: object;
    };

export const getQueryKey = (key: QueryKey): string[] => {
  switch (key.type) {
    case QUERY_KEY_TYPES.TASKS:
      return [QUERY_KEY_TYPES.TASKS, key.payload.userId, key.payload.dayId];
    case QUERY_KEY_TYPES.USER_TASKS:
      return [QUERY_KEY_TYPES.TASKS, key.payload.userId];
    case QUERY_KEY_TYPES.CATEGORIES:
      return [QUERY_KEY_TYPES.CATEGORIES, key.payload.userId];
    case QUERY_KEY_TYPES.USER:
      return [QUERY_KEY_TYPES.USER];
    case QUERY_KEY_TYPES.USERS:
      return [QUERY_KEY_TYPES.USERS];
    case QUERY_KEY_TYPES.DAYS:
      return [QUERY_KEY_TYPES.DAYS, key.payload.userId];
    case QUERY_KEY_TYPES.SESSION:
      return [QUERY_KEY_TYPES.SESSION];
    default:
      throw new Error('Invalid query key type');
  }
};

export const TIME = {
  SECONDS_IN_MINUTE: 60,
  MINUTE_IN_HOUR: 60,
  SECOND: 1000,
  MINUTE: 60_000,
  HOUR: 3_600_000,
  DAY: 86_400_000,
} as const;

export const LEVELS = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 30,
  VERY_HIGH: 40,
} as const;

export const EXPERIENCE = {
  LOW: 100,
  MEDIUM: 200,
  HIGH: 300,
  VERY_HIGH: 400,
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
export const DEFAUL_CATEGORY_RATIO = 3;
export const MIN_CATEGORY_RATIO = 1;
export const EXPERIENCE_CALCULATION_RATIO = 100;
export const HUNDRED_PERCENT = 100;

export const LEVEL_THRESHOLDS = [
  { level: LEVELS.LOW, expPerLevel: EXPERIENCE.LOW },
  { level: LEVELS.MEDIUM, expPerLevel: EXPERIENCE.MEDIUM },
  { level: LEVELS.HIGH, expPerLevel: EXPERIENCE.HIGH },
  { level: Infinity, expPerLevel: EXPERIENCE.VERY_HIGH },
] as const;

const ACCUMULATED_EXP: number[] = [];
let acc = 0;
for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
  ACCUMULATED_EXP[i] = acc;
  const delta =
    i === 0
      ? LEVEL_THRESHOLDS[i].level
      : (LEVEL_THRESHOLDS[i]?.level ?? LEVELS.VERY_HIGH) -
        (LEVEL_THRESHOLDS[i - 1]?.level ?? LEVELS.HIGH);
  acc += delta * (LEVEL_THRESHOLDS[i]?.expPerLevel ?? EXPERIENCE.VERY_HIGH);
}

export const PROGRESS_BAR_ANIMATION_DURATIONS = {
  SHORT: 1,
  LONG: 2.8,
} as const;

/**
 * Function for getting color css variable by subject level to use in styles.
 * @param level subject (User or Category) Level
 * @returns css color variable
 */
export const getColorBySubjectLevel = (level?: number) => {
  if (!level) return '--level-low';
  if (level < LEVELS.LOW) return '--level-low';
  if (level < LEVELS.MEDIUM) return '--level-medium';
  if (level < LEVELS.HIGH) return '--level-high';
  return '--level-very-high';
};

export const getExperienceByLevel = (level: number): number => {
  if (level <= 0) return 0;

  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    const { level: thresholdLevel, expPerLevel } =
      LEVEL_THRESHOLDS[i] ?? LEVEL_THRESHOLDS[0];
    const prevLevel =
      i === 0 ? 0 : (LEVEL_THRESHOLDS[i - 1]?.level ?? LEVELS.HIGH);
    const prevExp = ACCUMULATED_EXP[i] ?? 0;

    if (level < thresholdLevel) {
      return prevExp + (level - prevLevel) * expPerLevel;
    }
  }

  const last = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const lastExp = ACCUMULATED_EXP[ACCUMULATED_EXP.length - 1] ?? 0;
  return (
    lastExp +
    (level - LEVELS.HIGH) * (last?.expPerLevel ?? EXPERIENCE.VERY_HIGH)
  );
};

export const getLevelByExperience = (experience: number): number => {
  if (!experience || experience <= 0) return 0;

  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    const { level: thresholdLevel, expPerLevel } =
      LEVEL_THRESHOLDS[i] ?? LEVEL_THRESHOLDS[0];
    const prevLevel =
      i === 0 ? 0 : (LEVEL_THRESHOLDS[i - 1]?.level ?? LEVELS.HIGH);
    const prevExp = ACCUMULATED_EXP[i] ?? 0;

    if (experience < prevExp + (thresholdLevel - prevLevel) * expPerLevel) {
      return Math.floor(prevLevel + (experience - prevExp) / expPerLevel);
    }
  }

  const last = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const lastExp = ACCUMULATED_EXP[ACCUMULATED_EXP.length - 1] ?? 0;
  return (
    (last?.level ?? LEVELS.VERY_HIGH) +
    (experience - lastExp) / (last?.expPerLevel ?? EXPERIENCE.VERY_HIGH)
  );
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

export const OFFLINE_MUTATIONS_TYPES = {
  CREATE_DAY: 'createDay',
  CREATE_TASK: 'createTask',
  UPDATE_TASK: 'updateTask',
  DELETE_TASK: 'deleteTask',
  CREATE_CATEGORY: 'createCategory',
  UPDATE_CATEGORY: 'updateCategory',
  DELETE_CATEGORY: 'deleteCategory',
  COMPLETE_TASK: 'completeTask',
  UPDATE_USER: 'updateUser',
} as const;

export type OfflineMutation =
  | {
      type: typeof OFFLINE_MUTATIONS_TYPES.CREATE_DAY;
      payload: { userId: string; date: Date };
    }
  | {
      type: typeof OFFLINE_MUTATIONS_TYPES.CREATE_TASK;
      payload: {
        user_id: string;
        title: string;
        category_id: string;
        day_id: string;
      };
    }
  | {
      type: typeof OFFLINE_MUTATIONS_TYPES.UPDATE_TASK;
      payload: { id: string; data: Partial<Task> };
    }
  | {
      type: typeof OFFLINE_MUTATIONS_TYPES.DELETE_TASK;
      payload: { id: string };
    }
  | {
      type: typeof OFFLINE_MUTATIONS_TYPES.CREATE_CATEGORY;
      payload: {
        userId: string;
        name: string;
        description: string;
        ratio: number;
      };
    }
  | {
      type: typeof OFFLINE_MUTATIONS_TYPES.UPDATE_CATEGORY;
      payload: { id: string; data: Partial<Category> };
    }
  | {
      type: typeof OFFLINE_MUTATIONS_TYPES.DELETE_CATEGORY;
      payload: { id: string };
    }
  | {
      type: typeof OFFLINE_MUTATIONS_TYPES.COMPLETE_TASK;
      payload: {
        taskId: string;
        categoryId: string;
        userId: string;
        userCurrentExperience: number;
        categoryCurrentExperience: number;
        earnedExperience: number;
      };
    }
  | {
      type: typeof OFFLINE_MUTATIONS_TYPES.UPDATE_USER;
      payload: {
        userId: string;
        data: Partial<User>;
      };
    };
