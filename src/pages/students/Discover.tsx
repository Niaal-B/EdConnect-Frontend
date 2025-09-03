  "use client"

  import type React from "react"

  import { useState, useEffect, useCallback } from "react"
  import { SidebarProvider } from "@/components/ui/sidebar"
  import { AppSidebar } from "@/components/app-sidebar"
  import { Button } from "@/components/ui/button"
  import { Badge } from "@/components/ui/badge"
  import { Input } from "@/components/ui/input"
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
  import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
  import { Users, MapPin, Star, Loader2, AlertCircle, Search, X, RefreshCw } from "lucide-react"
  import { MentorCard } from "@/components/MentorCard"
  import { discoverMentorApi, type MentorApiResponse, type MentorSearchParams } from "@/lib/api"

  const formatExpertise = (expertise: any): string => {
    if (!expertise) return ""
    if (Array.isArray(expertise)) {
      return expertise.filter(Boolean).join(", ")
    }
    if (typeof expertise === "object" && expertise !== null) {
      return Object.entries(expertise)
        .filter(([_, value]) => Boolean(value))
        .map(([key]) => key)
        .join(", ")
    }
    if (typeof expertise === "string") {
      return expertise
    }
    return ""
  }

  const MentorFilters = ({
    filters,
    onFiltersChange,
    onSearch,
    onClearFilters,
    isLoading,
  }: {
    filters: any
    onFiltersChange: (filters: any) => void
    onSearch: (query: string) => void
    onClearFilters: () => void
    isLoading: boolean
  }) => {
    const [searchInput, setSearchInput] = useState("")

    const expertiseOptions = [
      "Python",
      "JavaScript",
      "React",
      "Node.js",
      "Data Science",
      "Machine Learning",
      "DevOps",
      "UX/UI",
      "Java",
      "C++",
      "Mobile Development",
      "Web Development",
      "AI/ML",
      "Cloud Computing",
      "Cybersecurity",
    ]

    const experienceOptions = [
      { value: "1", label: "1+ years" },
      { value: "2", label: "2+ years" },
      { value: "3", label: "3+ years" },
      { value: "5", label: "5+ years" },
      { value: "7", label: "7+ years" },
      { value: "10", label: "10+ years" },
      { value: "15", label: "15+ years" },
    ]

    const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSearch(searchInput.trim())
    }

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setSearchInput(value)
    }

    const handleClearSearch = () => {
      setSearchInput("")
      onSearch("")
    }

    const handleExpertiseChange = (value: string) => {
      onFiltersChange({ expertise: value || undefined })
    }

    const handleExperienceChange = (value: string) => {
      onFiltersChange({ experience_min: value ? Number.parseInt(value) : undefined })
    }

    const hasActiveFilters = filters.expertise || filters.experience_min || searchInput

    return (
      <div className="bg-white rounded-lg border shadow-sm p-6 mb-8">
        <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search mentors..."
              className="pl-10"
              value={searchInput}
              onChange={handleSearchInputChange}
              disabled={isLoading}
            />
            {searchInput && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 p-0"
                onClick={handleClearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </form>

          {/* Filters */}
          <div className="flex space-x-2">
            <Select value={filters.expertise || "all"} onValueChange={handleExpertiseChange} disabled={isLoading}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All expertise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All expertise</SelectItem>
                {expertiseOptions.map((exp) => (
                  <SelectItem key={exp} value={exp}>
                    {exp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.experience_min?.toString() || "any"}
              onValueChange={handleExperienceChange}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Any experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any experience</SelectItem>
                {experienceOptions.map((exp) => (
                  <SelectItem key={exp.value} value={exp.value}>
                    {exp.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="outline" onClick={onClearFilters} disabled={isLoading}>
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-500">Filters:</span>
            {searchInput && <Badge variant="secondary">Search: "{searchInput}"</Badge>}
            {filters.expertise && <Badge variant="secondary">Expertise: {filters.expertise}</Badge>}
            {filters.experience_min && <Badge variant="secondary">Experience: {filters.experience_min}+ years</Badge>}
          </div>
        )}
      </div>
    )
  }

  const Discover = () => {
    const [filters, setFilters] = useState<{
      page: number
      expertise?: string
      experience_min?: number
    }>({
      page: 1,
      expertise: undefined,
      experience_min: undefined,
    })

    const [searchQuery, setSearchQuery] = useState("")
    const [data, setData] = useState<MentorApiResponse | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const debouncedFetch = useCallback(
      debounce((searchParams: MentorSearchParams) => {
        fetchMentors(searchParams)
      }, 300),
      [],
    )

    const fetchMentors = async (customParams?: MentorSearchParams) => {
      setIsLoading(true)
      setError(null)
      try {
        const params: MentorSearchParams = customParams || {
          page: filters.page,
          expertise: filters.expertise,
          experience_min: filters.experience_min,
          search: searchQuery || undefined,
        }
        const result = await discoverMentorApi.getMentors(params)
        setData(result)
      } catch (err) {
        console.log(err,"this is the error")
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch mentors"
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    useEffect(() => {
      const searchParams: MentorSearchParams = {
        page: filters.page,
        expertise: filters.expertise,
        experience_min: filters.experience_min,
        search: searchQuery || undefined,
      }

      if (searchQuery) {
        debouncedFetch(searchParams)
      } else {
        fetchMentors(searchParams)
      }
    }, [filters, searchQuery])

    const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
    }

    const handleSearch = (query: string) => {
      setSearchQuery(query)
      setFilters((prev) => ({ ...prev, page: 1 }))
    }

    const handleClearFilters = () => {
      setFilters({ page: 1 })
      setSearchQuery("")
    }

    const handlePageChange = (page: number) => {
      setFilters((prev) => ({ ...prev, page }))
      window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const handleRefresh = () => {
      fetchMentors()
    }

    const totalMentors = data?.total || data?.count || 0
    const totalPages = Math.ceil(totalMentors / 10)
    const currentPage = filters.page
    const mentors = data?.mentors || data?.results || []

    const stats = [
      { icon: Users, label: "Active Mentors", value: totalMentors.toString(), color: "from-blue-500 to-blue-600" },
      {
        icon: MapPin,
        label: "Countries",
        value: `${new Set(mentors.map((m) => m.countries)).size || 20}+`,
        color: "from-indigo-500 to-indigo-600",
      },
      { icon: Star, label: "Avg Rating", value: "4.8", color: "from-purple-500 to-purple-600" },
    ]

    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar activeSection="Discover" />
          <main className="flex-1">
            {/* Clean Hero Section */}
            <div className="relative bg-white border-b">
              <div className="max-w-6xl mx-auto px-8 py-16">
                <div className="text-center max-w-3xl mx-auto">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
                    Discover Your Next Mentor
                  </h1>
                  <p className="text-lg leading-8 text-gray-600 mb-8">
                    Connect with experienced professionals who can help accelerate your career growth and provide valuable
                    insights.
                  </p>
                  <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>{totalMentors} mentors available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>4.8 average rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>Global network</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-8 py-12">
              {/* Search and Filters */}
              <MentorFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onSearch={handleSearch}
                onClearFilters={handleClearFilters}
                isLoading={isLoading}
              />

              {/* Enhanced Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {searchQuery ? "Search Results" : "Available Mentors"}
                  </h2>
                  {!isLoading && <p className="text-gray-600 mt-1">{totalMentors} mentors found</p>}
                </div>
                <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>

              {/* Enhanced Error State */}
              {error && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-8 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-red-100 rounded-xl">
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-red-900 text-lg mb-2">Unable to Load Mentors</h3>
                      <p className="text-red-700 mb-4">{error}</p>
                      <Button
                        variant="outline"
                        onClick={handleRefresh}
                        className="bg-white border-red-200 text-red-700 hover:bg-red-50"
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Loading State */}
              {isLoading && !data && (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                        <Loader2 className="h-8 w-8 animate-spin text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Finding Perfect Mentors</h3>
                    <p className="text-gray-600">Please wait while we search for the best matches...</p>
                  </div>
                </div>
              )}

              {/* Enhanced No Results State */}
              {!isLoading && !error && mentors.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Search className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No mentors found</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {searchQuery || filters.expertise || filters.experience_min
                      ? "Try adjusting your search criteria or filters to find more mentors"
                      : "No mentors are currently available in our network"}
                  </p>
                  {(searchQuery || filters.expertise || filters.experience_min) && (
                    <Button
                      variant="outline"
                      onClick={handleClearFilters}
                      className="bg-white border-gray-200 hover:bg-gray-50 rounded-xl shadow-sm px-6 py-3"
                    >
                      Clear all filters
                    </Button>
                  )}
                </div>
              )}

              {/* Enhanced Mentors Grid */}
              {!isLoading && !error && mentors.length > 0 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
                    {mentors.map((mentor) => (
                      <MentorCard
                        key={mentor.id}
                        mentor={{
                          ...mentor,
                          expertise: formatExpertise(mentor.expertise),
                        }}
                      />
                    ))}
                  </div>

                  {/* Enhanced Pagination */}
                  {data?.total > 0 && (
                    <div className="flex justify-center mt-12">
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-2">
                        <Pagination>
                          <PaginationContent>
                            {data.has_previous && data.previous_page && (
                              <PaginationItem>
                                <PaginationPrevious
                                  onClick={() => handlePageChange(data.previous_page!)}
                                  className="cursor-pointer hover:bg-blue-50 rounded-xl"
                                />
                              </PaginationItem>
                            )}
                            <PaginationItem>
                              <PaginationLink isActive className="cursor-default bg-blue-600 text-white rounded-xl">
                                Page {filters.page}
                              </PaginationLink>
                            </PaginationItem>
                            {data.has_next && data.next_page && (
                              <PaginationItem>
                                <PaginationNext
                                  onClick={() => handlePageChange(data.next_page!)}
                                  className="cursor-pointer hover:bg-blue-50 rounded-xl"
                                />
                              </PaginationItem>
                            )}
                          </PaginationContent>
                        </Pagination>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </SidebarProvider>
    )
  }

  function debounce<T extends (...args: any[]) => any>(func: T, delay: number): T {
    let timeoutId: NodeJS.Timeout
    return ((...args: Parameters<T>) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func(...args), delay)
    }) as T
  }

  export default Discover
