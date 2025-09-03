import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  TrendingUp, 
  BarChart3,
  Activity,
  Menu,
  X
} from 'lucide-react';
import api from '@/lib/api';

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/dashboard/stats/');
      const data = await response.data;
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => {
    const colorClasses = {
      blue: 'from-blue-500 to-blue-600 border-blue-300',
      green: 'from-emerald-500 to-emerald-600 border-emerald-300',
      purple: 'from-purple-500 to-purple-600 border-purple-300',
      orange: 'from-orange-500 to-orange-600 border-orange-300'
    };

    return (
      <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-6 border shadow-sm hover:shadow-md transition-all duration-300`}>
        <div className="flex items-center justify-between">
          <div className="text-white">
            <p className="text-sm font-medium opacity-90">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
            {trend && (
              <p className="text-xs mt-2 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                {trend}
              </p>
            )}
          </div>
          <div className="bg-white bg-opacity-20 rounded-full p-3">
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h2 className="text-red-600 text-lg font-semibold mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-600 text-sm">{error}</p>
            <button 
              onClick={fetchDashboardStats}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalSignups = stats?.user_signups_last_7_days?.reduce((sum, day) => sum + day.signups, 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1">
        {/* Header */}
        <header className="border-b border-gray-200 px-6 py-4 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-semibold text-gray-800">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-500 text-sm">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
              <button
                onClick={fetchDashboardStats}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
              >
                Refresh
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="p-6">
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Users" value={stats.total_users} icon={Users} color="blue" trend="+12% from last month" />
            <StatCard title="Active Mentors" value={stats.active_mentors} icon={UserCheck} color="green" trend="+5% from last month" />
            <StatCard title="Sessions (30 days)" value={stats.completed_sessions_last_30_days} icon={Calendar} color="purple" />
            <StatCard title="Signups (7 days)" value={totalSignups} icon={TrendingUp} color="orange" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Signups Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                User Signups (Last 7 Days)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.user_signups_last_7_days}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="day" stroke="#6B7280" fontSize={12} tickFormatter={(value) => value.substring(0, 3)} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
                    <Bar dataKey="signups" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-500">User to Mentor Ratio</span>
                  <span className="text-gray-800 font-semibold">
                    {stats.active_mentors > 0 ? (stats.total_users / stats.active_mentors).toFixed(1) : 'N/A'}:1
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-500">Avg Daily Signups</span>
                  <span className="text-gray-800 font-semibold">{(totalSignups / 7).toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-500">Sessions per Mentor</span>
                  <span className="text-gray-800 font-semibold">
                    {stats.active_mentors > 0 ? (stats.completed_sessions_last_30_days / stats.active_mentors).toFixed(1) : '0'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-500">Most Active Day</span>
                  <span className="text-gray-800 font-semibold">
                    {stats.user_signups_last_7_days?.reduce((max, day) => day.signups > max.signups ? day : max)?.day || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* System Status */}
          {/* <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">System Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">API Status</p>
                <p className="text-xs text-green-600">Operational</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Database</p>
                <p className="text-xs text-green-600">Healthy</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Cache</p>
                <p className="text-xs text-yellow-600">Degraded</p>
              </div>
            </div>
          </div> */}
        </main>
      </div>
    </div>
  );
};

export default AdminStats;
