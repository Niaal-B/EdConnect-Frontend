import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  ExternalLink,
  RefreshCw,
  TrendingUp
} from 'lucide-react';
import MentorDashboardLayout from '@/components/MentorDashboardLayout';
import api from '@/lib/api';

interface StripeAccountStatus {
  status: 'not_onboarded' | 'onboarded';
  details_submitted?: boolean;
  payouts_enabled?: boolean;
  charges_enabled?: boolean;
  requirements_due?: string[];
  detail: string;
}

interface EarningsData {
  totalEarnings: number;
  monthlyEarnings: number;
  pendingPayouts: number;
  availableForPayout: number;
  completedSessions: number;
  averageSessionFee: number;
  payoutSchedule: string;
  platformFee: number;
  processingTime: string;
}

const MentorEarnings = () => {
  const [stripeStatus, setStripeStatus] = useState<StripeAccountStatus | null>(null);
  const [earningsData, setEarningsData] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [earningsLoading, setEarningsLoading] = useState(false);
  const [onboardingLoading, setOnboardingLoading] = useState(false);
  const [onboardingMessage, setOnboardingMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchStripeStatus = async () => {
    try {
      setLoading(true);
      const response = await api.get('/mentors/stripe/onboard/');
      console.log('Stripe Status Response:', response.data);
      setStripeStatus(response.data);
      return response.data.payouts_enabled && response.data.charges_enabled;
    } catch (error: any) {
      console.error('Error fetching Stripe status:', error);
      toast({
        title: "Error fetching status",
        description: error.response?.data?.detail || error.message || "Could not retrieve Stripe account status.",
        variant: "destructive",
      });
      setStripeStatus(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchEarningsData = async () => {
    try {
      setEarningsLoading(true);
      const response = await api.get('/mentors/earnings/');
      console.log('Earnings Data Response:', response.data);
      setEarningsData(response.data);
    } catch (error: any) {
      console.error('Error fetching earnings data:', error);
      toast({
        title: "Error fetching earnings",
        description: error.response?.data?.detail || error.message || "Could not retrieve earnings data.",
        variant: "destructive",
      });
      setEarningsData(null);
    } finally {
      setEarningsLoading(false);
    }
  };

  const initiateStripeOnboarding = async () => {
    try {
      setOnboardingLoading(true);
      const response = await api.post('/mentors/stripe/onboard/', {});
      console.log(response);
      window.open(response.data.url, '_blank');
      toast({
        title: "Redirecting to Stripe",
        description: "Complete your account setup in the new tab. You may need to refresh this page afterwards.",
      });
    } catch (error: any) {
      console.error('Error initiating Stripe onboarding:', error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || error.message || "Failed to start Stripe onboarding. Please try again.",
        variant: "destructive",
      });
    } finally {
      setOnboardingLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const payoutsEnabled = await fetchStripeStatus();
      if (payoutsEnabled) {
        fetchEarningsData();
      }
    };

    loadData();

    const urlParams = new URLSearchParams(window.location.search);
    const onboardingSuccess = urlParams.get('onboarding_success');
    const refresh = urlParams.get('refresh');

    if (onboardingSuccess === 'true') {
      setOnboardingMessage('Stripe onboarding successful! Your account is being verified.');
    } else if (refresh === 'true') {
      setOnboardingMessage('Stripe account setup link expired or refreshed. Please click the button to get a new link and continue.');
    }
  }, []);


  const getStatusBadge = () => {
    if (!stripeStatus) return null;

    if (stripeStatus.status === 'not_onboarded') {
      return <Badge variant="secondary" className="flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        Not Connected
      </Badge>;
    }

    if (stripeStatus.payouts_enabled && stripeStatus.charges_enabled) {
      return <Badge className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-100">
        <CheckCircle className="h-3 w-3" />
        Active
      </Badge>;
    }

    if (stripeStatus.requirements_due && stripeStatus.requirements_due.length > 0) {
      return <Badge variant="destructive" className="flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        Action Required
      </Badge>;
    }

    return <Badge variant="outline" className="flex items-center gap-1">
      <Clock className="h-3 w-3" />
      Pending
    </Badge>;
  };

  const getStatusMessage = () => {
    if (!stripeStatus) return '';

    if (stripeStatus.status === 'not_onboarded') {
      return 'Connect your Stripe account to start receiving payouts from your mentoring sessions.';
    }

    if (stripeStatus.payouts_enabled && stripeStatus.charges_enabled) {
      return 'Your Stripe account is fully set up and ready to receive payouts.';
    }

    if (stripeStatus.requirements_due && stripeStatus.requirements_due.length > 0) {
      return 'Your Stripe account needs additional information. Please complete the verification process.';
    }

    return 'Your Stripe account is being reviewed. This usually takes 1-2 business days.';
  };

  const canReceivePayouts = stripeStatus?.payouts_enabled && stripeStatus?.charges_enabled;

  return (
    <MentorDashboardLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Earnings</h1>
            <p className="text-gray-600 mt-1">Manage your payouts and view earnings from mentoring sessions</p>
          </div>
          <Button
            onClick={() => { setOnboardingMessage(null); fetchStripeStatus(); fetchEarningsData(); }}
            variant="outline"
            size="sm"
            disabled={loading || earningsLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading || earningsLoading ? 'animate-spin' : ''}`} />
            Refresh Status
          </Button>
        </div>

        {onboardingMessage && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="font-semibold">
              {onboardingMessage}
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <CardTitle>Stripe Account Status</CardTitle>
              </div>
              {getStatusBadge()}
            </div>
            <CardDescription>
              {getStatusMessage()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="space-y-4">
                {stripeStatus?.requirements_due && stripeStatus.requirements_due.length > 0 && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          **Action Required:** Your Stripe account needs immediate attention to receive payouts.
                        </AlertDescription>
                      </Alert>
                    )}
                 <div className="flex gap-3">
                  {stripeStatus?.status === 'not_onboarded' || !stripeStatus?.details_submitted || (stripeStatus?.requirements_due && stripeStatus.requirements_due.length > 0) ? (
                    <Button
                      onClick={initiateStripeOnboarding}
                      disabled={onboardingLoading}
                      variant={(stripeStatus?.requirements_due && stripeStatus.requirements_due.length > 0) ? "destructive" : "default"}
                      className="flex items-center gap-2"
                    >
                      {onboardingLoading ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <ExternalLink className="h-4 w-4" />
                      )}
                      {stripeStatus?.status === 'not_onboarded' ? 'Connect Stripe Account' :
                       ((stripeStatus?.requirements_due && stripeStatus.requirements_due.length > 0) ? 'Complete Verification / Update Details' : 'Continue Setup')}
                    </Button>
                  ) : (
                    <Button
                      onClick={initiateStripeOnboarding}
                      disabled={onboardingLoading}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      {onboardingLoading ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <ExternalLink className="h-4 w-4" />
                      )}
                      Manage Account
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {canReceivePayouts && (
          <>
            {earningsLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                <p className="text-gray-500 mt-2">Loading earnings...</p>
              </div>
            ) : (
              earningsData ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">${earningsData.totalEarnings.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                          From {earningsData.completedSessions} completed sessions
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Month</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">${earningsData.monthlyEarnings.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                          (Based on payouts this month)
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">${earningsData.pendingPayouts.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                          (Funds being processed by Stripe)
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Payout Information</CardTitle>
                      <CardDescription>
                        Payouts are processed automatically by Stripe
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-700">Payout Schedule</p>
                          <p className="text-gray-600">{earningsData.payoutSchedule}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Average Session Fee</p>
                          <p className="text-gray-600">${earningsData.averageSessionFee.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Platform Fee</p>
                          <p className="text-gray-600">{earningsData.platformFee}% per transaction</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Processing Time</p>
                          <p className="text-gray-600">{earningsData.processingTime}</p>
                        </div>
                      </div>

                      <Separator />

                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          Your earnings from completed sessions are automatically transferred to your connected bank account.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Alert variant="info">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No earnings data available yet. Complete a session to see your earnings!
                  </AlertDescription>
                </Alert>
              )
            )}
          </>
        )}
      </div>
    </MentorDashboardLayout>
  );
};

export default MentorEarnings;