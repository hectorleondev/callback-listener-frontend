'use client';

import { useDashboardStats } from '../hooks/useDashboardData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/features/common/ui/LoadingSpinner';
import { formatDistanceToNow } from 'date-fns';

function getMethodColor(method: string) {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
    case 'POST':
      return 'bg-green-500/10 text-green-700 dark:text-green-400';
    case 'PUT':
      return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
    case 'DELETE':
      return 'bg-red-500/10 text-red-700 dark:text-red-400';
    case 'PATCH':
      return 'bg-purple-500/10 text-purple-700 dark:text-purple-400';
    default:
      return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
  }
}

export function RecentActivity() {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive mb-2">
            Failed to load recent activity
          </p>
          <p className="text-xs text-muted-foreground">
            {error.message || 'Unknown error occurred'}
          </p>
        </CardContent>
      </Card>
    );
  }

  const recentRequests = stats?.recent_requests || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {recentRequests.length === 0 ? (
          <div className="text-center py-8">
            <svg
              className="mx-auto h-12 w-12 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-muted-foreground">
              No recent activity
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Create a webhook and start receiving requests to see activity here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentRequests.slice(0, 5).map((request, index) => (
              <div key={request.id || index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge className={getMethodColor(request.method)}>
                    {request.method}
                  </Badge>
                  <div>
                    <p className="text-sm font-medium">
                      Webhook Request
                    </p>
                    <p className="text-xs text-muted-foreground">
                      from {request.ip_address || 'unknown'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {request.timestamp ? formatDistanceToNow(new Date(request.timestamp), { 
                      addSuffix: true 
                    }) : 'unknown time'}
                  </p>
                </div>
              </div>
            ))}
            {recentRequests.length > 5 && (
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground text-center">
                  And {recentRequests.length - 5} more requests...
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
