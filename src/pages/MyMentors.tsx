"use client"

import { useState, useEffect } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Users, Star, Calendar, Search, X, RefreshCw } from "lucide-react"
import { MentorProfileModal } from "@/components/mentors/MentorProfileModal"
import { SlotBookingModal } from "@/components/SlotBookingModal"
import api from "@/lib/api" // Import your axios instance

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

interface ApiResponse {
  count: number
  next: string | null
  previous: string | null
  results: Mentor[]
}

const MyMentors = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("rating")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const { toast } = useToast()
  const [isBookingLoading, setIsBookingLoading] = useState(false); 
  const [bookingError, setBookingError] = useState<string | null>(null);


  const fetchMentors = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await api.get<ApiResponse>("/connections/my-mentors/", {
        params: { page }
      })
      
      setMentors(prev => page === 1 ? response.data.results : [...prev, ...response.data.results])
      setHasMore(!!response.data.next)
    } catch (err) {
      setError("Failed to fetch mentors")
      console.error("Error fetching mentors:", err)
      toast({
        title: "Error",
        description: "Failed to load mentors. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMentors()
  }, [page])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setPage(1)
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
    setPage(1)
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setSortBy("rating")
    setStatusFilter("all")
    setPage(1)
  }

  const handleViewProfile = (mentor: Mentor) => {
    setSelectedMentor(mentor)
    setIsModalOpen(true)
  }

  const handleBookSession = (mentor: Mentor) => {
    setSelectedMentor(mentor)
    setIsBookingModalOpen(true)
  }

  const handleConfirmBooking = async (slotId: number) => {
    setIsBookingLoading(true);
    setBookingError(null)
    try {
      const response = await api.post(`/bookings/create/`, {
        slot_id: slotId,
        mentor_id: selectedMentor?.id
      })

      if (response.status === 201) {
        console.log("Booking initiated successfully:", response.data);
        const stripeCheckoutUrl = response.data.stripe_checkout_url;
        window.location.href = stripeCheckoutUrl;
      }else {
        setBookingError("Unexpected response from server.");
      }

      setIsBookingModalOpen(false)
      fetchMentors() // Refresh the list
    } catch (err: any) {

      console.log("error intiting booking ",err)
      let errorMessage = "Failed to initiate booking. Please try again.";
      if (err.response && err.response.data && err.response.data.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setBookingError(errorMessage);
      toast({
        title: "Booking Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }

  const handleLoadMore = () => {
    setPage(prev => prev + 1)
  }

  const handleRefresh = () => {
    setPage(1)
    toast({
      title: "Refreshed",
      description: "Your mentors list has been updated.",
    })
  }

  // Filter and sort mentors
  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch = 
      mentor.mentor_info.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.mentor_info.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.mentor_info.bio.toLowerCase().includes(searchQuery.toLowerCase()) 
      
    const hasAvailableSlots = mentor.mentor_info.slots.some(slot => slot.status === "available")
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "Available" && hasAvailableSlots) ||
      (statusFilter === "Busy" && !hasAvailableSlots)
    
    return matchesSearch && matchesStatus
  })

  const sortedMentors = [...filteredMentors].sort((a, b) => {
    if (sortBy === "name") return a.mentor_info.full_name.localeCompare(b.mentor_info.full_name)
    // Default sorting (by availability)
    const aAvailable = a.mentor_info.slots.some(s => s.status === "available")
    const bAvailable = b.mentor_info.slots.some(s => s.status === "available")
    return bAvailable ? 1 : -1
  })

  const stats = [
    { icon: Users, label: "Your Mentors", value: mentors.length.toString(), color: "from-blue-500 to-blue-600" },
    { icon: Calendar, label: "Scheduled Sessions", value: "2", color: "from-purple-500 to-purple-600" },
  ]

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar activeSection="My Mentors" />
        <main className="flex-1">
          {/* Hero Section */}
          <div className="relative bg-white border-b">
            <div className="max-w-6xl mx-auto px-8 py-16">
              <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
                  My Mentors
                </h1>
                <p className="text-lg leading-8 text-gray-600 mb-8">
                  Connect with your mentors, schedule sessions, and continue your learning journey.
                </p>
                
                {/* Stats */}
                <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
                  {stats.map((stat, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className={`w-8 h-8 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                        <stat.icon className="h-4 w-4 text-white" />
                      </div>
                      <span>{stat.value} {stat.label.toLowerCase()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-8 py-12">
            <div className="flex gap-6">
              {/* Main content */}
              <div className="flex-1">
                {/* Search and Filters */}
                <div className="bg-white rounded-lg border shadow-sm p-6 mb-8">
                  <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
                    {/* Search Bar */}
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search your mentors..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                      {searchQuery && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1 h-8 w-8 p-0"
                          onClick={() => handleSearch("")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* Filters */}
                    <div className="flex space-x-2">
                      <Select value={statusFilter} onValueChange={handleStatusFilter}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="Available">Available</SelectItem>
                          <SelectItem value="Busy">Busy</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rating">Rating</SelectItem>
                          <SelectItem value="name">Name</SelectItem>
                        </SelectContent>
                      </Select>

                      {(searchQuery || statusFilter !== "all" || sortBy !== "rating") && (
                        <Button variant="outline" onClick={handleClearFilters}>
                          <X className="h-4 w-4 mr-2" />
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Active Filters */}
                  {(searchQuery || statusFilter !== "all" || sortBy !== "rating") && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="text-sm text-gray-500">Filters:</span>
                      {searchQuery && <Badge variant="secondary">Search: "{searchQuery}"</Badge>}
                      {statusFilter !== "all" && <Badge variant="secondary">Status: {statusFilter}</Badge>}
                      {sortBy !== "rating" && <Badge variant="secondary">Sort: {sortBy}</Badge>}
                    </div>
                  )}
                </div>

                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Your Mentors</h2>
                    <p className="text-gray-600 mt-1">{filteredMentors.length} mentors</p>
                  </div>
                  <Button variant="outline" onClick={handleRefresh}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>

                {/* Mentors Grid */}
                {loading && page === 1 ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <X className="h-10 w-10 text-red-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Failed to load mentors</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      {error}. Please try refreshing the page.
                    </p>
                    <Button
                      variant="outline"
                      onClick={fetchMentors}
                      className="bg-white border-gray-200 hover:bg-gray-50 rounded-xl shadow-sm px-6 py-3"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry
                    </Button>
                  </div>
                ) : sortedMentors.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                      {sortedMentors.map((mentor) => {
                        const hasAvailableSlots = mentor.mentor_info.slots.some(s => s.status === "available")
                        const status = hasAvailableSlots ? "Available" : "Busy"
                        const statusColor = status === "Available" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"

                        return (
                          <div key={mentor.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
                            <div className="p-6">
                              {/* Header */}
                              <div className="flex items-start gap-4 mb-4">
                                {mentor.mentor_info.profile_picture ? (
                                  <img 
                                    src={mentor.mentor_info.profile_picture} 
                                    alt={mentor.mentor_info.full_name}
                                    className="w-16 h-16 rounded-2xl object-cover"
                                  />
                                ) : (
                                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                                    {mentor.mentor_info.full_name?.[0] || mentor.mentor_info.email[0].toUpperCase()}
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-bold text-gray-900 text-lg truncate">
                                    {mentor.mentor_info.full_name || mentor.mentor_info.email.split('@')[0]}
                                  </h3>
                                  <Badge variant="secondary" className={`${statusColor} text-xs px-2 py-1`}>
                                    {status}
                                  </Badge>
                                </div>
                              </div>

                              {/* Expertise */}
                              {/* <div className="mb-6">
                                <div className="flex flex-wrap gap-1">
                                  {mentor.mentor_info.expertise && (
                                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                      {mentor.mentor_info.expertise}
                                    </Badge>
                                  )}
                                </div>
                              </div> */}

                              {/* Actions */}
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewProfile(mentor)}
                                  className="flex-1 hover:bg-gray-50"
                                >
                                  View Profile
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleBookSession(mentor)}
                                  disabled={!hasAvailableSlots}
                                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                >
                                  <Calendar className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {hasMore && (
                      <div className="mt-8 flex justify-center">
                        <Button 
                          variant="outline" 
                          onClick={handleLoadMore}
                          disabled={loading}
                        >
                          {loading ? "Loading..." : "Load More"}
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Search className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No mentors found</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Try adjusting your search criteria or filters to find your mentors.
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleClearFilters}
                      className="bg-white border-gray-200 hover:bg-gray-50 rounded-xl shadow-sm px-6 py-3"
                    >
                      Clear all filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Mentor Profile Modal */}
      {selectedMentor && (
        <MentorProfileModal
          mentor={selectedMentor}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onBookSession={() => handleBookSession(selectedMentor)}
        />
      )}

      {/* Slot Booking Modal */}
      {selectedMentor && isBookingModalOpen && (
        <SlotBookingModal
          mentor={selectedMentor}
          isOpen={isBookingModalOpen}
          onClose={() =>{ setIsBookingModalOpen(false);fetchMentors();fetchMentors()}}
          onConfirm={handleConfirmBooking}
        />
      )}
    </SidebarProvider>
  )
}

export default MyMentors