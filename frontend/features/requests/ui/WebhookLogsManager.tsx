'use client';

import { useState } from 'react';
import { RefreshCw, Download, Search, Filter, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWebhookLogs } from '../hooks/useRequestOperations';
import { useRequestStore } from '@/lib/stores/requestStore';
import { RequestsTable } from './RequestsTable';
import { RequestFilters } from './RequestFilters';
import { EmptyState } from '@/features/common/ui/EmptyState';
import { LoadingSpinner } from '@/features/common/ui/LoadingSpinner';
import { cn } from '@/lib/utils/cn';

interface WebhookLogsManagerProps {
  pathId: string;
}

export function WebhookLogsManager({ pathId }: WebhookLogsManagerProps) {
  const { data, isLoading, error, refetch } = useWebhookLogs(pathId);
  const { filters, autoRefresh, setAutoRefresh, resetFilters } = useRequestStore();
  const [showFilters, setShowFilters] = useState(false);
  
  const handleRefresh = () => {
    refetch();
  };
  
  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export functionality to be implemented');
  };
  
  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle className="h-10 w-10" />}
        title="Failed to load request logs"
        description="We couldn't load the request logs for this webhook. Please try again later."
        action={{
          label: "Retry",
          onClick: handleRefresh,
        }}
      />
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.pagination.total || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.logs.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Last {data?.pagination.limit || 20} requests
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto Refresh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant={autoRefresh ? "default" : "secondary"}>
                {autoRefresh ? "ON" : "OFF"}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                Toggle
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Webhook Path</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-mono text-muted-foreground">
              /webhook/{pathId}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          
          {(filters.method || filters.search || filters.dateRange.from) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
      
      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <RequestFilters />
          </CardContent>
        </Card>
      )}
      
      {/* Request Logs Table */}
      {isLoading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : data?.logs.length ? (
        <RequestsTable 
          requests={data.logs} 
          pathId={pathId}
          pagination={data.pagination}
        />
      ) : (
        <EmptyState
          title="No requests found"
          description={
            filters.method || filters.search || filters.dateRange.from
              ? "No requests match your current filters. Try adjusting your search criteria."
              : "No requests have been made to this webhook yet. Start sending HTTP requests to see them here."
          }
          action={
            filters.method || filters.search || filters.dateRange.from
              ? { label: "Clear Filters", onClick: resetFilters }
              : undefined
          }
        />
      )}
    </div>
  );
}
