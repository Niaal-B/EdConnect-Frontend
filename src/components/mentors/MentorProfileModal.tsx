"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

interface MentorInfo {
  full_name: string
  email: string
  profile_picture: string | null
  bio: string
  expertise: string
}

interface Mentor {
  id: number
  mentor_info: MentorInfo
}

export const MentorProfileModal = ({
  mentor,
  isOpen,
  onClose,
  onBookSession,
}: {
  mentor: Mentor
  isOpen: boolean
  onClose: () => void
  onBookSession: () => void
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Mentor Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Mentor Header */}
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={mentor.mentor_info.profile_picture || undefined} />
              <AvatarFallback>
                {mentor.mentor_info.full_name?.[0] || mentor.mentor_info.email[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">
                {mentor.mentor_info.full_name || mentor.mentor_info.email.split('@')[0]}
              </h2>
              <p className="text-gray-600">{mentor.mentor_info.email}</p>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold">4.8</span>
                <span className="text-gray-500 text-sm">(24 reviews)</span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {mentor.mentor_info.bio || "No bio provided."}
            </p>
          </div>

          {/* Expertise */}
          {/* <div>
            <h3 className="font-semibold mb-2">Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {mentor.mentor_info.expertise ? (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                  {mentor.mentor_info.expertise}
                </span>
              ) : (
                <span className="text-gray-500">No expertise specified</span>
              )}
            </div>
          </div> */}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={onBookSession}>
              Book a Session
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}