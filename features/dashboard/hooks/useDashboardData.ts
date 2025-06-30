'use client';

import { useQuery } from '@tanstack/react-query';
import { clientDashboardService } from '@/lib/services/client-api.service';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      console.log('Fetching dashboard stats...');
      const result = await clientDashboardService.getStats();
      console.log('Dashboard stats result:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch dashboard stats');
      }
      
      return result.data;
    },
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60, // 1 minute
  });
}
