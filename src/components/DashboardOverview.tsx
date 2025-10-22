import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Users, Target, Shield } from "lucide-react";
import { useData } from "@/context/DataContext";
import { Loader } from "./Loader";
import { ToolSearch } from "./ToolSearch";

interface DashboardOverviewProps {
  coordinatorEmail: string;
  onToolSelect?: (toolId: string) => void;
}

export const DashboardOverview = ({ coordinatorEmail, onToolSelect }: DashboardOverviewProps) => {
  const { stats, loading, error, fetchData } = useData();

  // Retry fetching data on component mount if there's an error
  useEffect(() => {
    if (error) {
      const retry = setTimeout(() => {
        fetchData();
      }, 3000);
      return () => clearTimeout(retry);
    }
  }, [error, fetchData]);

  const getStatusBadge = (status: string) => {
    const variants = {
      stopped: "secondary",
      active: "outline",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-forest to-primary rounded-full flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Coordinator Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {coordinatorEmail || "Unknown User"}</p>
          </div>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <Loader />
          </CardContent>
        </Card>
      )}
      {error && (
        <Card className="border-l-4 border-l-destructive">
          <CardContent className="text-center py-8">
            <p className="text-destructive font-semibold">Error: {error}</p>
            <p className="text-muted-foreground mt-2">Retrying in 3 seconds...</p>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Appointed</CardTitle>
              <Users className="h-4 w-4 text-earth-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats?.appointedTools ?? 0}</div>
              <p className="text-xs text-muted-foreground">Assigned to {coordinatorEmail || "you"}</p>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stopped</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats?.evaluatedTools ?? 0}</div>
              <p className="text-xs text-muted-foreground">Assessment completed</p>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats?.ongoingTools ?? 0}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion</CardTitle>
              <Target className="h-4 w-4 text-forest" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats?.completionRate ?? 0}%</div>
              <Progress value={stats?.completionRate ?? 0} className="mt-2" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tool Search Component */}
      {!loading && !error && <ToolSearch onToolSelect={onToolSelect} />}
    </div>
  );
};