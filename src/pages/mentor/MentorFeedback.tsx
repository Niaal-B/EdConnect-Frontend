import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MentorDashboardLayout from "@/components/MentorDashboardLayout";
import { formatDistanceToNow } from "date-fns";
import api from "@/lib/api";

interface Feedback {
  id: string;
  student_name: string;
  student_profile_picture?: string;
  rating: number;
  comment: string;
  created_at: string;
  session_date: string;
}

interface FeedbackResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Feedback[];
}

const MentorFeedback: React.FC = () => {
  const [feedbackData, setFeedbackData] = useState<FeedbackResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedback = async (page: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/mentors/feedback/?page=${page}`);



      const data: FeedbackResponse = await response.data
      setFeedbackData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback(currentPage);
  }, [currentPage]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-muted-foreground"
        }`}
      />
    ));
  };

  const formatDateDistance = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Unknown date"; // fallback
    return formatDistanceToNow(date, { addSuffix: true });
  };
  
  const formatSessionDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Unknown date"; // fallback
    return date.toLocaleDateString();
  };
  

  const getAverageRating = () => {
    if (!feedbackData?.results.length) return "0.0";
    const total = feedbackData.results.reduce((sum, feedback) => sum + feedback.rating, 0);
    return (total / feedbackData.results.length).toFixed(1);
  };

  const totalPages = feedbackData ? Math.ceil(feedbackData.count / 10) : 0;

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <MentorDashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Student Feedback</h1>
          <p className="text-muted-foreground mt-2">
            View feedback and ratings from your mentoring sessions
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {loading ? <Skeleton className="h-8 w-16" /> : feedbackData?.count || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-foreground">
                  {loading ? <Skeleton className="h-8 w-16" /> : getAverageRating()}
                </div>
                <div className="flex">
                  {renderStars(Math.round(parseFloat(getAverageRating())))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {loading ? <Skeleton className="h-8 w-16" /> : 
                  feedbackData?.results.filter(f => 
                    new Date(f.created_at).getMonth() === new Date().getMonth()
                  ).length || 0
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error State */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-destructive font-medium">Error loading feedback</p>
                <p className="text-muted-foreground text-sm mt-1">{error}</p>
                <Button 
                  onClick={() => fetchFeedback(currentPage)} 
                  variant="outline" 
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && !error && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Feedback List */}
        {!loading && !error && feedbackData && (
          <>
            {feedbackData.results.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No feedback yet
                    </h3>
                    <p className="text-muted-foreground">
                      Once you complete mentoring sessions, student feedback will appear here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {feedbackData.results.map((feedback) => (
                  <Card key={feedback.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage 
                            src={feedback.student_details.profile_picture} 
                            alt={feedback.student_name}
                          />
                          <AvatarFallback>
                            {feedback.student_name}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-foreground">
                                {feedback.student_details.user.username}
                              </h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <div className="flex">
                                  {renderStars(feedback.rating)}
                                </div>
                                <Badge variant="secondary">{feedback.rating}/5</Badge>
                              </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">
                                  {formatDateDistance(feedback.created_at)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Session: {formatSessionDate(feedback.session_date)}
                                </p>
                            </div>
                          </div>
                          
                          {feedback.comment && (
                            <div className="mt-3 p-3 bg-muted rounded-md">
                              <p className="text-foreground text-sm leading-relaxed">
                                "{feedback.comment}"
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                {getPageNumbers().map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageClick(page)}
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </MentorDashboardLayout>
  );
};

export default MentorFeedback;