'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CopyButton } from '@/features/common/ui/CopyButton';
import { formatters } from '@/lib/utils/formatters';
import { CapturedRequest } from '../types/request.types';
import { useTheme } from 'next-themes';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

interface RequestDetailsModalProps {
  request: CapturedRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RequestDetailsModal({ 
  request, 
  isOpen, 
  onClose 
}: RequestDetailsModalProps) {
  const [activeTab, setActiveTab] = useState('headers');
  const { theme } = useTheme();
  const { toast } = useToast();
  
  const handleCopy = (content: string, label: string) => {
    console.log(`${label} copied to clipboard`);
    // toast({
    //   title: `${label} copied to clipboard`,
    //   variant: "success",
    // });
  };
  
  if (!request) return null;

  const syntaxTheme = theme === 'dark' ? atomDark : coy;
  
  const formatJson = (json: string | undefined) => {
    if (!json) return '';
    try {
      return JSON.stringify(JSON.parse(json), null, 2);
    } catch (e) {
      return json;
    }
  };
  
  const formattedBody = request.body ? formatJson(request.body) : '';
  const hasQueryParams = Object.keys(request.query_params).length > 0;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              {request.method}
            </Badge>
            Request Details
            <Badge 
              variant={request.status_code && request.status_code < 400 ? 'success' : 'destructive'}
              className="ml-2"
            >
              {request.status_code || 'N/A'}
            </Badge>
          </DialogTitle>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="font-medium">Path:</span> 
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                {request.path_id}
              </code>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">Time:</span> 
              {formatters.date(request.timestamp, 'PPpp')}
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">IP:</span> 
              {request.ip_address || 'Unknown'}
            </div>
          </div>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="headers">Headers</TabsTrigger>
            <TabsTrigger value="body">Body</TabsTrigger>
            <TabsTrigger value="query">Query</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>
          
          <TabsContent value="headers" className="mt-4 rounded-md border">
            <div className="flex justify-end p-2">
              <CopyButton 
                value={JSON.stringify(request.headers, null, 2)} 
                onCopy={() => handleCopy(JSON.stringify(request.headers, null, 2), 'Headers')}
              />
            </div>
            <div className="max-h-[400px] overflow-auto p-4 pt-0">
              {Object.entries(request.headers).map(([key, value]) => (
                <div key={key} className="flex flex-col border-b py-2 last:border-0">
                  <span className="font-medium">{key}</span>
                  <code className="mt-1 break-all text-sm">{value}</code>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="body" className="mt-4 rounded-md border">
            {request.body ? (
              <>
                <div className="flex justify-end p-2">
                  <CopyButton 
                    value={request.body} 
                    onCopy={() => handleCopy(request.body || '', 'Body')}
                  />
                </div>
                <div className="max-h-[400px] overflow-auto">
                  <SyntaxHighlighter 
                    language="json" 
                    style={syntaxTheme}
                    customStyle={{ margin: 0, borderRadius: 0 }}
                  >
                    {formattedBody}
                  </SyntaxHighlighter>
                </div>
              </>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No body content available for this request
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="query" className="mt-4 rounded-md border">
            {hasQueryParams ? (
              <>
                <div className="flex justify-end p-2">
                  <CopyButton 
                    value={JSON.stringify(request.query_params, null, 2)} 
                    onCopy={() => handleCopy(JSON.stringify(request.query_params, null, 2), 'Query parameters')}
                  />
                </div>
                <div className="max-h-[400px] overflow-auto p-4 pt-0">
                  {Object.entries(request.query_params).map(([key, value]) => (
                    <div key={key} className="flex flex-col border-b py-2 last:border-0">
                      <span className="font-medium">{key}</span>
                      <code className="mt-1 break-all text-sm">{value}</code>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No query parameters for this request
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="metadata" className="mt-4 space-y-4 rounded-md border p-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Request ID</h3>
              <div className="flex items-center gap-2 rounded bg-muted p-2">
                <code className="flex-1 font-mono text-sm">{request.id}</code>
                <CopyButton 
                  value={request.id} 
                  onCopy={() => handleCopy(request.id, 'Request ID')}
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Timestamp</h3>
                <p>{formatters.date(request.timestamp, 'PPpp')}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Response Time</h3>
                <p>{request.response_time ? `${request.response_time}ms` : 'N/A'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">IP Address</h3>
                <p className="font-mono">{request.ip_address || 'Unknown'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Status Code</h3>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={request.status_code && request.status_code < 400 ? 'success' : 'destructive'}
                  >
                    {request.status_code || 'N/A'}
                  </Badge>
                  {request.status_code && (
                    <span className="text-sm">
                      {formatters.statusCodeToText(request.status_code)}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground">User Agent</h3>
                <p className="break-words text-sm">{request.user_agent || 'Unknown'}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}