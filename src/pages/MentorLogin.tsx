import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import axios from 'axios';
import api from "@/lib/api";
import { Loader2, UserCog, Award, Sparkles, TrendingUp } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '@/stores/authslice';
import { RootState } from '@/stores/store';
import { useAuthVerification } from '../hooks/useAuthVerification';
import GoogleAuthButtons from '../components/auth/AuthButtons.jsx';

// API function for login
const loginMentor = async (data: {
  email: string;
  password: string;
}) => {
  try {
    const response = await api.post('/mentors/login/', data, {
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

const MentorLogin = () => {
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
  
      const response = await loginMentor(payload);
      
      dispatch(loginSuccess({
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
        role: response.user.role,
      }));
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });

      navigate("/mentor/dashboard");  
    } catch (error) {
      let errorMessage = "Invalid email or password";
      
      if (error && typeof error === 'object') {
        if ('detail' in error) {
          errorMessage = (error as any).detail;
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
    <div className="min-h-screen bg-gradient-to-br from-bridgeblue-50 via-white to-lightgray-100 relative overflow-hidden flex">
      {/* Mobile Background - Enhanced for Mobile */}
      <div className="lg:hidden absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs for mobile */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-bridgeblue-200/40 rounded-full blur-3xl animate-pulse-light"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-bridgeblue-300/30 rounded-full blur-3xl animate-pulse-light" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-bridgeblue-100/25 rounded-full blur-3xl animate-pulse-light" style={{ animationDelay: '3s' }}></div>
        
        {/* Floating icons for mobile */}
        <div className="absolute top-16 right-8 animate-float" style={{ animationDelay: '0s' }}>
          <UserCog className="w-10 h-10 text-bridgeblue-400/25" />
        </div>
        <div className="absolute top-32 left-6 animate-float" style={{ animationDelay: '2s' }}>
          <Award className="w-8 h-8 text-bridgeblue-300/25" />
        </div>
        <div className="absolute bottom-24 right-12 animate-float" style={{ animationDelay: '4s' }}>
          <TrendingUp className="w-9 h-9 text-bridgeblue-400/20" />
        </div>
        <div className="absolute bottom-40 left-8 animate-float" style={{ animationDelay: '1s' }}>
          <Sparkles className="w-7 h-7 text-bridgeblue-500/25" />
        </div>
      </div>

      {/* Left Side - Animated Visual Section (Desktop Only) */}
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
          <UserCog className="w-24 h-24 text-white/20" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 animate-float" style={{ animationDelay: '3s' }}>
          <Award className="w-20 h-20 text-white/15" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-start px-16 text-white">
          <Link to="/" className="mb-12 group">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-xl group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110 border border-white/30">
                <UserCog className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold">EdConnect</span>
            </div>
          </Link>
          
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Welcome Back,<br />
            <span className="text-white/90">Mentor!</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 leading-relaxed max-w-md">
            Share your expertise and help students achieve their dreams of studying abroad.
          </p>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-sm font-medium">
              💼 Share Expertise
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-sm font-medium">
              💰 Earn Income
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-sm font-medium">
              🌟 Make Impact
            </div>
          </div>
        </div>

        {/* Animated Gradient Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-light"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse-light" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12 relative min-h-screen lg:min-h-0">
        {/* Subtle Background Pattern - Enhanced for Mobile */}
        <div className="absolute inset-0 opacity-[0.03] lg:opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgb(59, 130, 246) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="w-full max-w-md relative z-10 py-6 lg:py-0">
          {/* Mobile Logo - Enhanced */}
          <div className="lg:hidden text-center mb-6 animate-in fade-in slide-in-from-top-8 duration-700">
            <Link to="/" className="inline-flex flex-col items-center space-y-3 group">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-bridgeblue-500 via-bridgeblue-600 to-bridgeblue-700 flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-300 group-hover:scale-110 border-2 border-white/30 animate-float">
                  <UserCog className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -inset-1 bg-bridgeblue-500/20 rounded-2xl blur-xl animate-pulse-light"></div>
              </div>
              <div className="text-center">
                <span className="text-3xl font-bold bg-gradient-to-r from-bridgeblue-600 via-bridgeblue-700 to-bridgeblue-600 bg-clip-text text-transparent block">EdConnect</span>
                <p className="text-sm text-gray-600 mt-1">Mentorship Without Borders</p>
              </div>
            </Link>
          </div>

          {/* Glassmorphic Card - Enhanced for Mobile */}
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 p-6 sm:p-8 lg:p-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 relative overflow-hidden">
            {/* Mobile-specific decorative background */}
            <div className="lg:hidden absolute top-0 right-0 w-32 h-32 bg-bridgeblue-100/20 rounded-full blur-2xl -mr-16 -mt-16"></div>
            <div className="lg:hidden absolute bottom-0 left-0 w-40 h-40 bg-bridgeblue-200/15 rounded-full blur-2xl -ml-20 -mb-20"></div>
            
            {/* Decorative Top Accent */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-bridgeblue-500 to-transparent rounded-full"></div>
            
            <div className="space-y-2 mb-8 relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Mentor Login
              </h2>
              <p className="text-gray-600 text-base sm:text-lg">
                Sign in to continue mentoring students
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {/* Email field */}
              <div className="space-y-2.5 group">
                <label htmlFor="email" className="text-sm font-semibold text-gray-700 block">
                  Email Address
                </label>
                <div className="relative">
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-bridgeblue-500/25 to-bridgeblue-600/25 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-300`}></div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`relative h-14 sm:h-16 text-base sm:text-lg transition-all duration-300 pl-5 pr-12 rounded-xl border-2 bg-white/70 backdrop-blur-md ${
                      errors.email 
                        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 shadow-lg shadow-red-100/50" 
                        : "border-gray-200 focus:border-bridgeblue-500 focus:ring-4 focus:ring-bridgeblue-500/15 hover:border-bridgeblue-300 hover:shadow-lg hover:shadow-bridgeblue-100/50"
                    }`}
                  />
                  {formData.email && !errors.email && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
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
              <div className="space-y-2.5 group">
                <label htmlFor="password" className="text-sm font-semibold text-gray-700 block">
                  Password
                </label>
                <div className="relative">
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-bridgeblue-500/25 to-bridgeblue-600/25 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-300`}></div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`relative h-14 sm:h-16 text-base sm:text-lg transition-all duration-300 pl-5 pr-12 rounded-xl border-2 bg-white/70 backdrop-blur-md ${
                      errors.password 
                        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 shadow-lg shadow-red-100/50" 
                        : "border-gray-200 focus:border-bridgeblue-500 focus:ring-4 focus:ring-bridgeblue-500/15 hover:border-bridgeblue-300 hover:shadow-lg hover:shadow-bridgeblue-100/50"
                    }`}
                  />
                  {formData.password && !errors.password && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
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

              {/* Forgot password link */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 gap-3 sm:gap-0">
                <div className="flex items-center">
                  <input type="checkbox" id="remember" className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 text-bridgeblue-600 focus:ring-bridgeblue-500" />
                  <label htmlFor="remember" className="ml-2 text-sm sm:text-base text-gray-600">Remember me</label>
                </div>
                <Link 
                  to="/forgot-password" 
                  className="text-sm sm:text-base font-medium text-bridgeblue-600 hover:text-bridgeblue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-bridgeblue-500 focus:ring-offset-2 rounded px-1"
                >
                  Forgot password?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 sm:h-16 text-base sm:text-lg font-semibold bg-gradient-to-r from-bridgeblue-500 via-bridgeblue-600 to-bridgeblue-500 hover:from-bridgeblue-600 hover:via-bridgeblue-700 hover:to-bridgeblue-600 text-white shadow-xl shadow-bridgeblue-500/30 hover:shadow-2xl hover:shadow-bridgeblue-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 rounded-xl relative overflow-hidden group mt-1"
                disabled={isSubmitting}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isSubmitting && <Loader2 className="mr-2 h-5 w-5 sm:h-6 sm:w-6 animate-spin" />}
                  {isSubmitting ? "Logging in..." : "Login"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Auth */}
            <div className="mb-6">
              <GoogleAuthButtons currentPage="mentor" />
            </div>

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link 
                  to="/mentor/register" 
                  className="font-semibold text-bridgeblue-600 hover:text-bridgeblue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-bridgeblue-500 focus:ring-offset-2 rounded px-1"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorLogin;