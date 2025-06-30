'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Box, 
  ChevronDown, 
  ChevronRight, 
  Link2, 
  Plus,
  Settings,
  UserCog,
  Webhook
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils/cn';
import { useWebhooks } from '@/features/webhooks/hooks/useWebhookOperations';
import { useUiStore } from '@/lib/stores/uiStore';
import { Skeleton } from '@/components/ui/skeleton';
import type { WebhookPath } from '@/features/webhooks/types/webhook.types';

export function Sidebar() {
  const pathname = usePathname();
  const { data: webhooks, isLoading } = useWebhooks();
  const { sidebarOpen, setSidebarOpen } = useUiStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Initial check
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

  if (!mounted) {
    return null;
  }

  if (!sidebarOpen) {
    return null;
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r bg-background transition-transform md:translate-x-0">
      <div className="flex h-16 items-center gap-2 border-b px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <span className="text-sm font-bold text-primary-foreground">CL</span>
          </div>
          <span className="text-lg font-semibold">CallbackListener</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Close sidebar"
          className="ml-auto md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className="grid gap-2 px-2">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors",
              pathname === "/" && "bg-muted"
            )}
          >
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/webhooks"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors",
              pathname === "/webhooks" && "bg-muted"
            )}
          >
            <Webhook className="h-4 w-4" />
            Webhooks
          </Link>

          {/* Webhooks section */}
          <div className="mt-4">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-1 text-xs font-medium uppercase text-muted-foreground">
                <Link2 className="h-3.5 w-3.5" />
                <span>My Webhooks</span>
              </div>
              <Button asChild variant="ghost" size="icon" className="h-7 w-7">
                <Link href="/webhooks">
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">New webhook</span>
                </Link>
              </Button>
            </div>
            <div className="grid gap-1 px-1">
              {isLoading && (
                <>
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </>
              )}

              {!isLoading && webhooks?.map((webhook: WebhookPath) => (
                <Link
                  key={webhook.id}
                  href={`/webhooks/${webhook.path_id}/logs`}
                  className={cn(
                    "flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors",
                    pathname === `/webhooks/${webhook.path_id}/logs` && "bg-muted"
                  )}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      webhook.status === "active" ? "bg-success" : "bg-destructive"
                    )} />
                    <span className="truncate">{webhook.path_id}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>
              ))}

              {!isLoading && webhooks?.length === 0 && (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No webhooks found.
                </div>
              )}
            </div>
          </div>
        </nav>
      </ScrollArea>

      <div className="mt-auto border-t">
        <div className="grid gap-1 p-2">
          <Button variant="ghost" size="sm" className="justify-start">
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </Button>
          <Button variant="ghost" size="sm" className="justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>
    </aside>
  );
}