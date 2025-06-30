'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useCreateWebhook } from '../hooks/useWebhookOperations';

export function CreateWebhookForm() {
  const [pathId, setPathId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createMutation = useCreateWebhook();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      if (pathId.trim()) {
        formData.append('path_id', pathId.trim());
      }
      
      await createMutation.mutateAsync(formData);
      setPathId(''); // Reset form on success
    } catch (error) {
      console.error('Error creating webhook:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleReset = () => {
    setPathId('');
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Create New Webhook</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="path_id">Custom Path ID (Optional)</Label>
            <Input
              id="path_id"
              name="path_id"
              value={pathId}
              onChange={(e) => setPathId(e.target.value)}
              placeholder="my-custom-webhook"
              className="w-full"
              disabled={isSubmitting}
            />
            <p className="text-sm text-muted-foreground">
              Leave empty to auto-generate a unique ID
            </p>
          </div>
          <div className="flex items-center justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={handleReset}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || createMutation.isPending}
            >
              {isSubmitting || createMutation.isPending ? 'Creating...' : 'Create Webhook'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}