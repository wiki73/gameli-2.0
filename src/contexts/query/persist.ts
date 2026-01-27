/* eslint-disable no-console */
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import localforage from 'localforage';
import {
  getQueryKey,
  OFFLINE_MUTATIONS_TYPES,
  type OfflineMutation,
  QUERY_KEY_TYPES,
  TIME,
} from '@/consts';
import { api } from '@/api/api';
import { queryClient } from './query-client';

export const store = localforage.createInstance({
  name: 'offline-mutations',
});

export const enqueueMutation = async (mutation: OfflineMutation) => {
  const queue = (await store.getItem<OfflineMutation[]>('queue')) || [];
  queue.push(mutation);
  await store.setItem('queue', queue);
};

export const getQueuedMutations = async (): Promise<OfflineMutation[]> =>
  (await store.getItem<OfflineMutation[]>('queue')) || [];

export const clearQueue = async () => {
  await store.setItem('queue', []);
};

export const persister = createAsyncStoragePersister({
  storage: localforage,
  key: 'REACT_QUERY_OFFLINE_CACHE',
  throttleTime: TIME.SECOND,
});

export function setupOnlineSync() {
  if (typeof window === 'undefined' || !window.addEventListener) return;

  window.addEventListener('online', async () => {
    console.log('[Offline Sync] Сеть восстановлена, синхронизируем очередь...');

    const queue: OfflineMutation[] = await getQueuedMutations();

    for (const mutation of queue) {
      try {
        switch (mutation.type) {
          case OFFLINE_MUTATIONS_TYPES.CREATE_DAY:
            await api.days.create(mutation.payload);
            break;

          case OFFLINE_MUTATIONS_TYPES.CREATE_TASK:
            await api.tasks.create(mutation.payload);
            break;

          case OFFLINE_MUTATIONS_TYPES.UPDATE_TASK:
            await api.tasks.update(mutation.payload);
            break;

          case OFFLINE_MUTATIONS_TYPES.DELETE_TASK:
            await api.tasks.delete(mutation.payload);
            break;

          case OFFLINE_MUTATIONS_TYPES.CREATE_CATEGORY:
            await api.categories.create(mutation.payload);
            break;

          case OFFLINE_MUTATIONS_TYPES.UPDATE_CATEGORY:
            await api.categories.update(mutation.payload);
            break;

          case OFFLINE_MUTATIONS_TYPES.DELETE_CATEGORY:
            await api.categories.delete(mutation.payload);
            break;

          default:
            console.warn('Неизвестная мутация в очереди:', mutation);
        }
      } catch (err) {
        console.error(
          '[Offline Sync] Ошибка при синхронизации:',
          mutation,
          err,
        );
      }
    }

    await clearQueue();

    queryClient.invalidateQueries({
      queryKey: getQueryKey({
        type: QUERY_KEY_TYPES.DAYS,
        payload: {
          userId: '',
        },
      }),
      exact: false,
    });
    queryClient.invalidateQueries({
      queryKey: getQueryKey({
        type: QUERY_KEY_TYPES.TASKS,
        payload: { userId: '', dayId: '', page: 1 },
      }),
      exact: false,
    });
    queryClient.invalidateQueries({
      queryKey: getQueryKey({
        type: QUERY_KEY_TYPES.CATEGORIES,
        payload: {
          userId: '',
          page: 1,
        },
      }),
      exact: false,
    });

    console.log('[Offline Sync] Очередь синхронизирована!');
  });
}
