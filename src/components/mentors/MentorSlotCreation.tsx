import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
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

import api from '@/lib/api';

interface SlotFormData {
  date?: Date;
  startTime: string;
  endTime: string;
  fee: number | '';
}

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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<SlotFormData>({
    defaultValues: {
      startTime: '',
      endTime: '',
      fee: ''
    }
  });

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
    if (!data.date) {
      toast({ title: 'Validation Error', description: 'Date is required', variant: 'destructive' });
      return;
    }

    if (!data.startTime || !data.endTime) {
      toast({ title: 'Validation Error', description: 'Start and end time are required', variant: 'destructive' });
      return;
    }

    const start = parse(`${format(data.date, 'yyyy-MM-dd')}T${data.startTime}`, "yyyy-MM-dd'T'HH:mm", new Date());
    const end = parse(`${format(data.date, 'yyyy-MM-dd')}T${data.endTime}`, "yyyy-MM-dd'T'HH:mm", new Date());
    const duration = (end.getTime() - start.getTime()) / (1000 * 60);

    if (end <= start) {
      toast({ title: 'Validation Error', description: 'End time must be after start time', variant: 'destructive' });
      return;
    }

    if (duration < 15 || duration > 120) {
      toast({ title: 'Validation Error', description: 'Duration must be 15–120 minutes', variant: 'destructive' });
      return;
    }

    if (!data.fee || data.fee <= 0) {
      toast({ title: 'Validation Error', description: 'Fee must be a positive number', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    try {
      const startUTC = fromZonedTime(start, userTimezone);
      const endUTC = fromZonedTime(end, userTimezone);

      const res = await api.post('mentors/slots/', {
        start_time: startUTC.toISOString(),
        end_time: endUTC.toISOString(),
        fee: data.fee,
        timezone: userTimezone
      });

      const newSlot = res.data;
      console.log(newSlot,"this is the slots")
      setCreatedSlots(prev => [newSlot, ...prev]);
      toast({ title: 'Success', description: 'Slot created successfully' });
      reset();
      setSelectedDate(undefined);
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                <Calendar className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setValue('date', date);
                }}
                disabled={(date) => date <   new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label>Fee ($)</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input type="number" placeholder="Enter fee" className="pl-10" {...register('fee')} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Start Time</Label>
          <select className="w-full border rounded p-2" {...register('startTime')}>
            <option value="">Select Start Time</option>
            {timeOptions.map(time => <option key={time} value={time}>{time}</option>)}
          </select>
        </div>

        <div>
          <Label>End Time</Label>
          <select className="w-full border rounded p-2" {...register('endTime')}>
            <option value="">Select End Time</option>
            {timeOptions.map(time => <option key={time} value={time}>{time}</option>)}
          </select>
        </div>
      </div>

      <div className="text-sm text-blue-700 flex items-center gap-2">
        <Globe className="h-4 w-4" />
        Your timezone: <strong>{userTimezone}</strong>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Creating Slot...' : 'Create Availability Slot'}
      </Button>
    </form>
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
