'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useRequestStore } from '@/lib/stores/requestStore';
import { HttpMethod } from '../types/request.types';

interface RequestFiltersProps {
  onClose?: () => void;
}

const HTTP_METHODS: HttpMethod[] = [
  'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'success', label: 'Success (2xx)' },
  { value: 'redirect', label: 'Redirect (3xx)' },
  { value: 'client-error', label: 'Client Error (4xx)' },
  { value: 'server-error', label: 'Server Error (5xx)' },
];

export function RequestFilters({ onClose }: RequestFiltersProps) {
  const { filters, setFilters, resetFilters } = useRequestStore();
  
  const [searchInput, setSearchInput] = useState(filters.search);
  
  const handleMethodChange = (value: string) => {
    setFilters({ 
      method: value === 'all' ? null : value as HttpMethod 
    });
  };
  
  const handleStatusChange = (value: string) => {
    setFilters({ status: value === 'all' ? null : value });
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ search: searchInput });
  };
  
  const handleReset = () => {
    setSearchInput('');
    resetFilters();
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filter Requests</CardTitle>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="method-filter">HTTP Method</Label>
            <Select 
              value={filters.method || 'all'} 
              onValueChange={handleMethodChange}
            >
              <SelectTrigger id="method-filter">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                {HTTP_METHODS.map(method => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status-filter">Status Code</Label>
            <Select 
              value={filters.status || 'all'} 
              onValueChange={handleStatusChange}
            >
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2 md:col-span-2 lg:col-span-1">
            <Label htmlFor="search-filter">Search</Label>
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <Input
                id="search-filter"
                placeholder="Search in requests..."
                value={searchInput}
                onChange={handleSearchChange}
              />
              <Button type="submit" variant="secondary" size="sm" className="shrink-0">
                Search
              </Button>
            </form>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="ml-auto"
        >
          Reset Filters
        </Button>
      </CardFooter>
    </Card>
  );
}