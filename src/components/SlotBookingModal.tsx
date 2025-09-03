// "use client"

import { Button } from "@/components/ui/button"
// Dialog imports are no longer needed if using Sheet exclusively
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"
import { Calendar, Clock } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useState } from "react"; // Import useState for managing selected slot within the modal

interface Slot {
  id: number
  start_time: string
  end_time: string
  fee: string
  timezone: string
  status: string
}

interface MentorInfo {
  full_name: string
  email: string
  profile_picture: string | null
  bio: string
  expertise: string
  slots: Slot[]
}

interface Mentor {
  id: number
  mentor_info: MentorInfo
}

export const SlotBookingModal = ({
  mentor,
  isOpen,
  onClose,
  onConfirm, // Keep this prop, the parent will handle the API call
  isLoading, // NEW: Prop to indicate if the parent is loading
  bookingError, // NEW: Prop to display error from the parent
}: {
  mentor: Mentor
  isOpen: boolean
  onClose: () => void
  onConfirm: (slotId: number) => Promise<void> | void // onConfirm might be async
  isLoading: boolean // NEW
  bookingError: string | null // NEW
}) => {
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null); // State for selected slot within the modal

  // Filter out past and cancelled/booked slots
  const availableSlots = mentor.mentor_info.slots
    .filter(slot => {
      const now = new Date();
      const slotStartTime = new Date(slot.start_time);
      return slot.status === 'available' && slotStartTime > now;
    })
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()); // Sort by time

  const handleBookButtonClick = () => {
    if (selectedSlotId) {
      onConfirm(selectedSlotId); // Call the parent's onConfirm function
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[600px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl">
            Book a Session with {mentor.mentor_info.full_name || mentor.mentor_info.email.split('@')[0]}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          {availableSlots.length > 0 ? (
            <>
              {availableSlots.map((slot) => (
                <div
                  key={slot.id}
                  className={`border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer transition-all duration-200
                    ${selectedSlotId === slot.id
                      ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                    }
                  `}
                  onClick={() => setSelectedSlotId(slot.id)} // Allow selection
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span>{format(new Date(slot.start_time), 'MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>
                        {format(new Date(slot.start_time), 'h:mm a')} - {format(new Date(slot.end_time), 'h:mm a')}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      Fee: ${parseFloat(slot.fee).toFixed(2)} • Timezone: {slot.timezone}
                    </div>
                  </div>
                  {/* The actual Book Now button will be at the bottom, not per slot */}
                </div>
              ))}
              {/* Global "Proceed to Payment" button */}
              {bookingError && (
                <p className="text-red-500 text-sm text-center mt-4">{bookingError}</p>
              )}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={onClose} disabled={isLoading}>
                  Cancel
                </Button>
                <Button
                  onClick={handleBookButtonClick}
                  disabled={!selectedSlotId || isLoading || availableSlots.length === 0}
                >
                  {isLoading ? "Redirecting to Payment..." : "Proceed to Payment"}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No available slots for this mentor.</p>
              <Button
                variant="outline"
                onClick={onClose}
                className="mt-4"
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}