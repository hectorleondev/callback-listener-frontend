'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WebhookFilters } from '@/features/webhooks/types/webhook.types';

interface WebhookStore {
  filters: WebhookFilters;
  
  setFilters: (filters: Partial<WebhookFilters>) => void;
  resetFilters: () => void;
}

const initialFilters: WebhookFilters = {
  search: '',
  sortBy: 'created_at',
  sortOrder: 'desc',
};

export const useWebhookStore = create<WebhookStore>()(
  persist(
    (set) => ({
      filters: initialFilters,
      
      setFilters: (filters) => set((state) => ({ 
        filters: { ...state.filters, ...filters },
      })),
      
      resetFilters: () => set({ 
        filters: initialFilters,
      }),
    }),
    {
      name: 'webhook-store',
      partialize: (state) => ({ 
        filters: state.filters,
      }),
    }
  )
);