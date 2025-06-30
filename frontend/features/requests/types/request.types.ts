export interface CapturedRequest {
  id: string;
  path_id: string;
  method: HttpMethod;
  headers: Record<string, string>;
  body?: string;
  query_params: Record<string, string>;
  ip_address?: string;
  user_agent?: string;
  timestamp: string;
  status_code?: number;
  response_time?: number;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export interface GetLogsOptions {
  limit?: number;
  offset?: number;
  include_body?: boolean;
  method?: HttpMethod;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface RequestFilters {
  method: HttpMethod | null;
  dateRange: { from: Date | null; to: Date | null };
  search: string;
  status: string | null;
}