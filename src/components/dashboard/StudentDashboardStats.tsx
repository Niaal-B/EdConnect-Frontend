"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, ArrowRight } from "lucide-react"
import api from "@/lib/api"

interface DashboardStats {
  connected_mentors_count: number
  confirmed_sessions_count: number
}

const StudentDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.get("/students/dashboard/")
      setStats(response.data)
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    }
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">Unable to load stats</p>
          <Button onClick={fetchStats} variant="outline" className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Connected Mentors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Connected Mentors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.connected_mentors_count}</p>
            <Badge variant="secondary" className="mt-2">
              Network
            </Badge>
          </CardContent>
        </Card>

        {/* Confirmed Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              Confirmed Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.confirmed_sessions_count}</p>
            <Badge variant="secondary" className="mt-2">
              Scheduled
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      
    </div>
  )
}

export default StudentDashboardStats
