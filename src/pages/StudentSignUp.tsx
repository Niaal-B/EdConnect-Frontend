import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import axios from 'axios';
import api from "@/lib/api";
import { Loader2, GraduationCap, BookOpen, Globe, Sparkles, UserPlus } from "lucide-react";
import { useSelector } from 'react-redux';
import { RootState } from '@/stores/store';
import { useAuthVerification } from '../hooks/useAuthVerification';

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
    } else if (formData.username.length > 20) {
      newErrors.username = "Username cannot exceed 20 characters.";
    } else if (!/^[a-zA-Z]/.test(formData.username)) {
      newErrors.username = "Username must start with a letter.";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores.";
    }
  
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email.";
    } else if (formData.email.length > 50) {
      newErrors.email = "Email must be less than 50 characters.";
    }
  
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one lowercase letter.";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number.";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one special character.";
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
      const newErrors = {
        username: "",
        email: "",
        password: "",
        password2: "",
      };
      let hasFieldErrors = false;
    
      if (error && typeof error === "object") {
        // Handle field-specific errors from backend
        const fieldMapping: Record<string, keyof typeof newErrors> = {
          username: "username",
          email: "email",
          password: "password",
          password2: "password2"
        };

        Object.entries(error as Record<string, any>).forEach(([field, messages]) => {
          if (fieldMapping[field]) {
            hasFieldErrors = true;
            const errorArray = Array.isArray(messages) ? messages : [messages];
            newErrors[fieldMapping[field]] = errorArray.join(", ");
          }
        });

        // If we have field-specific errors, set them and don't show toast
        if (hasFieldErrors) {
          setErrors(newErrors);
          return; // Exit early, don't show toast
        }

        // Handle non-field errors
        if ("non_field_errors" in error) {
          const nonFieldErrors = (error as any).non_field_errors;
          if (Array.isArray(nonFieldErrors)) {
            errorMessage = nonFieldErrors.join(", ");
          }
        } 
        else if ("detail" in error) {
          errorMessage = (error as any).detail;
        } 
        else if ("message" in error) {
          errorMessage = (error as any).message;
        }
      }
    
      // Only show toast for non-field errors
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden flex">
      {/* Left Side - Animated Visual Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-bridgeblue-600 via-bridgeblue-500 to-bridgeblue-700 overflow-hidden">
        {/* Animated Mesh Gradient Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        </div>

        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white/20 rounded-3xl rotate-45 animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-32 right-24 w-24 h-24 border-2 border-white/15 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-2xl rotate-12 animate-float" style={{ animationDelay: '4s' }}></div>

        {/* Large Floating Icons */}
        <div className="absolute top-1/4 right-1/4 animate-float" style={{ animationDelay: '1s' }}>
          <UserPlus className="w-24 h-24 text-white/20" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 animate-float" style={{ animationDelay: '3s' }}>
          <GraduationCap className="w-20 h-20 text-white/15" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-start px-16 text-white">
          <Link to="/" className="mb-12 group">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-xl group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110 border border-white/30">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold">EdConnect</span>
            </div>
          </Link>
          
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Start Your Journey
          </h1>
          <p className="text-xl text-white/80 mb-8 leading-relaxed max-w-md">
            Join thousands of students connecting with expert mentors to achieve their study abroad dreams.
          </p>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-sm font-medium">
              🎓 Expert Guidance
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-sm font-medium">
              🌍 Global Network
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-sm font-medium">
              🚀 Fast Track
            </div>
          </div>
        </div>

        {/* Animated Gradient Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-light"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse-light" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 relative overflow-y-auto">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgb(59, 130, 246) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="w-full max-w-md relative z-10 my-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8 animate-in fade-in slide-in-from-top-8 duration-700">
            <Link to="/" className="inline-flex items-center space-x-3 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-bridgeblue-500 to-bridgeblue-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-bridgeblue-600 to-bridgeblue-700 bg-clip-text text-transparent">EdConnect</span>
            </Link>
          </div>

          {/* Glassmorphic Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-10 animate-in fade-in slide-in-from-right-8 duration-700 delay-150">
            {/* Decorative Top Accent */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-bridgeblue-500 to-transparent rounded-full"></div>
            
            <div className="space-y-1 mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Join as Student
              </h2>
              <p className="text-gray-600 text-base">
                Create your account and start learning
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username field */}
              <div className="space-y-2 group">
                <label htmlFor="username" className="text-sm font-semibold text-gray-700 block">
                  Username
                </label>
                <div className="relative">
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-bridgeblue-500/20 to-bridgeblue-600/20 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-300`}></div>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={handleChange}
                    className={`relative h-14 text-base transition-all duration-300 pl-5 pr-12 rounded-xl border-2 bg-white/50 backdrop-blur-sm ${
                      errors.username 
                        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 shadow-lg shadow-red-100/50" 
                        : "border-gray-200 focus:border-bridgeblue-500 focus:ring-4 focus:ring-bridgeblue-500/10 hover:border-bridgeblue-300 hover:shadow-md hover:shadow-bridgeblue-100/50"
                    }`}
                  />
                  {formData.username && !errors.username && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                    </div>
                  )}
                </div>
                {errors.username && (
                  <p className="text-sm text-red-600 font-medium flex items-center gap-2 mt-1.5 animate-in fade-in slide-in-from-top-1">
                    <span className="text-red-500 text-xs">●</span>
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Email field */}
              <div className="space-y-2 group">
                <label htmlFor="email" className="text-sm font-semibold text-gray-700 block">
                  Email Address
                </label>
                <div className="relative">
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-bridgeblue-500/20 to-bridgeblue-600/20 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-300`}></div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@student.edu"
                    value={formData.email}
                    onChange={handleChange}
                    className={`relative h-14 text-base transition-all duration-300 pl-5 pr-12 rounded-xl border-2 bg-white/50 backdrop-blur-sm ${
                      errors.email 
                        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 shadow-lg shadow-red-100/50" 
                        : "border-gray-200 focus:border-bridgeblue-500 focus:ring-4 focus:ring-bridgeblue-500/10 hover:border-bridgeblue-300 hover:shadow-md hover:shadow-bridgeblue-100/50"
                    }`}
                  />
                  {formData.email && !errors.email && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                    </div>
                  )}
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 font-medium flex items-center gap-2 mt-1.5 animate-in fade-in slide-in-from-top-1">
                    <span className="text-red-500 text-xs">●</span>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password field */}
              <div className="space-y-2 group">
                <label htmlFor="password" className="text-sm font-semibold text-gray-700 block">
                  Password
                </label>
                <div className="relative">
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-bridgeblue-500/20 to-bridgeblue-600/20 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-300`}></div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`relative h-14 text-base transition-all duration-300 pl-5 pr-12 rounded-xl border-2 bg-white/50 backdrop-blur-sm ${
                      errors.password 
                        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 shadow-lg shadow-red-100/50" 
                        : "border-gray-200 focus:border-bridgeblue-500 focus:ring-4 focus:ring-bridgeblue-500/10 hover:border-bridgeblue-300 hover:shadow-md hover:shadow-bridgeblue-100/50"
                    }`}
                  />
                  {formData.password && !errors.password && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                    </div>
                  )}
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 font-medium flex items-center gap-2 mt-1.5 animate-in fade-in slide-in-from-top-1">
                    <span className="text-red-500 text-xs">●</span>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2 group">
                <label htmlFor="password2" className="text-sm font-semibold text-gray-700 block">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-bridgeblue-500/20 to-bridgeblue-600/20 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-300`}></div>
                  <Input
                    id="password2"
                    name="password2"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.password2}
                    onChange={handleChange}
                    className={`relative h-14 text-base transition-all duration-300 pl-5 pr-12 rounded-xl border-2 bg-white/50 backdrop-blur-sm ${
                      errors.password2 
                        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 shadow-lg shadow-red-100/50" 
                        : "border-gray-200 focus:border-bridgeblue-500 focus:ring-4 focus:ring-bridgeblue-500/10 hover:border-bridgeblue-300 hover:shadow-md hover:shadow-bridgeblue-100/50"
                    }`}
                  />
                  {formData.password2 && !errors.password2 && formData.password === formData.password2 && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                    </div>
                  )}
                </div>
                {errors.password2 && (
                  <p className="text-sm text-red-600 font-medium flex items-center gap-2 mt-1.5 animate-in fade-in slide-in-from-top-1">
                    <span className="text-red-500 text-xs">●</span>
                    {errors.password2}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 text-base font-semibold bg-gradient-to-r from-bridgeblue-500 via-bridgeblue-600 to-bridgeblue-500 hover:from-bridgeblue-600 hover:via-bridgeblue-700 hover:to-bridgeblue-600 text-white shadow-xl shadow-bridgeblue-500/30 hover:shadow-2xl hover:shadow-bridgeblue-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 rounded-xl relative overflow-hidden group mt-2"
                disabled={isSubmitting}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="text-center pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link 
                  to="/student/login" 
                  className="font-semibold text-bridgeblue-600 hover:text-bridgeblue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-bridgeblue-500 focus:ring-offset-2 rounded px-1"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
          
          {/* Additional Links - Mobile Only */}
          <div className="lg:hidden mt-6 text-center">
            <div className="flex items-center justify-center gap-4 text-xs sm:text-sm text-gray-600">
              <Link to="/mentor/register" className="hover:text-bridgeblue-600 transition-colors duration-200 font-medium">
                Are you a mentor?
              </Link>
              <span className="text-gray-400">•</span>
              <Link to="/help" className="hover:text-bridgeblue-600 transition-colors duration-200 font-medium">
                Need Help?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSignup;