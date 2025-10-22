import { useState, useEffect } from "react";
import { Search, FileText, Calendar, User, MapPin, Loader2, CheckCircle, XCircle, AlertCircle, StopCircle, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useData } from "@/context/DataContext";
import { getApiUrl } from "@/config/apiConfig";
import { KOBO_CONFIG } from "@/config/koboConfig";
import { Loader } from "@/components/Loader";
import { useToast } from "@/hooks/use-toast";
import DataTable from "./DataTable";
import { fetchToolDetails, ToolDetailsData } from "@/context/toolUtils";

interface ToolDetailsProps {
  toolId?: string | null;
}

export function ToolDetails({ toolId: propToolId }: ToolDetailsProps) {
  const { tools, coordinatorEmail, setTools } = useData();
  const { toast } = useToast();
  const [selectedTool, setSelectedTool] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toolData, setToolData] = useState<ToolDetailsData | null>(null);
  const [isStopDialogOpen, setIsStopDialogOpen] = useState(false);
  const [stoppingTool, setStoppingTool] = useState(false);
  const [domainExpertsAssigned, setDomainExpertsAssigned] = useState(false);
  const [checkingAssignment, setCheckingAssignment] = useState(false);

  useEffect(() => {
    if (propToolId && tools.length > 0) {
      setSelectedTool(propToolId);
      fetchToolData(propToolId);
    }
  }, [propToolId, tools.length]);

  const fetchToolData = async (toolId: string) => {
    setLoading(true);
    setError(null);
    setToolData(null);
    setDomainExpertsAssigned(false);
    setCheckingAssignment(true);

    try {
      const assignmentFormIds = [
        'ap6dUEDwX7KUsKLFZUD7kb',
        'au52CRd6ATzV7S36WcAdDu',
        'aDrD6ZuThQweedHFoogbi4',
      ];

      let isAssigned = false;

      try {
        const assignmentChecks = await Promise.all(
          assignmentFormIds.map(formId =>
            fetch(getApiUrl(`assets/${formId}/data.json`, "assignmentCheck"))
          )
        );

        for (const res of assignmentChecks) {
          if (res.ok) {
            const text = await res.text();
            if (text) {
              const data = JSON.parse(text);
              const found = data.results.some((r: any) =>
                String(r["group_intro/Q_13110000"] || r["Q_13110000"] || "").trim() === toolId
              );
              if (found) {
                isAssigned = true;
                break;
              }
            }
          }
        }
      } catch (err) {
        console.warn("Error checking domain expert assignment:", err);
      }

      setDomainExpertsAssigned(isAssigned);
      setCheckingAssignment(false);

      const data = await fetchToolDetails(toolId, tools);
      setToolData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!selectedTool) return;
    fetchToolData(selectedTool);
  };

  const handleStopTool = () => {
    setIsStopDialogOpen(true);
  };

  const handleConfirmStop = async () => {
    if (!toolData) return;

    setStoppingTool(true);
    const currentDateTime = new Date();
    const formattedDateTime = currentDateTime.toLocaleString();
    const isoDateTime = currentDateTime.toISOString();

    try {
      const calculationMethod = toolData.maturity === "advance_stage" ? "MDII Regular Version" : "MDII Exante Version";
      const csvApiUrl = `${import.meta.env.VITE_AZURE_FUNCTION_BASE}/api/score_kobo_tool?code=${import.meta.env.VITE_AZURE_FUNCTION_KEY}&tool_id=${toolData.toolId}&calculation_method=${encodeURIComponent(calculationMethod)}&column_names=column_names`;
      const img = new Image();
      img.src = csvApiUrl;

      await new Promise(resolve => setTimeout(resolve, 1000));

      const apiUrl = `/api/score-tool?tool_id=${toolData.toolId}`;
      const response = await fetch(apiUrl);

      if (!response.ok) throw new Error(`Failed to trigger tool stop: ${response.statusText}`);

      setTools((prev) =>
        prev.map((tool) => (tool.id === toolData.toolId ? { ...tool, status: "stopped" } : tool))
      );

      setToolData((prev) => prev ? { ...prev, status: "stopped" } : null);

      toast({
        title: "Tool Stopped",
        description: `${toolData.toolName} submissions stopped at ${formattedDateTime}. Email will be sent shortly.`,
      });

      setTimeout(async () => {
        try {
          const flowUrl = "https://default6afa0e00fa1440b78a2e22a7f8c357.d5.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/080a15cb2b9b4387ac23f1a7978a8bbb/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=XlWqhTpqNuxZJkvKeCoWziBX5Vhgtix8zdUq0IF8Npw";

          const pdfReportLink = `https://mdii-score-tool-gveza9gtabfbbxh8.eastus2-01.azurewebsites.net/api/report_pdf_generation?tool_id=${toolData.toolId}`;

          const payload = {
            tool_id: toolData.toolId,
            tool_name: toolData.toolName,
            tool_maturity: toolData.maturity || "unknown",
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
            description: `Email for tool ${toolData.toolId} has been sent with Score report link attached.`,
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

      setIsStopDialogOpen(false);
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
      setStoppingTool(false);
    }
  };

  const getStatusIcon = (submitted: boolean) => {
    return submitted ?
      <CheckCircle className="h-4 w-4 text-green-600" /> :
      <XCircle className="h-4 w-4 text-gray-400" />;
  };

  const handleAssignDomainExperts = () => {
    if (!toolData) return;

    const toolId = toolData.toolId;
    const formUrl = `https://ee.kobotoolbox.org/x/y8TjauDs?&d[Q_13110000]=${encodeURIComponent(toolId)}`;
    window.open(formUrl, '_blank');
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-[1550px] mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Tool Details
          </h1>
          <p className="text-gray-600">View detailed submissions for your assigned tools</p>
        </div>

        <div className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Select Tool</h2>
          <div className="flex gap-3">
            <select
              value={selectedTool}
              onChange={(e) => setSelectedTool(e.target.value)}
              className="flex-1 px-3 py-2 border rounded"
            >
              <option value="">Choose a tool...</option>
              {tools.map(tool => (
                <option key={tool.id} value={tool.id}>
                  {tool.name} ({tool.id})
                </option>
              ))}
            </select>
            <Button onClick={handleSearch} disabled={!selectedTool || loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
              Search
            </Button>
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2 mt-3">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </div>

        {toolData && (
        <>
          <div className="bg-white border rounded-lg p-6 mb-6">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h2 className="text-lg font-medium mb-2">{toolData.toolName}</h2>
                <div className="flex gap-2">
                  <span className="text-sm text-gray-600">Tool ID: {toolData.toolId}</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {toolData.maturity.charAt(0).toUpperCase() + toolData.maturity.slice(1)}
                  </span>
                  <span className="text-sm text-gray-400">•</span>
                  <Badge className={toolData.status === "active" ? "bg-success/20 text-success border-success/30" : ""} variant={toolData.status === "stopped" ? "secondary" : "default"}>
                    {toolData.status === "active" ? "Active" : "Stopped"}
                  </Badge>
                </div>
              </div>
              {toolData.status === "active" ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleStopTool}
                  disabled={stoppingTool}
                  className="gap-2"
                >
                  {stoppingTool ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <StopCircle className="h-4 w-4" />
                  )}
                  Stop Tool
                </Button>
              ) : (
                <Button asChild variant="default" size="sm" className="gap-2">
                  <a
                    href={`https://mdii-score-tool-gveza9gtabfbbxh8.eastus2-01.azurewebsites.net/api/report_pdf_generation?tool_id=${toolData.toolId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Report
                  </a>
                </Button>
              )}
            </div>
          </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white border rounded-lg">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-medium">Innovators Team</h3>
                  <p className="text-sm text-gray-600">Leadership, Technical, and Project Manager</p>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {toolData.innovators.map((innovator) => (
                      <div key={innovator.role} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(innovator.submitted)}
                          <span className="text-sm font-medium">{innovator.role}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${innovator.submitted ? 'text-green-600' : 'text-gray-500'}`}>
                            {innovator.submitted ? 'Submitted' : 'Not Submitted'}
                          </span>
                          {innovator.submitted && (
                            <span className="text-xs text-gray-500">({innovator.count})</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-lg">
                <div className="px-6 py-4 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Domain Experts</h3>
                      <p className="text-sm text-gray-600">Expert submissions by domain</p>
                    </div>
                    {!checkingAssignment && !domainExpertsAssigned && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAssignDomainExperts}
                        className="gap-2"
                      >
                        <User className="h-4 w-4" />
                        Assign Domain Experts
                      </Button>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  {checkingAssignment ? (
                    <div className="text-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">Checking assignment status...</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {toolData.domainExperts.map((expert) => (
                        <div key={expert.category} className="flex items-center justify-between py-2 border-b last:border-b-0">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(expert.submitted)}
                            <span className="text-sm">{expert.category}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${expert.submitted ? 'text-green-600' : 'text-gray-500'}`}>
                              {expert.submitted ? 'Submitted' : 'Not Submitted'}
                            </span>
                            {expert.submitted && (
                              <span className="text-xs text-gray-500">({expert.count})</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg mb-6">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-medium">Summary</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-semibold text-gray-900 mb-1">
                      {toolData.innovators.filter((i) => i.submitted).length}/{toolData.innovators.length}
                    </div>
                    <div className="text-sm text-gray-600">Innovators</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-gray-900 mb-1">
                      {toolData.domainExperts.filter((e) => e.submitted).length}/{toolData.domainExperts.length}
                    </div>
                    <div className="text-sm text-gray-600">Domain Experts</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-gray-900 mb-1">
                      {toolData.directUsers.data.length}
                    </div>
                    <div className="text-sm text-gray-600">Direct Users</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-gray-900 mb-1">
                      {toolData.indirectUsers.data.length}
                    </div>
                    <div className="text-sm text-gray-600">Indirect Users</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="mb-4">
                <h2 className="text-lg font-medium">User Survey Responses</h2>
                <p className="text-gray-600">Direct and Indirect user feedback</p>
              </div>

              {toolData.directUsers.data.length > 0 && (
                <div className="bg-white border rounded-lg">
                  <div className="px-6 py-4 border-b">
                    <h3 className="text-lg font-medium">Direct Users</h3>
                  </div>
                  <div className="p-6">
                    <DataTable 
                      data={toolData.directUsers.data} 
                      questions={toolData.directUsers.questions}
                    />
                  </div>
                </div>
              )}

              {toolData.indirectUsers.data.length > 0 && (
                <div className="bg-white border rounded-lg">
                  <div className="px-6 py-4 border-b">
                    <h3 className="text-lg font-medium">Indirect Users</h3>
                  </div>
                  <div className="p-6">
                    <DataTable 
                      data={toolData.indirectUsers.data} 
                      questions={toolData.indirectUsers.questions}
                    />
                  </div>
                </div>
              )}

              {toolData.directUsers.data.length === 0 && toolData.indirectUsers.data.length === 0 && (
                <div className="bg-white border rounded-lg">
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No User Responses</h3>
                    <p className="text-gray-500">No survey responses found for this tool</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {loading && (
          <div className="bg-white border rounded-lg">
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <h3 className="text-lg font-medium mb-2">Loading Data</h3>
              <p className="text-gray-600">Fetching tool details...</p>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isStopDialogOpen} onOpenChange={setIsStopDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Stop Tool</DialogTitle>
            <DialogDescription>
              Are you sure you want to stop submissions for {toolData ? toolData.toolName : ''}? This will close the evaluation and trigger the report generation.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStopDialogOpen(false)} disabled={stoppingTool}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmStop} disabled={stoppingTool}>
              {stoppingTool ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Stopping...
                </>
              ) : (
                'Confirm Stop'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}