import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardOverview } from "@/components/DashboardOverview";
import { ToolSearch } from "@/components/ToolSearch";
import { ToolDetails } from "@/components/ToolDetails";
import { useData } from "@/context/DataContext";
import { Loader } from "@/components/Loader";
import { CoordinatorFeedback } from "@/components/CoordinatorFeedback ";

const DashboardContent = () => {
  const [currentView, setCurrentView] = useState("overview");
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const { coordinatorEmail, loading, error } = useData();

  const renderContent = () => {
    switch (currentView) {
      case "overview":
        return <DashboardOverview coordinatorEmail={coordinatorEmail} />;
      // case "tools":
      //   return <ToolSearch />;
      case "tool-details":
        return <ToolDetails toolId={selectedToolId} />;
      case "feedback":
        return <CoordinatorFeedback />;
      default:
        return <DashboardOverview coordinatorEmail={coordinatorEmail} />;
    }
  };

  // Handler for when a tool is selected from ToolSearch
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
      <AppSidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 p-6">
        {/* Pass the tool selection handler to ToolSearch */}
        {currentView === "overview" ? (
          <DashboardOverview 
            coordinatorEmail={coordinatorEmail} 
            onToolSelect={handleToolSelect}
          />
        ) : (
          renderContent()
        )}
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