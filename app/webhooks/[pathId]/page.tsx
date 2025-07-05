import { Metadata } from 'next';

interface WebhookPageProps {
  params: {
    pathId: string;
  };
}

export async function generateMetadata({ params }: WebhookPageProps): Promise<Metadata> {
  return {
    title: `${params.pathId} - CallbackListener`,
    description: `Webhook details for ${params.pathId}`,
  };
}

export default function WebhookPage({ params }: WebhookPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Webhook Details
            </h1>
            <p className="text-muted-foreground mt-2">
              Details for webhook: <span className="font-mono text-foreground">{params.pathId}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href={`/webhooks/${params.pathId}/logs`}
              className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              View Logs
            </a>
            <a
              href="/webhooks"
              className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              All Webhooks
            </a>
          </div>
        </div>
        
        <div className="grid gap-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Webhook Information</h2>
            
            <div className="grid gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Webhook ID</h3>
                <p className="font-mono">{params.pathId}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Endpoint URL</h3>
                <p className="font-mono break-all">{`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/webhooks/${params.pathId}`}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Usage</h3>
                <p>Send HTTP requests to this endpoint to record them in the logs.</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Example Usage</h2>
            
            <div className="bg-muted p-4 rounded-md overflow-x-auto">
              <pre className="text-sm">
                <code>
{`curl -X POST \
  "${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/webhooks/${params.pathId}" \
  -H "Content-Type: application/json" \
  -d '{ "message": "Hello from webhook!" }'`}
                </code>
              </pre>
            </div>
          </div>
          
          <div className="flex justify-center mt-4">
            <a
              href={`/webhooks/${params.pathId}/logs`}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              View Request Logs
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
