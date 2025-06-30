'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ClipboardCopy, ExternalLink, MoreHorizontal, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatters } from '@/lib/utils/formatters';
import { Badge } from '@/components/ui/badge';
import { CopyButton } from '@/features/common/ui/CopyButton';
import { WebhookPath } from '../types/webhook.types';
import { useDeleteWebhook } from '../hooks/useWebhookOperations';
import { useToast } from '@/components/ui/use-toast';
import { clientEnv } from '@/lib/config/env';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface WebhookCardProps {
  webhook: WebhookPath;
}

export function WebhookCard({ webhook }: WebhookCardProps) {
  const deleteWebhook = useDeleteWebhook();
  const { toast } = useToast();
  const [showEndpoint, setShowEndpoint] = useState(false);

  const handleCopy = () => {
    toast({
      title: "URL copied to clipboard",
      description: "Webhook URL has been copied to your clipboard.",
      variant: "success",
    });
  };

  const handleDelete = () => {
    deleteWebhook.mutate(webhook.path_id);
  };

  const webhookUrl = `${clientEnv.NEXT_PUBLIC_API_URL}/webhook/${webhook.path_id}`;
  
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{webhook.path_id}</CardTitle>
          </div>
        </div>
        <CardDescription>
          Created {formatters.timeAgo(webhook.created_at)}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Requests:</span>
            <span className="font-medium">{webhook.request_count.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Last Activity:</span>
            <span className="font-medium">{formatters.timeAgo(webhook.updated_at)}</span>
          </div>
          <Button
            variant="outline" 
            className="mt-2 w-full justify-between" 
            onClick={() => setShowEndpoint(!showEndpoint)}
          >
            <span>{showEndpoint ? 'Hide Endpoint' : 'Show Endpoint'}</span>
            {showEndpoint ? <CheckCircle2 className="h-4 w-4" /> : <ClipboardCopy className="h-4 w-4" />}
          </Button>
          
          {showEndpoint && (
            <div className="mt-2 flex items-center gap-2 rounded-md border bg-muted/50 p-2">
              <code className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs">
                {webhookUrl}
              </code>
              <CopyButton value={webhookUrl} onCopy={handleCopy} />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Endpoint Info
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Webhook Endpoint Information</DialogTitle>
              <DialogDescription>
                Details about your webhook endpoint and how to use it.
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="usage">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="usage">Usage</TabsTrigger>
                <TabsTrigger value="code">Code Examples</TabsTrigger>
              </TabsList>
              <TabsContent value="usage" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Webhook URL</h3>
                  <div className="flex items-center gap-2 rounded-md border bg-muted/50 p-2">
                    <code className="flex-1 overflow-auto text-xs">
                      {webhookUrl}
                    </code>
                    <CopyButton value={webhookUrl} onCopy={handleCopy} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Send HTTP requests to this URL to have them captured and logged.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Supported HTTP Methods</h3>
                  <p className="text-sm text-muted-foreground">
                    This endpoint accepts all HTTP methods: GET, POST, PUT, PATCH, DELETE, OPTIONS, and HEAD.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="code" className="pt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">cURL Example</h3>
                    <div className="rounded-md bg-muted p-2">
                      <code className="block overflow-x-auto whitespace-pre text-xs">
{`curl -X POST ${webhookUrl} \\
  -H "Content-Type: application/json" \\
  -d '{"event": "user.created", "data": {"id": 123, "name": "John Doe"}}'`}
                      </code>
                    </div>
                    <CopyButton 
                      value={`curl -X POST ${webhookUrl} -H "Content-Type: application/json" -d '{"event": "user.created", "data": {"id": 123, "name": "John Doe"}}'`}
                      className="mt-1" 
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">JavaScript Example</h3>
                    <div className="rounded-md bg-muted p-2">
                      <code className="block overflow-x-auto whitespace-pre text-xs">
{`fetch("${webhookUrl}", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    event: "user.created",
    data: { id: 123, name: "John Doe" }
  })
});`}
                      </code>
                    </div>
                    <CopyButton 
                      value={`fetch("${webhookUrl}", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    event: "user.created",
    data: { id: 123, name: "John Doe" }
  })
});`}
                      className="mt-1" 
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
        
        <div className="flex items-center gap-2">
          <Button asChild size="sm">
            <Link href={`/webhooks/${webhook.path_id}/logs`}>
              View Logs
              <ExternalLink className="ml-2 h-3 w-3" />
            </Link>
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  webhook endpoint <span className="font-bold">{webhook.path_id}</span> and all its
                  request logs.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
}