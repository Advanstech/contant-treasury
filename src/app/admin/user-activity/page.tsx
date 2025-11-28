'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Shield, 
  AlertTriangle, 
  Activity, 
  Globe, 
  Clock,
  TrendingUp,
  TrendingDown,
  Eye,
  Ban,
  Download
} from 'lucide-react';

interface DashboardMetrics {
  metrics: Array<{
    date: string;
    totalLogins: number;
    uniqueUsers: number;
    failedLogins: number;
    suspiciousActivities: number;
  }>;
  currentActiveSessions: number;
  unresolvedSecurityEvents: number;
}

interface RealTimeData {
  recentLogins: number;
  activeSessions: number;
  recentSecurityEvents: number;
  topCountries: Array<{ country: string; count: number }>;
  suspiciousLogins: number;
  timestamp: string;
}

interface SecurityEvent {
  id: string;
  eventType: string;
  severity: string;
  description: string;
  createdAt: string;
  resolved: boolean;
  user?: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

interface UserSession {
  id: string;
  ipAddress: string;
  userAgent: string;
  loginMethod: string;
  status: string;
  lastActivityAt: string;
  createdAt: string;
  riskScore: number;
  mfaVerified: boolean;
  location?: {
    country: string;
    city: string;
  };
  user: {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export default function UserActivityPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [realTimeData, setRealTimeData] = useState<RealTimeData | null>(null);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [activeSessions, setActiveSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchRealTimeData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [selectedTimeRange]);

  const fetchData = async () => {
    try {
      const [metricsRes, realTimeRes, eventsRes, sessionsRes] = await Promise.all([
        fetch('/api/v1/admin/user-activity/dashboard'),
        fetch('/api/v1/admin/user-activity/real-time'),
        fetch('/api/v1/admin/user-activity/security-events?limit=10'),
        fetch('/api/v1/admin/user-activity/sessions?limit=20')
      ]);

      const [metricsData, realTimeData, eventsData, sessionsData] = await Promise.all([
        metricsRes.json(),
        realTimeRes.json(),
        eventsRes.json(),
        sessionsRes.json()
      ]);

      setMetrics(metricsData);
      setRealTimeData(realTimeData);
      setSecurityEvents(eventsData);
      setActiveSessions(sessionsData);
    } catch (error) {
      console.error('Failed to fetch activity data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRealTimeData = async () => {
    try {
      const response = await fetch('/api/v1/admin/user-activity/real-time');
      const data = await response.json();
      setRealTimeData(data);
    } catch (error) {
      console.error('Failed to fetch real-time data:', error);
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to terminate this session?')) return;
    
    try {
      await fetch(`/api/v1/admin/user-activity/sessions/${sessionId}/terminate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Admin termination' })
      });
      fetchData();
    } catch (error) {
      console.error('Failed to terminate session:', error);
    }
  };

  const handleResolveEvent = async (eventId: string) => {
    try {
      await fetch(`/api/v1/admin/user-activity/security-events/${eventId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolverId: 'current-user' }) // Would get from auth context
      });
      fetchData();
    } catch (error) {
      console.error('Failed to resolve event:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-500';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'LOW': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-600';
    if (score >= 40) return 'text-orange-600';
    if (score >= 20) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">User Activity Monitoring</h1>
          <p className="text-gray-400 mt-2">Real-time security and user activity tracking</p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="bg-navy-800 border border-navy-600 rounded-lg px-4 py-2 text-white"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <Button variant="outline" className="border-navy-600 text-white hover:bg-navy-800">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Real-time KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-navy-800 border-navy-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Sessions</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{realTimeData?.activeSessions || 0}</div>
            <p className="text-xs text-gray-400 mt-1">
              {realTimeData?.recentLogins || 0} logins in last hour
            </p>
          </CardContent>
        </Card>

        <Card className="bg-navy-800 border-navy-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Security Events</CardTitle>
            <Shield className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{realTimeData?.recentSecurityEvents || 0}</div>
            <p className="text-xs text-red-400 mt-1">
              {metrics?.unresolvedSecurityEvents || 0} unresolved
            </p>
          </CardContent>
        </Card>

        <Card className="bg-navy-800 border-navy-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Suspicious Logins</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{realTimeData?.suspiciousLogins || 0}</div>
            <p className="text-xs text-gray-400 mt-1">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card className="bg-navy-800 border-navy-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Top Countries</CardTitle>
            <Globe className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {realTimeData?.topCountries?.[0]?.country || 'N/A'}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {realTimeData?.topCountries?.[0]?.count || 0} sessions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="sessions" className="space-y-4">
        <TabsList className="bg-navy-800 border-navy-600">
          <TabsTrigger value="sessions" className="data-[state=active]:bg-navy-700">
            <Users className="w-4 h-4 mr-2" />
            Active Sessions
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-navy-700">
            <Shield className="w-4 h-4 mr-2" />
            Security Events
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-navy-700">
            <Activity className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Active Sessions Tab */}
        <TabsContent value="sessions" className="space-y-4">
          <Card className="bg-navy-800 border-navy-600">
            <CardHeader>
              <CardTitle className="text-white">Active User Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                  <thead className="text-xs uppercase bg-navy-900">
                    <tr>
                      <th className="px-6 py-3">User</th>
                      <th className="px-6 py-3">Location</th>
                      <th className="px-6 py-3">Device</th>
                      <th className="px-6 py-3">Risk Score</th>
                      <th className="px-6 py-3">Last Activity</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeSessions.map((session) => (
                      <tr key={session.id} className="border-b border-navy-700">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-white">
                              {session.user.firstName} {session.user.lastName}
                            </div>
                            <div className="text-gray-400">{session.user.email}</div>
                            <Badge variant="secondary" className="mt-1">
                              {session.user.role}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {session.location ? (
                            <div>
                              <div>{session.location.city}, {session.location.country}</div>
                              <div className="text-gray-400 text-xs">{session.ipAddress}</div>
                            </div>
                          ) : (
                            <span className="text-gray-400">Unknown</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs truncate">
                            {session.userAgent.split(' ')[0]}
                          </div>
                          <div className="text-gray-400 text-xs">
                            {session.mfaVerified ? 'MFA ✓' : 'No MFA'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-semibold ${getRiskScoreColor(session.riskScore)}`}>
                            {session.riskScore}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-gray-400">
                            <Clock className="w-4 h-4 mr-1" />
                            {new Date(session.lastActivityAt).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-navy-600 text-white hover:bg-navy-700"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-600 text-red-400 hover:bg-red-900"
                              onClick={() => handleTerminateSession(session.id)}
                            >
                              <Ban className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Events Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card className="bg-navy-800 border-navy-600">
            <CardHeader>
              <CardTitle className="text-white">Recent Security Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 bg-navy-900 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${getSeverityColor(event.severity)}`}></div>
                      <div>
                        <div className="font-medium text-white">{event.eventType}</div>
                        <div className="text-gray-400 text-sm">{event.description}</div>
                        <div className="text-gray-500 text-xs mt-1">
                          {new Date(event.createdAt).toLocaleString()} • 
                          {event.user ? ` ${event.user.firstName} ${event.user.lastName}` : ' Unknown user'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(event.severity)}>
                        {event.severity}
                      </Badge>
                      {!event.resolved && (
                        <Button
                          size="sm"
                          onClick={() => handleResolveEvent(event.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-navy-800 border-navy-600">
              <CardHeader>
                <CardTitle className="text-white">Login Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  Chart implementation would go here
                  <br />
                  (Login trends over time)
                </div>
              </CardContent>
            </Card>

            <Card className="bg-navy-800 border-navy-600">
              <CardHeader>
                <CardTitle className="text-white">Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {realTimeData?.topCountries?.map((country, index) => (
                    <div key={country.country} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-navy-700 rounded-full flex items-center justify-center text-sm">
                          {index + 1}
                        </div>
                        <span className="text-white">{country.country}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-navy-700 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full"
                            style={{ 
                              width: `${(country.count / (realTimeData.topCountries[0]?.count || 1)) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-gray-400 text-sm w-12 text-right">
                          {country.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
