import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { MailCheck } from "lucide-react"; // Import an appropriate icon
import { Button } from "@/components/ui/button";

export const CheckEmail = () => {
  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <MailCheck className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="mt-3 text-2xl font-semibold">Check Your Email</h1>
        </CardHeader>
        
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            We've sent a verification link to your email address.
          </p>
          <p className="mt-2 text-muted-foreground">
            Please click the link in the email to complete your registration.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <div className="text-sm text-muted-foreground">
            Didn't receive the email?{" "}
            <Button variant="link" className="h-auto p-0 text-sm">
              Resend verification email
            </Button>
          </div>
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