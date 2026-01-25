// eslint-disable-next-line import/order
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/api/api', () => import('../../__tests__/__mocks__/api'));
vi.mock(
  '@/contexts/query-context/persist',
  () => import('../../__tests__/__mocks__/offline'),
);
vi.mock('@/consts', () => ({
  OFFLINE_MUTATIONS_TYPES: {
    COMPLETE_TASK: 'completeTask',
  },
  supabaseConfig: {
    url: 'https://fake.supabase.url',
    key: 'fakekey123',
  },
  getQueryKey: vi.fn(),
  getLevelByExperience: vi.fn().mockReturnValue(1),
}));

import { enqueueMutation } from '@/contexts/query-context/persist';
import { OFFLINE_MUTATIONS_TYPES } from '@/consts';
import { api } from '@/api/api';
import { completeTask } from './tasks';

const baseArgs = {
  taskId: 'task-1',
  categoryId: 'cat-1',
  userId: 'user-1',
  userCurrentExperience: 100,
  categoryCurrentExperience: 50,
  earnedExperience: 25,
};

describe('completeTask', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should enqueue mutation when offline', async () => {
    // mock offline
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);

    const result = await completeTask(baseArgs);

    expect(enqueueMutation).toHaveBeenCalledOnce();
    expect(enqueueMutation).toHaveBeenCalledWith({
      type: OFFLINE_MUTATIONS_TYPES.COMPLETE_TASK,
      payload: baseArgs,
    });

    expect(api.tasks.update).not.toHaveBeenCalled();
    expect(result).toEqual({ offline: true });
  });

  it('should update task, category and user when online', async () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);

    const result = await completeTask(baseArgs);

    expect(api.tasks.update).toHaveBeenCalledWith({
      id: 'task-1',
      data: { is_done: true },
    });

    expect(api.categories.update).toHaveBeenCalledWith({
      id: 'cat-1',
      data: {
        experience: 75,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        level: expect.any(Number),
      },
    });

    expect(api.auth.user.update).toHaveBeenCalledWith({
      userId: 'user-1',
      data: {
        exp: 125,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        level: expect.any(Number),
      },
    });

    expect(result).toEqual({ offline: false });
  });
});
