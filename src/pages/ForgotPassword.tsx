import React, { useState, useEffect } from 'react';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import api from '@/lib/api';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

const forgotPasswordSchema = z.object({
  email: z.string()
    .min(1, "Please enter a valid email address")
    .email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage: React.FC = () => {
  const [countdown, setCountdown] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const { formState, getValues, reset } = form;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setApiError(null);
    setIsSubmitting(true);

    try {
      const response = await api.post('/auth/forgot-password/', {
        email: data.email,
      });

      setIsSuccess(true);
      setCountdown(60);
    } catch (error) {
      let errorMessage = 'Something went wrong. Please try again.';

      if (axios.isAxiosError(error)) {
        if (error.response?.data?.email) {
          errorMessage = error.response.data.email[0];
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (typeof error.response?.data === 'string') {
          errorMessage = error.response.data;
        }
      }

      setApiError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = () => {
    if (countdown === 0) {
      setIsSuccess(false);
      setCountdown(60);
    }
  };

  const resetForm = () => {
    reset({ email: '' });
    setIsSuccess(false);
    setApiError(null);
    setCountdown(0);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Login
          </button>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Forgot Password?
            </h1>
            <p className="text-gray-600 leading-relaxed">
              No worries! Enter your email address and we'll send you a reset link.
            </p>
          </div>
        </div>

        {isSuccess ? (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200 shadow-sm">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Check Your Email
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We've sent a password reset link to{' '}
                <span className="font-medium text-blue-600">{getValues().email}</span>
              </p>

              <div className="space-y-4">
                <button
                  onClick={handleResend}
                  disabled={countdown > 0}
                  className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                    countdown > 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]'
                  }`}
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Email'}
                </button>

                <button
                  onClick={resetForm}
                  className="w-full py-3 px-4 rounded-xl font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all duration-200 active:scale-[0.98]"
                >
                  Try Different Email
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200 shadow-sm">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => {
                    const hasError = !!fieldState.error || !!apiError;
                    const errorMessage = fieldState.error?.message || apiError;
                    const isValid = fieldState.isDirty && !fieldState.invalid && !apiError;

                    return (
                      <FormItem className="space-y-2">
                        <FormLabel className="block text-sm font-medium text-gray-700">Email Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <input
                              {...field}
                              type="email"
                              placeholder="Enter your email address"
                              className={`w-full px-4 py-3 pl-12 rounded-xl border-2 transition-all duration-200 bg-white placeholder-gray-400 ${
                                hasError
                                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                  : 'border-blue-200 focus:border-blue-500 focus:ring-blue-200'
                              } focus:outline-none focus:ring-4 focus:ring-opacity-20`}
                              disabled={isSubmitting}
                              onChange={(e) => {
                                field.onChange(e);
                                if (apiError) setApiError(null);
                              }}
                            />
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          </div>
                        </FormControl>
                        
                        {hasError && (
                          <div className="flex items-center space-x-2 text-red-600 text-sm mt-2">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{errorMessage}</span>
                          </div>
                        )}

                        {isValid && (
                          <div className="flex items-center space-x-2 text-green-600 text-sm mt-2">
                            <CheckCircle className="w-4 h-4 flex-shrink-0" />
                            <span>Valid email format</span>
                          </div>
                        )}
                      </FormItem>
                    );
                  }}
                />

                <button
                  type="submit"
                  disabled={isSubmitting || !formState.isValid}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                    isSubmitting || !formState.isValid
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-[0.98] shadow-sm'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending Reset Link...</span>
                    </>
                  ) : (
                    <span>Send Reset Link</span>
                  )}
                </button>
              </form>
            </Form>

            <div className="mt-6 pt-6 border-t border-blue-200">
              <p className="text-sm text-gray-600 text-center">
                Remember your password?{' '}
                <button 
                  onClick={() => window.history.back()}
                  className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors duration-200"
                >
                  Sign in instead
                </button>
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Having trouble? Contact our{' '}
            <button className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors duration-200">
              support team
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
