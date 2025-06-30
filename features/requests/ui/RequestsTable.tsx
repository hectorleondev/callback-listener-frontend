'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatters } from '@/lib/utils/formatters';
import { CapturedRequest } from '../types/request.types';
import { LoadingSpinner } from '@/features/common/ui/LoadingSpinner';
import { EmptyState } from '@/features/common/ui/EmptyState';
import { RequestDetailsModal } from './RequestDetailsModal';
import { Webhook } from 'lucide-react';

interface RequestsTableProps {
  requests: CapturedRequest[];
  pathId: string;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
  };
  isLoading?: boolean;
  isError?: boolean;
}

export function RequestsTable({ 
  requests, 
  pathId, 
  pagination,
  isLoading = false,
  isError = false,
}: RequestsTableProps) {
  const [selectedRequest, setSelectedRequest] = useState<CapturedRequest | null>(null);
  
  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (isError) {
    return (
      <EmptyState
        title="Failed to load requests"
        description="We couldn't load the request logs for this webhook. Please try again."
        action={{
          label: "Try Again",
          onClick: () => window.location.reload(),
        }}
      />
    );
  }
  
  if (requests.length === 0) {
    return (
      <EmptyState
        icon={<Webhook className="h-10 w-10" />}
        title="No requests yet"
        description={`This webhook hasn't received any requests yet. Send a request to ${pathId} to see it here.`}
      />
    );
  }
  
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead className="hidden md:table-cell">Time</TableHead>
              <TableHead className="hidden lg:table-cell">Response Time</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    {request.method}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={request.status_code && request.status_code < 400 ? 'success' : 'destructive'}
                  >
                    {request.status_code || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs truncate max-w-[120px]">
                  {request.ip_address || 'Unknown'}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatters.timeAgo(request.timestamp)}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {request.response_time ? `${request.response_time}ms` : 'N/A'}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedRequest(request)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <RequestDetailsModal
        request={selectedRequest}
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
    </>
  );
}