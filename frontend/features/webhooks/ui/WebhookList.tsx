'use client';

import { useMemo } from 'react';
import { AlertCircle } from 'lucide-react';
import { useWebhooks } from '../hooks/useWebhookOperations';
import { WebhookCard } from './WebhookCard';
import { EmptyState } from '@/features/common/ui/EmptyState';
import { LoadingSpinner } from '@/features/common/ui/LoadingSpinner';
import { useWebhookStore } from '@/lib/stores/webhookStore';
import { WebhookPath } from '../types/webhook.types';

export function WebhookList() {
  const { data: webhooks, isLoading, error } = useWebhooks();
  const { filters } = useWebhookStore();
  
  const filteredWebhooks = useMemo(() => {
    if (!webhooks) return [];
    
    let result = [...webhooks];
    
    // Apply filters
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(webhook => 
        webhook.path_id.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[filters.sortBy];
      const bValue = b[filters.sortBy];
      
      const direction = filters.sortOrder === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * direction;
      }
      
      // String comparison
      return String(aValue).localeCompare(String(bValue)) * direction;
    });
    
    return result;
  }, [webhooks, filters]);
  
  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle className="h-10 w-10" />}
        title="Failed to load webhooks"
        description="We couldn't load your webhook paths. Please try again later."
        action={{
          label: "Refresh",
          onClick: () => window.location.reload(),
        }}
      />
    );
  }
  
  if (!filteredWebhooks.length) {
    if (filters.search) {
      return (
        <EmptyState
          title="No matching webhooks"
          description="Try adjusting your filters to find what you're looking for."
          action={{
            label: "Clear Filters",
            onClick: () => useWebhookStore.getState().resetFilters(),
          }}
        />
      );
    }
    
    return (
      <EmptyState
        title="No webhooks found"
        description="Get started by creating your first webhook endpoint."
        action={{
          label: "Create Webhook",
          onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
        }}
      />
    );
  }
  
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {filteredWebhooks.map((webhook) => (
        <WebhookCard key={webhook.id} webhook={webhook} />
      ))}
    </div>
  );
}