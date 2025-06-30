import { Metadata } from 'next';
import { WebhookLogsManager } from '@/features/requests/ui/WebhookLogsManager';

interface WebhookLogsPageProps {
  params: {
    pathId: string;
  };
}

export async function generateMetadata({ params }: WebhookLogsPageProps): Promise<Metadata> {
  return {
    title: `Logs - ${params.pathId} - CallbackListener`,
    description: `View request logs for webhook ${params.pathId}`,
  };
}

export default function WebhookLogsPage({ params }: WebhookLogsPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Webhook Logs
            </h1>
            <p className="text-muted-foreground mt-2">
              Request logs for webhook: <span className="font-mono text-foreground">{params.pathId}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href={`/webhooks/${params.pathId}`}
              className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              ← Back to Webhook
            </a>
            <a
              href="/webhooks"
              className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              All Webhooks
            </a>
          </div>
        </div>
        
        <WebhookLogsManager pathId={params.pathId} />
      </div>
    </div>
  );
}
