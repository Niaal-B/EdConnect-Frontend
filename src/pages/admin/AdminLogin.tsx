import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import axios from 'axios';
import api from "@/lib/api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Shield } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '@/stores/authslice';
import { RootState } from '@/stores/store';
import { useAuthVerification } from '../../hooks/useAuthVerification';

// API function for admin login
const loginAdmin = async (data: any) => {
  try {
    const response = await api.post('/admin/login/', data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    }
    throw error;
  }
};

const adminLoginSchema = z.object({
  email: z.string()
    .min(1, "Email is required.")
    .email("Please enter a valid email."),
  password: z.string()
    .min(1, "Password is required.")
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

const AdminLoginForm = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { checking } = useAuthVerification();

  useEffect(() => {
    if (!checking) {
      if (isAuthenticated && user?.role === "admin") {
        navigate("/admin/dashboard");
      }
    }
  }, [checking, isAuthenticated, user, navigate]);

  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  // Handle login submission
  const onSubmit = async (data: AdminLoginFormValues) => {
    try {
      setIsSubmitting(true);
      
      const payload = {
        email: data.email,
        password: data.password
      };
  
      const response = await loginAdmin(payload);
      
      // Dispatch to Redux store
      dispatch(loginSuccess({
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
        role: response.user.role
      }));

      toast({
        title: "Login Successful",
        description: "Welcome to Admin Dashboard!",
      });

      navigate("/admin/dashboard");  
    } catch (error) {
      let errorMessage = "Invalid email or password";
      
      if (error && typeof error === 'object') {
        if ('detail' in error) {
          errorMessage = (error as any).detail;
        } else if ('message' in error) {
          errorMessage = (error as any).message;
        } else if ('non_field_errors' in error) {
          const nonFieldErrors = (error as any).non_field_errors;
          if (Array.isArray(nonFieldErrors)) {
            errorMessage = nonFieldErrors.join(', ');
          }
        }
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <Card className="w-full shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mt-4">
              Admin Login
            </CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to access the admin dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Email field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-700">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="admin@example.com"
                          {...field}
                          className={`${fieldState.invalid ? "border-red-500 focus-visible:ring-red-500" : ""} h-11`}
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-red-600" />
                    </FormItem>
                  )}
                />

                {/* Password field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                          className={`${fieldState.invalid ? "border-red-500 focus-visible:ring-red-500" : ""} h-11`}
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-red-600" />
                    </FormItem>
                  )}
                />
               
                {/* Submit button */}
                <Button 
                  type="submit" 
                  className="w-full h-11 text-base font-medium"
                  disabled={isSubmitting}
                  size="lg"
                >
                  {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>
          </CardContent>
          
          <CardFooter className="px-6 py-4 bg-gray-50 rounded-b-lg">
            <div className="w-full text-center">
              <p className="text-xs text-gray-500">
                Secure admin access only. Unauthorized access is prohibited.
              </p>
            </div>
          </CardFooter>
        </Card>
        
        {/* Additional security notice */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact system administrator
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginForm;