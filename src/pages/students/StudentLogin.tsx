import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import axios from 'axios';
import api from "@/lib/api";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '@/stores/authslice';
import { RootState } from '@/stores/store';
import { useAuthVerification } from "@/hooks/useAuthVerification";
import GoogleAuthButtons from '../../components/auth/AuthButtons.jsx';


// API function for student login
const loginStudent = async (data: {
  email: string;
  password: string;
}) => {
  try {
    const response = await api.post('/students/login/', data, {
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

const StudentLogin = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { checking, user } = useAuthVerification();

  useEffect(() => {
    if (!checking && isAuthenticated) {
      if(user.role==='mentor'){navigate("/mentor/dashboard");}
      else{navigate("/student/dashboard");}
    }
  }, [checking, isAuthenticated, navigate]);
  
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

  // Validate form for login
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
  const handleSubmit = async (e: React.FormEvent) => {
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
  
      const response = await loginStudent(payload);
      
      // Dispatch to Redux store
      dispatch(loginSuccess({
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
        role: response.user.role
      }));

      toast({
        title: "Login Successful",
        description: "Welcome to your learning journey!",
      });

      navigate("/student/dashboard");  
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
    <div className="container mx-auto flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-primary">
              Student Login
            </CardTitle>
            <CardDescription className="text-center">
              Welcome back! Continue your learning journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john.doe@student.edu"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Forgot password link */}
              <div className="text-right">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-primary hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              <GoogleAuthButtons/>
              Don't have an account? 
              <Link 
                to="/student/register" 
                className="text-primary hover:underline ml-1"
              >
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </Card>
        
        <div className="mt-6 text-center space-y-2">
          <div className="space-x-4 text-xs text-muted-foreground">
            <Link to="/mentor/register" className="hover:text-primary hover:underline">
              Are you a mentor?
            </Link>
            <span>•</span>
            <Link to="/help" className="hover:text-primary hover:underline">
              Need Help?
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            🎓 Connect with mentors • 📚 Access resources • 🌍 Study abroad guidance
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;