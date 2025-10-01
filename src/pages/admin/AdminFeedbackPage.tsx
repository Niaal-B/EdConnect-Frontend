import React, { useEffect, useState } from 'react';
import { 
  MessageSquare, 
  Star, 
  Calendar, 
  User,
  Filter,
  Search,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import api from '@/lib/api';
// Import these from your project:
// import { useAuthVerification } from '../../hooks/useAuthVerification';
// import { RootState } from '@/stores/store';
// import { useSelector } from 'react-redux';
// import { useNavigate } from "react-router-dom";

interface FeedbackItem {
  id: number;
  booking_id: string;
  rating: number;
  comment: string;
  submitted_at: string;
  booked_start_time: string;
  booked_end_time: string;
  mentor_details: {
    id: number;
    user: {
      id: number;
      username: string;
      email: string;
    };
    profile_picture: string;
    bio: string;
    expertise: string[];
    experience_years: number;
  };
  student_details: {
    id: number;
    user: {
      id: number;
      username: string;
      email: string;
    };
    education_level: string;
    profile_picture: string;
  };
}

const AdminFeedbackPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [feedbackData, setFeedbackData] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await api.get('http://localhost/api/admin/feedback/mentors/');
      console.log(response)
      setFeedbackData(response.data.results || []);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const isActive = (path: string) => {
    return window.location.pathname === path;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingBgColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-50';
    if (rating >= 3) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredFeedback = feedbackData.filter(feedback => {
    const matchesRating = filterRating === null || feedback.rating === filterRating;
    const matchesSearch = searchQuery === '' || 
      feedback.mentor_details.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.student_details.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.comment.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRating && matchesSearch;
  });

  const averageRating = feedbackData.length > 0
    ? (feedbackData.reduce((sum, f) => sum + f.rating, 0) / feedbackData.length).toFixed(1)
    : '0.0';

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: feedbackData.filter(f => f.rating === rating).length,
    percentage: feedbackData.length > 0 
      ? ((feedbackData.filter(f => f.rating === rating).length / feedbackData.length) * 100).toFixed(0)
      : '0'
  }));

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} isActive={isActive} />
      
      <div className="flex-1">
        <AdminHeader setSidebarOpen={setSidebarOpen} />
        
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Mentor Feedback</h1>
            <div className="text-sm text-gray-500 flex items-center mt-1">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>Review and manage mentor feedback</span>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Feedback</CardTitle>
                <MessageSquare className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{feedbackData.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageRating}</div>
                <div className="flex items-center mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.round(parseFloat(averageRating))
                          ? 'fill-yellow-500 text-yellow-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">5-Star Reviews</CardTitle>
                <Star className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {feedbackData.filter(f => f.rating === 5).length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Low Ratings</CardTitle>
                <Star className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {feedbackData.filter(f => f.rating <= 2).length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by mentor, student, or comment..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filterRating === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterRating(null)}
                  >
                    All
                  </Button>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <Button
                      key={rating}
                      variant={filterRating === rating ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterRating(rating)}
                    >
                      {rating}★
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rating Distribution */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-4">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-yellow-500 h-3 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">{count}</span>
                    <span className="text-sm text-gray-500 w-12 text-right">{percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Feedback List */}
          <div className="space-y-4">
            {loading ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-gray-500">Loading feedback...</div>
                </CardContent>
              </Card>
            ) : filteredFeedback.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="text-gray-500">No feedback found</div>
                </CardContent>
              </Card>
            ) : (
              filteredFeedback.map((feedback) => (
                <Card key={feedback.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Left: Mentor & Student Info */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={feedback.mentor_details.profile_picture} />
                            <AvatarFallback>{feedback.mentor_details.user.username[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {feedback.mentor_details.user.username}
                            </div>
                            <div className="text-sm text-gray-500">Mentor</div>
                            <div className="text-xs text-gray-400">{feedback.mentor_details.user.email}</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 pl-4 border-l-2 border-gray-200">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={feedback.student_details.profile_picture} />
                            <AvatarFallback>{feedback.student_details.user.username[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">
                              {feedback.student_details.user.username}
                            </div>
                            <div className="text-sm text-gray-500">Student</div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Feedback Details */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getRatingBgColor(feedback.rating)}`}>
                            <Star className={`h-5 w-5 fill-current ${getRatingColor(feedback.rating)}`} />
                            <span className={`font-bold ${getRatingColor(feedback.rating)}`}>
                              {feedback.rating}.0
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 text-right">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(feedback.submitted_at)}
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="text-sm font-medium text-gray-700 mb-2">Feedback:</div>
                          <p className="text-gray-900">{feedback.comment}</p>
                        </div>

                        <div className="text-xs text-gray-500">
                          <div>Session: {formatDate(feedback.booked_start_time)} - {new Date(feedback.booked_end_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                          <div className="text-gray-400">Booking ID: {feedback.booking_id}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminFeedbackPage;