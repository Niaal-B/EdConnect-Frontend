import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import api from "@/lib/api";

export const VerifyEmail = () => {
  const { token } = useParams<{ token: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        console.log('Making verification request...');
        
        const response = await api.post(
          `/user/verify-email/${token}/`,
          {}, 
          {
            withCredentials: true
          }
        );
        
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (response.status === 201) {
          setIsSuccess(true);
          
          console.log('Cookies immediately after response:', document.cookie);
          setTimeout(() => {
            console.log('Cookies after 100ms delay:', document.cookie);
            const hasAccessToken = document.cookie.includes('access_token');
            const hasRefreshToken = document.cookie.includes('refresh_token');
            console.log('Access token stored:', hasAccessToken);
            console.log('Refresh token stored:', hasRefreshToken);
          }, 100);
          
          toast({
            title: "Email Verified",
            description: "Your email has been successfully verified!",
          });
          
          const role = response.data.role; 

        }
      } catch (error) {
        console.error('Verification error:', error);
        let errorMessage = "The verification link is invalid or has expired.";
        
        if (axios.isAxiosError(error)) {
          errorMessage = error.response?.data?.error || error.response?.data?.message || errorMessage;
        }
        
        toast({
          title: "Verification Failed",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token, toast, navigate]);

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <h1 className="text-2xl font-semibold">Verifying Email...</h1>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Please wait while we verify your email address.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${
            isSuccess ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {isSuccess ? (
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            ) : (
              <XCircle className="h-6 w-6 text-red-600" />
            )}
          </div>
          <h1 className="mt-3 text-2xl font-semibold">
            {isSuccess ? 'Email Verified!' : 'Verification Failed'}
          </h1>
        </CardHeader>
        
        <CardContent>
          <p className="text-muted-foreground">
            {isSuccess
              ? 'Your email address has been successfully verified and you are now logged in. Redirecting to dashboard...'
              : 'The verification link is invalid or has expired. Please request a new verification email.'}
          </p>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          {isSuccess ? (
            <Button onClick={() => navigate('/')} className="w-full">
              Go to Dashboard Now
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => navigate('/resend-verification')}
              className="w-full"
            >
              Request New Verification Email
            </Button>
          )}
          <div className="mt-4 text-sm">
            <Link to="/" className="font-medium text-primary hover:underline">
              Return to home page
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};