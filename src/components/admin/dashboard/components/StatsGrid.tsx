import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Target, Users } from "lucide-react";

interface StatsGridProps {
  allTools: any[];
}

export const StatsGrid = ({ allTools }: StatsGridProps) => {
  const totalCoordinators = new Set(
    allTools
      .map((t) => t.coordinator)
      .filter((c) => c !== "Unassigned" && c !== "mdii@cgiar.org")
  ).size;
  
  const stoppedTools = allTools.filter((t) => t.status === "stopped").length;
  const activeTools = allTools.filter((t) => t.status === "active").length;
  const overallCompletion = allTools.length > 0 
    ? Math.round((stoppedTools / allTools.length) * 100) 
    : 0;

  const stats = [
    {
      title: "Total Tools",
      value: allTools.length,
      description: "All research instruments",
      icon: Target,
      color: "text-forest",
    },
    {
      title: "Active Evaluations",
      value: activeTools,
      description: "In progress",
      icon: Clock,
      color: "text-warning",
    },
    {
      title: "Completed Evaluations",
      value: stoppedTools,
      description: "Fully evaluated",
      icon: CheckCircle,
      color: "text-success",
    },
    {
      title: "Coordinators",
      value: totalCoordinators,
      description: "Active coordinators",
      icon: Users,
      color: "text-earth-blue",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={stat.title}
            className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
      
      <Card className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
          <Target className="h-4 w-4 text-forest" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{overallCompletion}%</div>
          <Progress value={overallCompletion} className="mt-2" />
        </CardContent>
      </Card>
    </div>
  );
};