import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Loader2, UserCog, Award, UserPlus } from "lucide-react";
import { useSelector } from 'react-redux';
import { RootState } from '@/stores/store';
import { useAuthVerification } from '../hooks/useAuthVerification';

// API function for mentor registration
const registerMentor = async (data: any) => {
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

const mentorSignupSchema = z.object({
  username: z.string()
    .min(2, "Username must be at least 2 characters.")
    .max(20, "Username cannot exceed 20 characters.")
    .regex(/^[a-zA-Z]/, "Username must start with a letter.")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores."),
  email: z.string()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
  password: z.string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character."),
  password2: z.string()
    .min(1, "Please confirm your password.")
}).refine((data) => data.password === data.password2, {
  message: "Passwords do not match.",
  path: ["password2"],
});

type MentorSignupFormValues = z.infer<typeof mentorSignupSchema>;

const MentorSignup = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { checking, user } = useAuthVerification();

  useEffect(() => {
    if (!checking && isAuthenticated) {
      if (user.role === 'mentor') { navigate("/mentor/dashboard"); }
      else { navigate("/student/dashboard"); }
    }
  }, [checking, isAuthenticated, navigate]);

  const form = useForm<MentorSignupFormValues>({
    resolver: zodResolver(mentorSignupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      password2: "",
    },
    mode: "onChange",
  });

  // Handle signup submission
  const onSubmit = async (data: MentorSignupFormValues) => {
    try {
      setIsSubmitting(true);

      const payload = {
        email: data.email,
        username: data.username,
        password: data.password,
        password2: data.password2,
        role: "mentor"
      };

      await registerMentor(payload);

      toast({
        title: "Email Sent",
        description: "A verification email has been sent to your account",
      });

      navigate("/check-email");
    } catch (error) {
      let errorMessage = "An unexpected error occurred during registration";
      let hasFieldErrors = false;

      if (error && typeof error === "object") {
        const fieldMapping: Record<string, keyof MentorSignupFormValues> = {
          username: "username",
          email: "email",
          password: "password",
          password2: "password2"
        };

        Object.entries(error as Record<string, any>).forEach(([field, messages]) => {
          if (fieldMapping[field]) {
            hasFieldErrors = true;
            const errorArray = Array.isArray(messages) ? messages : [messages];
            form.setError(fieldMapping[field], { type: "server", message: errorArray.join(", ") });
          }
        });

        if (hasFieldErrors) return;

        if ('non_field_errors' in error) {
          const nonFieldErrors = (error as any).non_field_errors;
          if (Array.isArray(nonFieldErrors)) {
            errorMessage = nonFieldErrors.join(', ');
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
    <div className="min-h-screen bg-gray-50 relative overflow-hidden flex">
      {/* Left Side - Animated Visual Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-bridgeblue-600 via-bridgeblue-500 to-bridgeblue-700 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        </div>

        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white/20 rounded-3xl rotate-45 animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-32 right-24 w-24 h-24 border-2 border-white/15 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-2xl rotate-12 animate-float" style={{ animationDelay: '4s' }}></div>

        <div className="absolute top-1/4 right-1/4 animate-float" style={{ animationDelay: '1s' }}>
          <UserPlus className="w-24 h-24 text-white/20" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 animate-float" style={{ animationDelay: '3s' }}>
          <Award className="w-20 h-20 text-white/15" />
        </div>

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
            Become a Mentor
          </h1>
          <p className="text-xl text-white/80 mb-8 leading-relaxed max-w-md">
            Share your expertise and help students achieve their dreams of studying abroad.
          </p>

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

        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-light"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse-light" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 relative overflow-y-auto">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgb(59, 130, 246) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="w-full max-w-md relative z-10 my-8">
          <div className="lg:hidden text-center mb-8 animate-in fade-in slide-in-from-top-8 duration-700">
            <Link to="/" className="inline-flex items-center space-x-3 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-bridgeblue-500 to-bridgeblue-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <UserCog className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-bridgeblue-600 to-bridgeblue-700 bg-clip-text text-transparent">EdConnect</span>
            </Link>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-10 animate-in fade-in slide-in-from-right-8 duration-700 delay-150">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-bridgeblue-500 to-transparent rounded-full"></div>

            <div className="space-y-1 mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Become a Mentor
              </h2>
              <p className="text-gray-600 text-base">
                Create your mentor account and start helping students
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-2 group">
                      <FormLabel className="text-sm font-semibold text-gray-700 block">Username</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-bridgeblue-500/20 to-bridgeblue-600/20 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-300`}></div>
                          <Input
                            placeholder="johndoe"
                            {...field}
                            className={`relative h-14 text-base transition-all duration-300 pl-5 pr-12 rounded-xl border-2 bg-white/50 backdrop-blur-sm ${fieldState.invalid
                                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 shadow-lg shadow-red-100/50"
                                : "border-gray-200 focus:border-bridgeblue-500 focus:ring-4 focus:ring-bridgeblue-500/10 hover:border-bridgeblue-300 hover:shadow-md hover:shadow-bridgeblue-100/50"
                              }`}
                          />
                          {field.value && !fieldState.invalid && (
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage className="text-sm text-red-600 font-medium flex items-center gap-2 mt-1.5 animate-in fade-in slide-in-from-top-1">
                        <span className="text-red-500 text-xs">●</span>
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-2 group">
                      <FormLabel className="text-sm font-semibold text-gray-700 block">Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-bridgeblue-500/20 to-bridgeblue-600/20 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-300`}></div>
                          <Input
                            type="email"
                            placeholder="john.doe@example.com"
                            {...field}
                            className={`relative h-14 text-base transition-all duration-300 pl-5 pr-12 rounded-xl border-2 bg-white/50 backdrop-blur-sm ${fieldState.invalid
                                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 shadow-lg shadow-red-100/50"
                                : "border-gray-200 focus:border-bridgeblue-500 focus:ring-4 focus:ring-bridgeblue-500/10 hover:border-bridgeblue-300 hover:shadow-md hover:shadow-bridgeblue-100/50"
                              }`}
                          />
                          {field.value && !fieldState.invalid && (
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage className="text-sm text-red-600 font-medium flex items-center gap-2 mt-1.5 animate-in fade-in slide-in-from-top-1">
                        <span className="text-red-500 text-xs">●</span>
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-2 group">
                      <FormLabel className="text-sm font-semibold text-gray-700 block">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-bridgeblue-500/20 to-bridgeblue-600/20 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-300`}></div>
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            {...field}
                            className={`relative h-14 text-base transition-all duration-300 pl-5 pr-12 rounded-xl border-2 bg-white/50 backdrop-blur-sm ${fieldState.invalid
                                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 shadow-lg shadow-red-100/50"
                                : "border-gray-200 focus:border-bridgeblue-500 focus:ring-4 focus:ring-bridgeblue-500/10 hover:border-bridgeblue-300 hover:shadow-md hover:shadow-bridgeblue-100/50"
                              }`}
                          />
                          {field.value && !fieldState.invalid && (
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage className="text-sm text-red-600 font-medium flex items-center gap-2 mt-1.5 animate-in fade-in slide-in-from-top-1">
                        <span className="text-red-500 text-xs">●</span>
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password2"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-2 group">
                      <FormLabel className="text-sm font-semibold text-gray-700 block">Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-bridgeblue-500/20 to-bridgeblue-600/20 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-300`}></div>
                          <Input
                            type="password"
                            placeholder="Confirm your password"
                            {...field}
                            className={`relative h-14 text-base transition-all duration-300 pl-5 pr-12 rounded-xl border-2 bg-white/50 backdrop-blur-sm ${fieldState.invalid
                                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 shadow-lg shadow-red-100/50"
                                : "border-gray-200 focus:border-bridgeblue-500 focus:ring-4 focus:ring-bridgeblue-500/10 hover:border-bridgeblue-300 hover:shadow-md hover:shadow-bridgeblue-100/50"
                              }`}
                          />
                          {field.value && !fieldState.invalid && form.watch('password') === field.value && (
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage className="text-sm text-red-600 font-medium flex items-center gap-2 mt-1.5 animate-in fade-in slide-in-from-top-1">
                        <span className="text-red-500 text-xs">●</span>
                      </FormMessage>
                    </FormItem>
                  )}
                />

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
            </Form>

            <div className="text-center pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/mentor/login"
                  className="font-semibold text-bridgeblue-600 hover:text-bridgeblue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-bridgeblue-500 focus:ring-offset-2 rounded px-1"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorSignup;