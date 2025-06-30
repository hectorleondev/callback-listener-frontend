'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clientWebhookService } from '@/lib/services/client-api.service';
import { useToast } from '@/components/ui/use-toast';
import type { WebhookPath } from '../types/webhook.types';

// Server Action Implementations
async function createWebhook(formData: FormData) {
  const pathId = formData.get('path_id') as string;
  
  try {
    const result = await clientWebhookService.createWebhook({ 
      path_id: pathId || undefined 
    });
    
    return result;
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create webhook' 
    };
  }
}

async function deleteWebhook(pathId: string) {
  try {
    const result = await clientWebhookService.deleteWebhook(pathId);
    return result;
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete webhook' 
    };
  }
}

// Hook implementations
export function useCreateWebhook() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: createWebhook,
    onMutate: async (formData) => {
      await queryClient.cancelQueries({ queryKey: ['webhooks'] });
      const previousWebhooks = queryClient.getQueryData<WebhookPath[]>(['webhooks']);
      
      // Optimistic update
      const pathId = formData.get('path_id') as string;
      const optimisticWebhook: WebhookPath = {
        id: `temp-${Date.now()}`,
        path_id: pathId || `webhook-${Math.random().toString(36).substring(2, 10)}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        request_count: 0,

      };
      
      queryClient.setQueryData(['webhooks'], (old: WebhookPath[] = []) => 
        [optimisticWebhook, ...old]
      );
      
      return { previousWebhooks };
    },
    onSuccess: (result) => {
      if (result.success) {
        console.log('Webhook created successfully:', result.data?.path_id);
        // toast({
        //   variant: "success",
        //   title: "Webhook created successfully",
        //   description: `Path ID: ${result.data?.path_id}`,
        // });
      } else {
        console.error('Failed to create webhook:', result.error);
        // toast({
        //   variant: "destructive",
        //   title: "Failed to create webhook",
        //   description: result.error,
        // });
      }
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(['webhooks'], context?.previousWebhooks);
      console.error('Failed to create webhook:', error);
      // toast({
      //   variant: "destructive",
      //   title: "Failed to create webhook",
      //   description: "An unexpected error occurred. Please try again.",
      // });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
    },
  });
}

export function useWebhooks() {
  return useQuery({
    queryKey: ['webhooks'],
    queryFn: async () => {
      const result = await clientWebhookService.getWebhooks();
      return result.data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useDeleteWebhook() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: deleteWebhook,
    onMutate: async (pathId) => {
      await queryClient.cancelQueries({ queryKey: ['webhooks'] });
      const previousWebhooks = queryClient.getQueryData<WebhookPath[]>(['webhooks']);
      
      // Optimistic update
      queryClient.setQueryData(['webhooks'], (old: WebhookPath[] = []) => 
        old.filter(webhook => webhook.path_id !== pathId)
      );
      
      return { previousWebhooks };
    },
    onSuccess: (result) => {
      if (result.success) {
        toast({
          variant: "success",
          title: "Webhook deleted successfully",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to delete webhook",
          description: result.error,
        });
      }
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(['webhooks'], context?.previousWebhooks);
      toast({
        variant: "destructive",
        title: "Failed to delete webhook",
        description: "An unexpected error occurred. Please try again.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
    },
  });
}