import { vi } from 'vitest';

export const api = {
  tasks: {
    update: vi.fn(),
  },
  categories: {
    update: vi.fn(),
  },
  auth: {
    user: {
      update: vi.fn(),
    },
  },
};
