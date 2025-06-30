'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Filter, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RequestsTable } from './RequestsTable';
import { RequestFilters } from './RequestFilters';
import { useWebhookLogs } from '../hooks/useRequestOperations';
import { useRequestStore } from '@/lib/stores/requestStore';
import { LoadingSpinner } from '@/features/common/ui/LoadingSpinner';
import { EmptyState } from '@/features/common/ui/EmptyState';
import { StatusIndicator } from '@/features/common/ui/StatusIndicator';
import { useWebhooks } from '@/features/webhooks/hooks/useWebhookOperations';
import { clientEnv } from '@/lib/config/env';
import { CopyButton } from '@/features/common/ui/CopyButton';
import { useToast } from '@/components/ui/use-toast';

interface RequestLogsViewProps {
  pathId: string;
}

export function RequestLogsView({ pathId }: RequestLogsViewProps) {
  const [showFilters, setShowFilters] = useState(false);
  const { data: webhookData, isLoading: webhookLoading } = useWebhooks();
  const { 
    data: logsData, 
    isLoading: logsLoading, 
    isError: logsError,
    refetch 
  } = useWebhookLogs(pathId);
  
  const { autoRefresh, setAutoRefresh } = useRequestStore();
  const { toast } = useToast();
  
  // Find the current webhook from the list
  const currentWebhook = webhookData?.find(webhook => webhook.path_id === pathId);
  
  // Get the logs data
  const logs = logsData?.data?.logs || [];
  const pagination = logsData?.data?.pagination;
  
  const webhookUrl = `${clientEnv.NEXT_PUBLIC_APP_URL}/api/webhooks/${pathId}`;
  
  const handleCopy = () => {
    toast({
      title: "URL copied to clipboard",
      description: "Webhook URL has been copied to your clipboard.",
      variant: "success",
    });
  };
  
  const handleRefresh = () => {
    refetch();
  };
  
  const handleToggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };
  
  // Manage title based on data loading
  const getTitle = () => {
    if (webhookLoading) return 'Loading...';
    if (!currentWebhook) return pathId;
    return currentWebhook.path_id;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/webhooks">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{getTitle()}</h1>
          {currentWebhook && (
            <Badge 
              variant={currentWebhook.status === 'active' ? 'success' : 'destructive'}
              className="capitalize"
            >
              {currentWebhook.status}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          
          <Button
            variant={autoRefresh ? 'default' : 'outline'}
            size="sm"
            onClick={handleToggleAutoRefresh}
          >
            <Clock className="mr-2 h-4 w-4" />
            {autoRefresh ? 'Auto-refreshing' : 'Auto-refresh Off'}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            title="Refresh logs"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            Webhook URL
            {autoRefresh && <StatusIndicator status="active\" size="sm\" pulse />}
          </CardTitle>
          <CardDescription>
            Send HTTP requests to this URL to capture and view them in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 rounded-md border bg-muted/50 p-2">
            <code className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs md:text-sm">
              {webhookUrl}
            </code>
            <CopyButton value={webhookUrl} onCopy={handleCopy} />
          </div>
        </CardContent>
      </Card>
      
      {showFilters && (
        <RequestFilters onClose={() => setShowFilters(false)} />
      )}
      
      <div className="rounded-md border">
        <div className="p-4 pb-0">
          <h2 className="text-xl font-bold">Request Logs</h2>
          {pagination && (
            <p className="text-sm text-muted-foreground">
              Showing {logs.length} of {pagination.total} requests
            </p>
          )}
        </div>
        
        <RequestsTable 
          requests={logs} 
          pathId={pathId} 
          isLoading={logsLoading}
          isError={logsError}
        />
      </div>
    </div>
  );
}