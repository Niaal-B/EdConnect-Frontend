import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import axios from 'axios';
import api from "@/lib/api";
import { Loader2, Shield } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '@/stores/authslice';
import { RootState } from '@/stores/store';
import { useEffect } from "react";
import { useAuthVerification } from '../../hooks/useAuthVerification';

// API function for admin login
const loginAdmin = async (data: {
  email: string;
  password: string;
}) => {
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

const AdminLoginForm = () => {
  const dispatch = useDispatch();
  const { isAuthenticated,user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const checkingSession = useAuthVerification();

  useEffect(() => {
    if (!checkingSession) {
      if (isAuthenticated && user.role=="admin" ) {
        navigate("/admin/dashboard");
      }
    }
  }, [checkingSession, isAuthenticated, navigate]);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Error state
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  // Handle login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      const payload = {
        email: formData.email,
        password: formData.password
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
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${errors.email ? "border-red-500 focus:border-red-500" : ""} h-11`}
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`${errors.password ? "border-red-500 focus:border-red-500" : ""} h-11`}
                  required
                />
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Forgot password link */}
              <div className="text-right">
                <Link 
                  to="/admin/forgot-password" 
                  className="text-sm text-primary hover:text-primary/80 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>

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