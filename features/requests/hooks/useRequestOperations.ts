'use client';

import { useQuery } from '@tanstack/react-query';
import { clientRequestService } from '@/lib/services/client-api.service';
import { useRequestStore } from '@/lib/stores/requestStore';
import type { CapturedRequest } from '../types/request.types';

// Get webhook logs
export function useWebhookLogs(pathId: string) {
  const { filters, pagination, autoRefresh, refreshInterval } = useRequestStore();
  
  return useQuery({
    queryKey: ['webhook-logs', pathId, filters, pagination],
    queryFn: async () => {
      const result = await clientRequestService.getLogs(pathId, {
        limit: pagination.limit,
        offset: pagination.offset,
        method: filters.method || undefined,
        search: filters.search || undefined,
        date_from: filters.dateRange.from?.toISOString(),
        date_to: filters.dateRange.to?.toISOString(),
      });
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result.data || { logs: [], pagination: { total: 0, limit: 0, offset: 0, has_more: false } };
    },
    enabled: !!pathId,
    refetchInterval: autoRefresh ? refreshInterval : false,
    staleTime: 1000 * 30, // 30 seconds
  });
}

// Get request details
export function useRequestDetails(pathId: string, requestId: string) {
  return useQuery({
    queryKey: ['request-details', pathId, requestId],
    queryFn: async () => {
      const result = await clientRequestService.getRequestDetails(pathId, requestId);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result.data as CapturedRequest;
    },
    enabled: !!pathId && !!requestId,
    staleTime: 1000 * 60 * 10, // 10 minutes (request details don't change)
  });
}