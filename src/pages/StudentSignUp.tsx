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
  import { useSelector } from 'react-redux';
  import { RootState } from '@/stores/store';
  import { useAuthVerification } from '../hooks/useAuthVerification';

  // API function for student registration
  const registerStudent = async (data: {
    email: string;
    username: string;
    password: string;
    password2: string;
    role: string;
  }) => {
    try {
      const response = await api.post('/user/register/', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || error.message;
      }
      throw error;
    }
  };

  const StudentSignup = () => {
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
      username: "",
      email: "",
      password: "",
      password2: "",
    });

    // Error state
    const [errors, setErrors] = useState({
      username: "",
      email: "",
      password: "",
      password2: "",
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

    // Validate form for signup
    const validateForm = () => {
      const newErrors = {
        username: "",
        email: "",
        password: "",
        password2: "",
      };

      if (!formData.username.trim()) {
        newErrors.username = "Username is required.";
      } else if (formData.username.length < 2) {
        newErrors.username = "Username must be at least 2 characters.";
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email.";
      }

      if (!formData.password) {
        newErrors.password = "Password is required.";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters.";
      }

      if (!formData.password2) {
        newErrors.password2 = "Please confirm your password.";
      } else if (formData.password !== formData.password2) {
        newErrors.password2 = "Passwords do not match.";
      }

      setErrors(newErrors);
      return !Object.values(newErrors).some(error => error !== "");
    };

    // Handle signup submission
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!validateForm()) {
        return;
      }

      try {
        setIsSubmitting(true);
        
        const payload = {
          email: formData.email,
          username: formData.username,
          password: formData.password,
          password2: formData.password2,
          role: "student"
        };
    
        await registerStudent(payload);
    
        toast({
          title: "Email Sent",
          description: "A verification email has been sent to your account",
        });
    
        navigate("/check-email");
      } catch (error) {
        let errorMessage = "An unexpected error occurred during registration";
        
        if (error && typeof error === 'object') {
          if ('non_field_errors' in error) {
            const nonFieldErrors = (error as any).non_field_errors;
            if (Array.isArray(nonFieldErrors)) {
              if (nonFieldErrors.includes("Email already registered.")) {
                errorMessage = "This email is already registered. Please use a different email or login.";
              } else {
                errorMessage = nonFieldErrors.join(', ');
              }
            }
          }
          else if ('message' in error) {
            errorMessage = (error as any).message;
          }
          else if ('detail' in error) {
            errorMessage = (error as any).detail;
          }
        }
        
        toast({
          title: "Registration Failed",
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
                Join as Student
              </CardTitle>
              <CardDescription className="text-center">
                Start your educational journey and connect with experienced mentors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username field */}
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium">
                    Username
                  </label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={handleChange}
                    className={errors.username ? "border-red-500" : ""}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-500">{errors.username}</p>
                  )}
                </div>

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

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label htmlFor="password2" className="text-sm font-medium">
                    Confirm Password
                  </label>
                  <Input
                    id="password2"
                    name="password2"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.password2}
                    onChange={handleChange}
                    className={errors.password2 ? "border-red-500" : ""}
                  />
                  {errors.password2 && (
                    <p className="text-sm text-red-500">{errors.password2}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground">
                Already have an account? 
                <Link 
                  to="/student/login" 
                  className="text-primary hover:underline ml-1"
                >
                  Sign In
                </Link>
              </p>
            </CardFooter>
          </Card>
          
          {/* Additional links for students */}
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

  export default StudentSignup;