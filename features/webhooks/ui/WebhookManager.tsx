'use client';

import { SearchX, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWebhookStore } from '@/lib/stores/webhookStore';
import { CreateWebhookForm } from './CreateWebhookForm';
import { WebhookList } from './WebhookList';
import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

export function WebhookManager() {
  const { filters, setFilters, resetFilters } = useWebhookStore();
  const [showFilters, setShowFilters] = useState(false);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ search: e.target.value });
  };
  

  
  const handleSortByChange = (value: string) => {
    setFilters({ sortBy: value as any });
  };
  
  const handleSortOrderChange = (value: string) => {
    setFilters({ sortOrder: value as 'asc' | 'desc' });
  };
  
  const hasActiveFilters = filters.search;
  
  return (
    <div className="space-y-8">
      <div className="grid gap-6">
        <CreateWebhookForm />
      </div>
      
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold">Your Webhooks</h2>
          
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Input
                placeholder="Search webhooks..."
                value={filters.search}
                onChange={handleSearchChange}
                className="w-full"
              />
              {filters.search && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setFilters({ search: '' })}
                >
                  <SearchX className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
            </div>
            
            <Button
              variant={hasActiveFilters ? "default" : "outline"} 
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="sr-only">Filters</span>
            </Button>
            
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
              >
                Reset
              </Button>
            )}
          </div>
        </div>
        
        <div className={cn(
          "grid gap-4 rounded-lg border bg-card p-4 transition-all",
          showFilters ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}>
          <div className={cn(
            "overflow-hidden transition-all",
            showFilters ? "opacity-100" : "opacity-0"
          )}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="sort-by">Sort By</Label>
                <Select 
                  value={filters.sortBy} 
                  onValueChange={handleSortByChange}
                >
                  <SelectTrigger id="sort-by">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at">Created Date</SelectItem>
                    <SelectItem value="updated_at">Last Activity</SelectItem>
                    <SelectItem value="request_count">Request Count</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sort-order">Sort Order</Label>
                <Select 
                  value={filters.sortOrder} 
                  onValueChange={handleSortOrderChange}
                >
                  <SelectTrigger id="sort-order">
                    <SelectValue placeholder="Sort order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        <WebhookList />
      </div>
    </div>
  );
}