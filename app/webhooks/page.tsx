import { Metadata } from 'next';
import Link from 'next/link';
import { WebhookManager } from '@/features/webhooks/ui/WebhookManager';

export const metadata: Metadata = {
  title: 'Webhooks - CallbackListener',
  description: 'Manage your webhook endpoints',
};

export default function WebhooksPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Create and manage your webhooks. Each webhook has a unique URL that you can use to receive HTTP requests.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            ← Back to Dashboard
          </Link>
        </div>
        
        <WebhookManager />
        
        <div className="mt-8 p-6 bg-card border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">How to Use</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Click &quot;Create New Webhook&quot; to generate a new endpoint</li>
            <li>Copy the generated webhook URL</li>
            <li>Configure your application to send HTTP requests to this URL</li>
            <li>Monitor incoming requests in real-time</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
