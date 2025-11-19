import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardOverview } from "@/components/DashboardOverview";
import { AdminDashboardOverview } from "@/components/admin/dashboard/AdminDashboardOverview";
import { ToolDetails } from "@/components/ToolDetails";
import { useData } from "@/context/DataContext";
import { Loader } from "@/components/Loader";
import { CoordinatorFeedback } from "@/components/CoordinatorFeedback ";
import UserGuide from "@/components/UserGuide";
import CoordinatorManagement from "@/components/admin/CoordinatorManagement"
import DomainExpertManagement from "@/components/admin/DomainExpertManagement";
import { AdminCalendar } from "@/components/admin/AdminCalendar";


const DashboardContent = () => {
  const [currentView, setCurrentView] = useState("overview");
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const { coordinatorEmail, isAdmin, loading, error } = useData();

  const renderContent = () => {
    switch (currentView) {
      case "overview":
        return isAdmin ? (
          <AdminDashboardOverview onToolSelect={handleToolSelect} />
        ) : (
          <DashboardOverview coordinatorEmail={coordinatorEmail} onToolSelect={handleToolSelect} />
        );
      case "tool-details":
        return <ToolDetails toolId={selectedToolId} />;
      case "coordinator-management":
        return isAdmin ? <CoordinatorManagement /> : null;
      case "domain-expert-management":
        return isAdmin ? <DomainExpertManagement /> : null;
      case "calendar":
        return isAdmin ? <AdminCalendar /> : null;
      case "feedback":
        return <CoordinatorFeedback />;
      case "user-guide":
        return <UserGuide />;
      default:
        return isAdmin ? (
          <AdminDashboardOverview onToolSelect={handleToolSelect} />
        ) : (
          <DashboardOverview coordinatorEmail={coordinatorEmail} onToolSelect={handleToolSelect} />
        );
    }
  };

  // Handler for when a tool is selected from ToolSearch or AdminDashboard
  const handleToolSelect = (toolId: string) => {
    setSelectedToolId(toolId);
    setCurrentView("tool-details");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-destructive">
        Error: {error}
      </div>
    );

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-forest-light/30 to-earth-blue-light/30">
      <AppSidebar currentView={currentView} onViewChange={setCurrentView} isAdmin={isAdmin} />
      <main className="flex-1 p-6">
        {renderContent()}
      </main>
    </div>
  );
};

const Dashboard = () => {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
};

export default Dashboard;