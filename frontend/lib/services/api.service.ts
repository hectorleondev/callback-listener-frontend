import { env } from '@/lib/config/env';
import type { ApiResponse } from '@/features/common/types/api.types';
import type { CapturedRequest, GetLogsOptions } from '@/features/requests/types/request.types';
import type { WebhookPath, CreateWebhookRequest } from '@/features/webhooks/types/webhook.types';

class ApiService {
  private baseUrl: string;
  
  constructor() {
    this.baseUrl = env.API_URL;
  }
  
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          error: `HTTP error! status: ${response.status}` 
        }));
        
        return {
          success: false,
          error: errorData.error || errorData.message || `HTTP error! status: ${response.status}`,
        };
      }
      
      const data = await response.json();
      
      // Handle the backend response format which includes success and data fields
      if (data.success === false) {
        return {
          success: false,
          error: data.error || 'Unknown error occurred',
        };
      }
      
      return { 
        success: true, 
        data: data.data || data 
      };
    } catch (error) {
      console.error('API request error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }
  
  get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }
  
  post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
  
  put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
  
  delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiService = new ApiService();

// Server-side webhook service connecting to Flask backend
export const webhookService = {
  getWebhooks: async (): Promise<ApiResponse<WebhookPath[]>> => {
    return apiService.get<WebhookPath[]>('/api/paths');
  },
  
  getWebhook: async (pathId: string): Promise<ApiResponse<WebhookPath>> => {
    return apiService.get<WebhookPath>(`/api/paths/${pathId}`);
  },
  
  createWebhook: async (data: CreateWebhookRequest): Promise<ApiResponse<WebhookPath>> => {
    return apiService.post<WebhookPath>('/api/paths', {
      path_id: data.path_id
    });
  },
  
  deleteWebhook: async (pathId: string): Promise<ApiResponse<void>> => {
    return apiService.delete<void>(`/api/paths/${pathId}`);
  },
};

export const requestService = {
  getLogs: async (pathId: string, options: GetLogsOptions = {}): Promise<ApiResponse<{
    logs: CapturedRequest[],
    pagination: { total: number, limit: number, offset: number, has_more: boolean }
  }>> => {
    const queryParams = new URLSearchParams();
    
    if (options.limit) queryParams.append('limit', options.limit.toString());
    if (options.offset) queryParams.append('offset', options.offset.toString());
    if (options.include_body !== undefined) {
      queryParams.append('include_body', options.include_body.toString());
    }
    
    const endpoint = `/api/paths/${pathId}/logs${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const result = await apiService.get<{
      path: WebhookPath;
      requests: CapturedRequest[];
      pagination: { limit: number; offset: number; total: number };
    }>(endpoint);
    
    if (result.success && result.data) {
      return {
        success: true,
        data: {
          logs: result.data.requests,
          pagination: {
            total: result.data.pagination.total,
            limit: result.data.pagination.limit,
            offset: result.data.pagination.offset,
            has_more: result.data.pagination.offset + result.data.pagination.limit < result.data.pagination.total,
          }
        }
      };
    }
    
    return {
      success: false,
      error: result.error || 'Failed to fetch logs'
    };
  },
  
  getRequestDetails: async (pathId: string, requestId: string): Promise<ApiResponse<CapturedRequest>> => {
    return apiService.get<CapturedRequest>(`/api/paths/${pathId}/logs/${requestId}`);
  },
};

// Dashboard service for stats
export const dashboardService = {
  getStats: async (): Promise<ApiResponse<{
    total_webhooks: number;
    total_requests: number;
    active_webhooks: number;
    recent_requests: CapturedRequest[];
  }>> => {
    return apiService.get('/api/dashboard/stats');
  },
};
