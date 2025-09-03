import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SessionSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const SessionSearch = ({ searchQuery, onSearchChange }: SessionSearchProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search by session ID, student name, mentor name, or email..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-9"
      />
    </div>
  );
};