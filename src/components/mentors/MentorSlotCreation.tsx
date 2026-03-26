import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, parse } from 'date-fns';
import { fromZonedTime, formatInTimeZone } from 'date-fns-tz';
import { Calendar, Clock, DollarSign, Globe, XCircle } from 'lucide-react';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import api from '@/lib/api';

const slotSchema = z.object({
  date: z.date({ required_error: 'Date is required' }),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  fee: z.coerce.number({
    required_error: 'Fee is required',
    invalid_type_error: 'Fee must be a number',
  }).positive('Fee must be a positive number'),
}).superRefine((data, ctx) => {
  if (!data.date || !data.startTime || !data.endTime) return;
  const start = parse(`${format(data.date, 'yyyy-MM-dd')}T${data.startTime}`, "yyyy-MM-dd'T'HH:mm", new Date());
  const end = parse(`${format(data.date, 'yyyy-MM-dd')}T${data.endTime}`, "yyyy-MM-dd'T'HH:mm", new Date());
  
  if (end <= start) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "End time must be after start time",
      path: ["endTime"]
    });
    return;
  }

  const duration = (end.getTime() - start.getTime()) / (1000 * 60);
  if (duration < 15 || duration > 120) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Duration must be between 15 and 120 minutes",
      path: ["endTime"]
    });
  }
});

type SlotFormData = z.infer<typeof slotSchema>;

interface CreatedSlot {
  id: string;
  start_time: string;
  end_time: string;
  fee: number;
  timezone: string;
  created_at: string;
  status: string;
}

const statusColors: Record<string, string> = {
  available: 'text-green-600',
  booked: 'text-blue-600',
  cancelled: 'text-red-600',
  completed: 'text-gray-600'
};

const MentorSlotCreation: React.FC = () => {
  const [userTimezone, setUserTimezone] = useState<string>('');
  const [createdSlots, setCreatedSlots] = useState<CreatedSlot[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<SlotFormData>({
    resolver: zodResolver(slotSchema),
    defaultValues: {
      startTime: '',
      endTime: '',
      fee: undefined
    },
    mode: "onChange",
  });

  const { reset } = form;

  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimezone(timezone);
    fetchCreatedSlots();
  }, []);

  const fetchCreatedSlots = async () => {
    try {
      const response = await api.get('mentors/slots/');
      setCreatedSlots(response.data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load slots', variant: 'destructive' });
    }
  };

  const cancelSlot = async (id: string) => {
    try {
      await api.patch(`mentors/slots/${id}/cancel/`);
      toast({ title: 'Slot Cancelled' });
      fetchCreatedSlots();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to cancel slot', variant: 'destructive' });
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(timeString);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const onSubmit = async (data: SlotFormData) => {
    setIsSubmitting(true);

    try {
      const start = parse(`${format(data.date, 'yyyy-MM-dd')}T${data.startTime}`, "yyyy-MM-dd'T'HH:mm", new Date());
      const end = parse(`${format(data.date, 'yyyy-MM-dd')}T${data.endTime}`, "yyyy-MM-dd'T'HH:mm", new Date());
      const startUTC = fromZonedTime(start, userTimezone);
      const endUTC = fromZonedTime(end, userTimezone);

      const res = await api.post('mentors/slots/', {
        start_time: startUTC.toISOString(),
        end_time: endUTC.toISOString(),
        fee: data.fee,
        timezone: userTimezone
      });

      const newSlot = res.data;
      setCreatedSlots(prev => [newSlot, ...prev]);
      toast({ title: 'Success', description: 'Slot created successfully' });
      reset();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create slot', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Create Availability Slot</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-2 mt-2">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : "Pick a date"}
                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fee"
                render={({ field }) => (
                  <FormItem className="space-y-2 mt-2">
                    <FormLabel>Fee ($)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input 
                          type="number" 
                          placeholder="Enter fee" 
                          className="pl-10" 
                          {...field} 
                          value={field.value ?? ''} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <select 
                        className={cn("w-full border rounded p-2 h-10", form.formState.errors.startTime ? "border-red-500" : "border-input")} 
                        {...field}
                      >
                        <option value="">Select Start Time</option>
                        {timeOptions.map(time => <option key={time} value={time}>{time}</option>)}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <select 
                        className={cn("w-full border rounded p-2 h-10", form.formState.errors.endTime ? "border-red-500" : "border-input")} 
                        {...field}
                      >
                        <option value="">Select End Time</option>
                        {timeOptions.map(time => <option key={time} value={time}>{time}</option>)}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="text-sm text-blue-700 flex items-center gap-2 mt-4">
              <Globe className="h-4 w-4" />
              Your timezone: <strong>{userTimezone}</strong>
            </div>

            <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Slot...' : 'Create Availability Slot'}
            </Button>
          </form>
        </Form>
      </div>
      
      {createdSlots.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Created Slots</CardTitle>
            <CardDescription>List of slots you've created</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {createdSlots.map((slot, index) => (
                <div key={index} className="p-4 bg-gray-100 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <p className="font-semibold text-sm">
                         {/* Display slot date formatting omitted to keep it similar to original */}
                          {formatInTimeZone(new Date(slot.start_time), userTimezone, 'MMM dd, yyyy')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <p className="text-sm text-gray-700">
                        {formatInTimeZone(new Date(slot.start_time), userTimezone, 'hh:mm a')} - {formatInTimeZone(new Date(slot.end_time), userTimezone, 'hh:mm a')}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-300">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <p className="font-bold text-green-600">{slot.fee}</p>
                      </div>
                      <p className={`text-xs font-semibold ${statusColors[slot.status] || 'text-gray-500'}`}>{slot.status}</p>
                    </div>

                    {slot.status === 'available' && (
                      <Button variant="destructive" size="sm" className="w-full mt-2 flex items-center gap-1" onClick={() => cancelSlot(slot.id)}>
                        <XCircle className="h-4 w-4" /> Cancel Slot
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MentorSlotCreation;
