
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CalendarPlus, Clock } from "lucide-react";
import { addDays } from "date-fns";

interface AvailabilityDialogProps {
  open: boolean;
  onClose: () => void;
}

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00", "21:30"
];

const AvailabilityDialog: React.FC<AvailabilityDialogProps> = ({ open, onClose }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("10:00");
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);

  const handleDayClick = (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    
    // Add or remove from selected days
    const exists = selectedDays.some(d => 
      d.getDate() === date.getDate() && 
      d.getMonth() === date.getMonth() && 
      d.getFullYear() === date.getFullYear()
    );
    
    if (exists) {
      setSelectedDays(selectedDays.filter(d => 
        d.getDate() !== date.getDate() || 
        d.getMonth() !== date.getMonth() || 
        d.getFullYear() !== date.getFullYear()
      ));
    } else {
      setSelectedDays([...selectedDays, date]);
    }
  };

  const handleSaveAvailability = () => {
    // Validate time selection
    const start = parseInt(startTime.split(":")[0]);
    const end = parseInt(endTime.split(":")[0]);
    
    if (start >= end || (start === end && startTime.split(":")[1] >= endTime.split(":")[1])) {
      toast.error("End time must be after start time");
      return;
    }
    
    if (selectedDays.length === 0) {
      toast.error("Please select at least one day");
      return;
    }

    // In a real app, this would save to the database
    toast.success(`Availability set for ${selectedDays.length} day(s)`);
    
    console.log("Saving availability:", {
      days: selectedDays,
      startTime,
      endTime
    });
    
    onClose();
  };

  const getDaysBetween = () => {
    const today = new Date();
    const inTwoMonths = addDays(today, 60); // Show next 60 days
    return { from: today, to: inTwoMonths };
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CalendarPlus className="w-5 h-5 mr-2" /> Set Your Availability
          </DialogTitle>
          <DialogDescription>
            Select days and time slots when you're available for mentoring sessions.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <Label>Select Dates</Label>
            <div className="border rounded-md">
              <Calendar
                mode="multiple"
                selected={selectedDays}
                onSelect={setSelectedDays as any}
                disabled={(date) => date < new Date()}
                className="p-3 pointer-events-auto"
                initialFocus
                defaultMonth={new Date()}
                footer={<div className="text-sm text-center p-2 text-muted-foreground">
                  {selectedDays.length} day(s) selected
                </div>}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Time Slot</Label>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <Label>Start Time</Label>
                  </div>
                  <Select value={startTime} onValueChange={setStartTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={`start-${time}`} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <Label>End Time</Label>
                  </div>
                  <Select value={endTime} onValueChange={setEndTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select end time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={`end-${time}`} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Selected Availability</h3>
                <ul className="space-y-1">
                  {selectedDays.length === 0 ? (
                    <li className="text-sm text-gray-500 italic">No days selected yet</li>
                  ) : (
                    selectedDays.map((day, index) => (
                      <li key={index} className="text-sm">
                        {day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • {startTime} - {endTime}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSaveAvailability}>Save Availability</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AvailabilityDialog;
