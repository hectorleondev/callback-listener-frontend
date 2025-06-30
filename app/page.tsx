'use client';

import { StatsCards } from '@/features/dashboard/ui/StatsCards';
import { RecentActivity } from '@/features/dashboard/ui/RecentActivity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Plus } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              CallbackListener Dashboard
            </h1>
            <p className="text-muted-foreground">
              Monitor and manage your webhook endpoints in real-time
            </p>
          </div>
          
          {/* Stats Cards */}
          <StatsCards />
          
          {/* Recent Activity and Quick Actions */}
          <div className="grid gap-6 lg:grid-cols-2">
            <RecentActivity />
            
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button asChild className="w-full justify-start">
                    <Link href="/webhooks">
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Webhook
                    </Link>
                  </Button>
                  
                  <Button variant="outline" asChild className="w-full justify-start">
                    <Link href="/webhooks">
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      View All Webhooks
                    </Link>
                  </Button>
                  
                  <Button variant="outline" asChild className="w-full justify-start">
                    <a
                      href={`${apiUrl}/docs`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      API Documentation
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Quick Start Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Start Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      1
                    </div>
                    <h3 className="font-semibold">Create a Webhook</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Generate a unique URL endpoint to capture HTTP requests
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      2
                    </div>
                    <h3 className="font-semibold">Send Requests</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Start sending HTTP requests to your webhook URL from any application
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      3
                    </div>
                    <h3 className="font-semibold">Monitor in Real-time</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    View captured requests with full details including headers, body, and metadata
                  </p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Example Usage:</h4>
                <div className="font-mono text-sm bg-background p-3 rounded border">
                  <div>{`curl -X POST ${apiUrl}/webhook/my-endpoint \\`}</div>
                  <div>&nbsp;&nbsp;{`-H "Content-Type: application/json" \\`}</div>
                  <div>&nbsp;&nbsp;{`-d '{"message": "Hello from my app!"}'`}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
