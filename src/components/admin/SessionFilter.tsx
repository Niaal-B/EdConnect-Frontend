import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, RotateCcw } from 'lucide-react';

interface SessionFiltersProps {
  filters: {
    status: string;
    paymentStatus: string;
    dateRange: string;
  };
  onFiltersChange: (filters: any) => void;
}

export const SessionFilters = ({ filters, onFiltersChange }: SessionFiltersProps) => {
  const resetFilters = () => {
    onFiltersChange({
      status: 'all',
      paymentStatus: 'all',
      dateRange: 'all'
    });
  };

  return (
    <div className="flex gap-2 items-center">
      <Filter className="h-4 w-4 text-muted-foreground" />
      
      <Select
        value={filters.status}
        onValueChange={(value) => 
          onFiltersChange({ ...filters, status: value })
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="confirmed">Confirmed</SelectItem>
          <SelectItem value="pending">Pending Payment</SelectItem>
          <SelectItem value="canceled_mentor">Canceled by Mentor</SelectItem>
          <SelectItem value="canceled_student">Canceled by Student</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.paymentStatus}
        onValueChange={(value) => 
          onFiltersChange({ ...filters, paymentStatus: value })
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Payment" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Payments</SelectItem>
          <SelectItem value="paid">Paid</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="refunded">Refunded</SelectItem>
          <SelectItem value="no_refund">No Refund</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.dateRange}
        onValueChange={(value) => 
          onFiltersChange({ ...filters, dateRange: value })
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Date Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="week">This Week</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
          <SelectItem value="quarter">This Quarter</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" size="sm" onClick={resetFilters}>
        <RotateCcw className="h-3 w-3 mr-1" />
        Reset
      </Button>
    </div>
  );
};