import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useData } from "@/context/DataContext";
import { Loader } from "@/components/Loader";
import { DashboardHeader} from "./components/DashboardHeader";
import { StatsGrid } from "./components/StatsGrid";
import { ToolsTable } from "./components/ToolsTable";
import { useToolFilters } from "./hooks/useToolFilters";
import useToolActions from "./hooks/useToolActions";

interface AdminDashboardOverviewProps {
  onToolSelect?: (toolId: string) => void;
}

export const AdminDashboardOverview = ({ onToolSelect }: AdminDashboardOverviewProps) => {
  const { allTools, loading, error, coordinatorEmail } = useData();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none");

  const {
    searchTerm,
    setSearchTerm,
    dateFilter,
    setDateFilter,
    coordinatorFilter,
    setCoordinatorFilter,
    customDateRange,
    setCustomDateRange,
    filteredTools,
  } = useToolFilters(allTools, sortOrder);

  const { handleStopTool, stoppingToolId } = useToolActions();

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredTools.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTools = filteredTools.slice(startIndex, endIndex);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleDateFilterChange = (value: string) => {
    setDateFilter(value);
    setCurrentPage(1);
    if (value !== "custom") {
      setCustomDateRange({});
    }
  };

  const handleCoordinatorFilterChange = (value: string) => {
    setCoordinatorFilter(value);
    setCurrentPage(1);
  };

  const handleSortChange = () => {
    if (sortOrder === "none" || sortOrder === "desc") {
      setSortOrder("asc");
    } else {
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-16">
          <Loader />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-l-4 border-l-destructive">
        <CardContent className="text-center py-8">
          <p className="text-destructive font-semibold">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader coordinatorEmail={coordinatorEmail} />
      
      <StatsGrid allTools={allTools} />
      
      <ToolsTable
        currentTools={currentTools}
        filteredTools={filteredTools}
        searchTerm={searchTerm}
        dateFilter={dateFilter}
        coordinatorFilter={coordinatorFilter}
        customDateRange={customDateRange}
        sortOrder={sortOrder}
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        stoppingToolId={stoppingToolId}
        onSearchChange={handleSearchChange}
        onDateFilterChange={handleDateFilterChange}
        onCoordinatorFilterChange={handleCoordinatorFilterChange}
        onCustomDateRangeChange={(range) => {
          setCustomDateRange(range);
          setCurrentPage(1);
        }}
        onSortChange={handleSortChange}
        onPageChange={setCurrentPage}
        onToolSelect={onToolSelect}
        onStopTool={handleStopTool}
      />
    </div>
  );
};