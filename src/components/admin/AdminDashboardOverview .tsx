import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Target, Users, Shield, ChevronLeft, ChevronRight, ExternalLink, Download, StopCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useData } from "@/context/DataContext";
import { Loader } from "../Loader";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface AdminDashboardOverviewProps {
  onToolSelect?: (toolId: string) => void;
}

export const AdminDashboardOverview = ({ onToolSelect }: AdminDashboardOverviewProps) => {
  const { allTools, stats, loading, error, coordinatorEmail, setTools } = useData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState<string>("entire");
  const [coordinatorFilter, setCoordinatorFilter] = useState<string>("all");
  const [customDateRange, setCustomDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [stoppingToolId, setStoppingToolId] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Filter by date
  const getFilteredByDate = (tools: typeof allTools) => {
    if (dateFilter === "entire") return tools;

    const now = new Date();
    const filtered = tools.filter((tool) => {
      const toolDate = tool.dateSubmitted ? new Date(tool.dateSubmitted) : null;
      if (!toolDate) return false;

      switch (dateFilter) {
        case "week": {
          const weekAgo = new Date(now);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return toolDate >= weekAgo;
        }
        case "month": {
          const monthAgo = new Date(now);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return toolDate >= monthAgo;
        }
        case "custom": {
          if (customDateRange.from && customDateRange.to) {
            return toolDate >= customDateRange.from && toolDate <= customDateRange.to;
          }
          if (customDateRange.from) {
            return toolDate >= customDateRange.from;
          }
          if (customDateRange.to) {
            return toolDate <= customDateRange.to;
          }
          return true;
        }
        default:
          return true;
      }
    });

    return filtered;
  };

  // Filter by coordinator status
  const getFilteredByCoordinator = (tools: typeof allTools) => {
    if (coordinatorFilter === "all") return tools;

    return tools.filter((tool) => {
      const isUnassigned = tool.coordinator === "Unassigned" || tool.coordinator === "mdii@cgiar.org";
      return coordinatorFilter === "assigned" ? !isUnassigned : isUnassigned;
    });
  };

  // Filter by search term, date, and coordinator
  const filteredTools = getFilteredByCoordinator(
    getFilteredByDate(allTools)
  ).filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.coordinator.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredTools.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTools = filteredTools.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleDateFilterChange = (value: string) => {
    setDateFilter(value);
    setCurrentPage(1);
    if (value !== "custom") {
      setCustomDateRange({}); // Reset custom date range when switching away from custom
    }
  };

  const handleCoordinatorFilterChange = (value: string) => {
    setCoordinatorFilter(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Calculate admin-specific stats
  const totalCoordinators = new Set(
    allTools
      .map((t) => t.coordinator)
      .filter((c) => c !== "Unassigned" && c !== "mdii@cgiar.org")
  ).size;
  const stoppedTools = allTools.filter((t) => t.status === "stopped").length;
  const activeTools = allTools.filter((t) => t.status === "active").length;
  const overallCompletion = allTools.length > 0 ? Math.round((stoppedTools / allTools.length) * 100) : 0;

  const getStatusBadge = (status: string) => {
    const variants: any = {
      stopped: "secondary",
      active: "outline",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const handleAssignCoordinators = () => {
    window.open("https://ee.kobotoolbox.org/x/BjUB2L85", "_blank");
  };

  const handleStopTool = async (toolId: string) => {
    setStoppingToolId(toolId);
    const tool = allTools.find((t) => t.id === toolId);
    if (!tool) return;

    const currentDateTime = new Date();
    const formattedDateTime = currentDateTime.toLocaleString();
    const isoDateTime = currentDateTime.toISOString();

    try {
      const calculationMethod = tool.maturityLevel === "advanced" ? "MDII Regular Version" : "MDII Exante Version";
      const csvApiUrl = `${import.meta.env.VITE_AZURE_FUNCTION_BASE}/api/score_kobo_tool?code=${import.meta.env.VITE_AZURE_FUNCTION_KEY}&tool_id=${tool.id}&calculation_method=${encodeURIComponent(calculationMethod)}&column_names=column_names`;
      const img = new Image();
      img.src = csvApiUrl;

      await new Promise(resolve => setTimeout(resolve, 1000));

      const apiUrl = `/api/score-tool?tool_id=${tool.id}`;
      const response = await fetch(apiUrl);

      if (!response.ok) throw new Error(`Failed to trigger tool stop: ${response.statusText}`);

      setTools((prev) =>
        prev.map((t) => (t.id === tool.id ? { ...t, status: "stopped" } : t))
      );

      toast({
        title: "Tool Stopped",
        description: `${tool.name} evaluation closed at ${formattedDateTime}. Email with report will be sent shortly.`,
      });

      setTimeout(async () => {
        try {
          const flowUrl = "https://default6afa0e00fa1440b78a2e22a7f8c357.d5.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/080a15cb2b9b4387ac23f1a7978a8bbb/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=XlWqhTpqNuxZJkvKeCoWziBX5Vhgtix8zdUq0IF8Npw";

          const pdfReportLink = `https://mdii-score-tool-gveza9gtabfbbxh8.eastus2-01.azurewebsites.net/api/report_pdf_generation?tool_id=${tool.id}`;

          const payload = {
            tool_id: tool.id,
            tool_name: tool.name,
            tool_maturity: tool.maturityLevel || "unknown",
            stopped_at: formattedDateTime,
            stopped_at_iso: isoDateTime,
            timestamp: currentDateTime.getTime(),
            pdf_report_link: pdfReportLink,
          };

          const flowResponse = await fetch(flowUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (!flowResponse.ok) {
            throw new Error(`Failed to trigger email flow: ${flowResponse.statusText}`);
          }

          toast({
            title: "Email Triggered",
            description: `Email for tool ${tool.id} has been sent with score report link attached.`,
          });
        } catch (flowErr: any) {
          console.error("Error triggering Power Automate:", flowErr);
          toast({
            title: "Error",
            description: `Failed to trigger email: ${flowErr.message}`,
            variant: "destructive",
          });
        }
      }, 6000);
    } catch (err: any) {
      console.error("Error stopping tool:", err);
      toast({
        title: "Error",
        description: err.message.includes("Failed to fetch") || err.message.includes("CORS")
          ? "Unable to connect to the server. Please try again later or contact support."
          : `Failed to stop tool: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setStoppingToolId(null);
    }
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Full system overview and management</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Administrator</p>
          <p className="text-sm font-medium">{coordinatorEmail}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tools</CardTitle>
            <Target className="h-4 w-4 text-forest" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{allTools.length}</div>
            <p className="text-xs text-muted-foreground">All research instruments</p>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coordinators</CardTitle>
            <Users className="h-4 w-4 text-earth-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalCoordinators}</div>
            <p className="text-xs text-muted-foreground">Active coordinators</p>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stopped</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stoppedTools}</div>
            <p className="text-xs text-muted-foreground">Fully evaluated</p>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{activeTools}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

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

      {/* All Tools Table */}
      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle>All Tools</CardTitle>
          <CardDescription>Complete overview of all research tools in the system</CardDescription>
          <div className="flex gap-4 mt-4">
            <Input
              placeholder="Search by tool name, ID, or coordinator..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="flex-1"
            />
            <Select value={dateFilter} onValueChange={handleDateFilterChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entire">Entire Time</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="custom">Custom Date Range</SelectItem>
              </SelectContent>
            </Select>
            <Select value={coordinatorFilter} onValueChange={handleCoordinatorFilterChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by coordinator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Coordinators</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
              </SelectContent>
            </Select>
            {dateFilter === "custom" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                    {customDateRange.from ? (
                      customDateRange.to ? (
                        <>
                          {format(customDateRange.from, "MMM dd, yyyy")} - {format(customDateRange.to, "MMM dd, yyyy")}
                        </>
                      ) : (
                        format(customDateRange.from, "MMM dd, yyyy")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={{ from: customDateRange.from, to: customDateRange.to }}
                    onSelect={(range) => {
                      setCustomDateRange({ from: range?.from, to: range?.to });
                      setCurrentPage(1);
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-semibold text-sm">Tool ID</th>
                  <th className="text-left p-3 font-semibold text-sm">Tool Name</th>
                  <th className="text-left p-3 font-semibold text-sm">Coordinator</th>
                  <th className="text-left p-3 font-semibold text-sm">Date Submitted</th>
                  <th className="text-left p-3 font-semibold text-sm">Maturity</th>
                  <th className="text-left p-3 font-semibold text-sm">Status</th>
                  <th className="text-center p-3 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTools.map((tool) => (
                  <tr key={tool.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="p-3 font-mono text-sm">{tool.id}</td>
                    <td className="p-3 font-medium">{tool.name}</td>
                    <td className="p-3 text-sm">
                      {tool.coordinator === "Unassigned" || tool.coordinator === "mdii@cgiar.org" ? (
                        <Button
                          onClick={handleAssignCoordinators}
                          className="bg-gradient-to-r from-forest to-primary hover:from-forest/90 hover:to-primary/90 text-sm"
                          size="sm"
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Assign
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      ) : (
                        tool.coordinator
                      )}
                    </td>
                    <td className="p-3 text-sm">{tool.dateSubmitted || "N/A"}</td>
                    <td className="p-3">
                      <Badge variant={tool.maturityLevel === "advanced" ? "default" : "secondary"}>
                        {tool.maturityLevel || "N/A"}
                      </Badge>
                    </td>
                    <td className="p-3">{getStatusBadge(tool.status)}</td>
                    <td className="p-3 text-center">
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => onToolSelect?.(tool.id)}
                        className="text-primary hover:text-primary/80"
                      >
                        View Details
                      </Button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {currentTools.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">No tools found matching your filters.</div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredTools.length)} of {filteredTools.length} tools
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      return (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      );
                    })
                    .map((page, index, array) => {
                      const prevPage = array[index - 1];
                      const showEllipsis = prevPage && page - prevPage > 1;

                      return (
                        <div key={page} className="flex items-center">
                          {showEllipsis && <span className="px-2">...</span>}
                          <Button
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        </div>
                      );
                    })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};