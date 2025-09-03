import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SessionTable } from './SessionTable';
import { SessionSearch } from './SessionSearch';
import { SessionFilters } from './SessionFilter';

export const SessionManagementContent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    paymentStatus: 'all',
    dateRange: 'all'
  });
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Session Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage all mentorship sessions
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sessions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SessionSearch 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>
            <SessionFilters 
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">All Sessions</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
              <TabsTrigger value="canceled">Canceled</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="refunded">Refunded</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              <SessionTable 
                filterType="all"
                searchQuery={searchQuery}
                filters={filters}
              />
            </TabsContent>
            
            <TabsContent value="confirmed" className="mt-4">
              <SessionTable 
                filterType="confirmed"
                searchQuery={searchQuery}
                filters={filters}
              />
            </TabsContent>
            
            
            <TabsContent value="canceled" className="mt-4">
              <SessionTable 
                filterType="canceled"
                searchQuery={searchQuery}
                filters={filters}
              />
            </TabsContent>
            
            <TabsContent value="completed" className="mt-4">
              <SessionTable 
                filterType="completed"
                searchQuery={searchQuery}
                filters={filters}
              />
            </TabsContent>
            
            <TabsContent value="refunded" className="mt-4">
              <SessionTable 
                filterType="refunded"
                searchQuery={searchQuery}
                filters={filters}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};