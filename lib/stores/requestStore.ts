'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RequestFilters, HttpMethod } from '@/features/requests/types/request.types';

interface RequestPagination {
  limit: number;
  offset: number;
  total: number;
  hasMore: boolean;
}

interface RequestStore {
  filters: RequestFilters;
  pagination: RequestPagination;
  autoRefresh: boolean;
  refreshInterval: number;
  
  setFilters: (filters: Partial<RequestFilters>) => void;
  resetFilters: () => void;
  setPagination: (pagination: Partial<RequestPagination>) => void;
  setAutoRefresh: (enabled: boolean) => void;
  setRefreshInterval: (interval: number) => void;
}

const initialFilters: RequestFilters = {
  method: null,
  dateRange: { from: null, to: null },
  search: '',
  status: null,
};

const initialPagination: RequestPagination = {
  limit: 20,
  offset: 0,
  total: 0,
  hasMore: false,
};

export const useRequestStore = create<RequestStore>()(
  persist(
    (set) => ({
      filters: initialFilters,
      pagination: initialPagination,
      autoRefresh: false,
      refreshInterval: 30000, // 30 seconds
      
      setFilters: (filters) => set((state) => ({ 
        filters: { ...state.filters, ...filters },
        pagination: { ...state.pagination, offset: 0 }, // Reset to first page when filtering
      })),
      
      resetFilters: () => set({ 
        filters: initialFilters,
        pagination: { ...initialPagination },
      }),
      
      setPagination: (pagination) => set((state) => ({
        pagination: { ...state.pagination, ...pagination },
      })),
      
      setAutoRefresh: (enabled) => set({ autoRefresh: enabled }),
      
      setRefreshInterval: (interval) => set({ refreshInterval: interval }),
    }),
    {
      name: 'request-store',
      partialize: (state) => ({ 
        filters: state.filters,
        autoRefresh: state.autoRefresh,
        refreshInterval: state.refreshInterval,
      }),
    }
  )
);
