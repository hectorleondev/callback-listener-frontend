'use client';

import { Suspense } from 'react';
import { AlertTriangle, ArrowUpRight, Plus, Webhook } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/features/common/ui/EmptyState';
import { StatsCards } from '@/features/dashboard/ui/StatsCards';
import { RecentActivity } from '@/features/dashboard/ui/RecentActivity';
import Link from 'next/link';
import { useWebhooks } from '@/features/webhooks/hooks/useWebhookOperations';

export function DashboardContent() {
  const { data: webhooks, isLoading, error } = useWebhooks();
  
  const hasWebhooks = webhooks && webhooks.length > 0;
  
  if (error) {
    return (
      <EmptyState
        icon={<AlertTriangle className="h-10 w-10" />}
        title="Failed to load dashboard data"
        description="An unexpected error occurred while loading the dashboard data. Please try again."
        action={{
          label: "Try Again",
          onClick: () => window.location.reload(),
        }}
      />
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link href="/webhooks">
            <Plus className="mr-2 h-4 w-4" /> Create Webhook
          </Link>
        </Button>
      </div>
      
      <Suspense fallback={<div className="h-28 bg-muted animate-pulse rounded-lg"></div>}>
        <StatsCards />
      </Suspense>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">Recent Activity</CardTitle>
            {hasWebhooks && (
              <Button variant="ghost" size="sm" className="gap-1">
                View all
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="h-64 bg-muted animate-pulse rounded-lg"></div>}>
              <RecentActivity />
            </Suspense>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-medium">Quick Actions</CardTitle>
            <CardDescription>
              Common webhook management tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full justify-start">
              <Link href="/webhooks">
                <Plus className="mr-2 h-4 w-4" /> Create New Webhook
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/webhooks">
                <Webhook className="mr-2 h-4 w-4" /> View All Webhooks
              </Link>
            </Button>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full text-xs">
              Visit Documentation
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}