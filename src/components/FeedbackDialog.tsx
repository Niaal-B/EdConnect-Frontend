import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Star, MessageSquare, Send, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface FeedbackDialogProps {
  bookingId: string;
  mentorName: string;
  children: React.ReactNode;
  onFeedbackSubmitted?: () => void;
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
  bookingId,
  mentorName,
  children,
  onFeedbackSubmitted
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const { toast } = useToast();

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating: number) => {
    setHoveredStar(starRating);
  };

  const handleStarLeave = () => {
    setHoveredStar(0);
  };

  const resetForm = () => {
    setRating(0);
    setComment('');
    setHoveredStar(0);
  };

  const handleSubmit = async () => {
    
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting your feedback.",
        variant: "destructive",
      });
      return;
    }

    if (comment.trim().length === 0) {
      toast({
        title: "Comment Required",
        description: "Please write a comment about your session experience.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post('/bookings/feedback/submit/', {
        booking: bookingId,
        rating: rating,
        comment: comment.trim()
      });

      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback! Your review helps improve the mentorship experience.",
        variant: "default",
      });

      // Reset form and close dialog
      resetForm();
      setIsOpen(false);
      
      // Call callback if provided to refresh parent component data
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted();
      }

    } catch (error) {
      console.error('Error submitting feedback:', error);
      
      let errorMessage = "An unexpected error occurred while submitting your feedback.";
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid feedback data. Please check your rating and comment.";
      } else if (error.response?.status === 404) {
        errorMessage = "Session not found. Please refresh the page and try again.";
      } else if (error.response?.status === 401) {
        errorMessage = "You are not authorized to submit feedback for this session.";
      }

      toast({
        title: "Feedback Submission Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    setIsOpen(false);
  };

  const getRatingText = (rating: number): string => {
    switch (rating) {
      case 1: return "Poor";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Very Good";
      case 5: return "Excellent";
      default: return "";
    }
  };

  const displayRating = hoveredStar > 0 ? hoveredStar : rating;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <span>Share Your Feedback</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Mentor Info */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">How was your session with</p>
            <p className="font-semibold text-gray-900">{mentorName}?</p>
          </div>

          {/* Star Rating */}
          <div className="space-y-3">
            <div className="block text-sm font-medium text-gray-700">
              Rating *
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => handleStarHover(star)}
                    onMouseLeave={handleStarLeave}
                    disabled={isSubmitting}
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${
                        star <= displayRating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300 hover:text-yellow-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {displayRating > 0 && (
                <p className="text-sm font-medium text-gray-700">
                  {getRatingText(displayRating)} ({displayRating}/5)
                </p>
              )}
            </div>
          </div>

          {/* Comment Text Area */}
          <div className="space-y-2">
            <div className="block text-sm font-medium text-gray-700">
              Your Comments *
            </div>
            <Textarea
              placeholder="Share your experience with this mentor session. What went well? What could be improved?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isSubmitting}
              className="min-h-[100px] resize-none"
              maxLength={1000}
            />
            <p className="text-xs text-gray-500 text-right">
              {comment.length}/1000 characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0 || comment.trim().length === 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Feedback
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;