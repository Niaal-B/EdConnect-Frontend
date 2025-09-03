"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Award } from "lucide-react"
import type { Mentor } from "@/lib/api"
import { MentorDetailsModal } from "@/components/mentors/MentorDetailsModal"
import api from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface MentorCardProps {
  mentor: Mentor
}

interface Connection {
  id: number
  status: string
  mentor: number
}

export function MentorCard({ mentor }: MentorCardProps) {
  const [showModal, setShowModal] = useState(false)
  const [connection, setConnection] = useState<Connection | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const displayName = mentor.username || `Mentor ${mentor.id}`
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const getExpertiseArray = (): string[] => {
    if (Array.isArray(mentor.expertise)) return mentor.expertise
    if (typeof mentor.expertise === "object" && mentor.expertise !== null) return Object.keys(mentor.expertise)
    return []
  }

  const fetchConnectionStatus = async () => {
    try {
      const res = await api.get("connections/")
      const existing = res.data.results.find((conn: Connection) => conn.mentor === mentor.user_id)
      setConnection(existing || null)
    } catch {
      setConnection(null)
    }
  }

  const handleConnect = async () => {
    setLoading(true)
    try {
      const res = await api.post("connections/request/", { mentor_id: mentor.user_id })
      setConnection(res.data)
      toast({ title: "Request Sent", description: "Connection request sent successfully." })
    } catch (error: any) {
      let message = "Failed to send connection request."
  
      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          message = error.response.data
        } else if (typeof error.response.data === "object") {
          message = Object.values(error.response.data).flat().join(" ")
        }
      }
  
      toast({ title: "Error", description: message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }
  

  const handleCancel = async () => {
    if (!connection) return
    setLoading(true)
    try {
      await api.delete(`connections/${connection.id}/cancel/`)
      setConnection(null)
      toast({ title: "Request Cancelled", description: "Connection request cancelled." })
    } catch {
      toast({ title: "Error", description: "Failed to cancel request.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConnectionStatus()
  }, [])

  const renderActionButton = () => {
    if (!connection || connection.status === "rejected") {
      return (
        <Button onClick={handleConnect} disabled={loading} size="sm" className="bg-blue-600 hover:bg-blue-700">
          {loading ? "Connecting..." : "Connect"}
        </Button>
      )
    }

    if (connection.status === "pending") {
      return (
        <Button onClick={handleCancel} variant="outline" className="bg-red-500 text-white hover:bg-red-600 cursor-default" size="sm" disabled={loading}>
          {loading ? "Cancelling..." : "Pending"}
        </Button>
      )
    }

    if (connection.status === "accepted") {
      return (
        <Button disabled size="sm" className="bg-green-500 text-white hover:bg-green-600 cursor-default" >
          Connected
        </Button>
      )
    }

    return null
  }

  return (
    <>
      <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={mentor.profile_picture || undefined} />
                <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">{initials}</AvatarFallback>
              </Avatar>
              {mentor.is_verified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1">
                  <Award className="h-3 w-3 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 truncate">{displayName}</h3>
                  <div className="flex items-center mt-1 space-x-4 text-sm text-gray-500">
                    <span>{mentor.experience_years} years experience</span>
                    {mentor.countries?.length > 0 && (
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {mentor.countries[0]}
                      </span>
                    )}
                  </div>
                </div>
                {mentor.price && (
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">${mentor.price}</div>
                    <div className="text-xs text-gray-500">per hour</div>
                  </div>
                )}
              </div>

              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-sm font-medium text-gray-900">{mentor.rating || 4.8}</span>
                  <span className="ml-1 text-sm text-gray-500">({mentor.reviews || "New"})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bio or description if available */}

          {/* Skills */}
          {getExpertiseArray().length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-1">
                {getExpertiseArray()
                  .slice(0, 4)
                  .map((skill, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                {getExpertiseArray().length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{getExpertiseArray().length - 4}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <Button variant="outline" size="sm" onClick={() => setShowModal(true)}>
              View Profile
            </Button>
            {renderActionButton()}
          </div>
        </CardContent>
      </Card>

      <MentorDetailsModal mentor={mentor} isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  )
}
