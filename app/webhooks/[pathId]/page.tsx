import { Metadata } from 'next';
import { redirect } from 'next/navigation';

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
  // For now, redirect to the logs page since that's what users likely want to see
  redirect(`/webhooks/${params.pathId}/logs`);
}
