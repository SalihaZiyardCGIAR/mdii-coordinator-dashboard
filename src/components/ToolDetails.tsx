// ToolDetails.tsx - Updated component with Stop functionality
import { useState, useEffect } from "react";
import { Search, FileText, Calendar, User, MapPin, Loader2, CheckCircle, XCircle, AlertCircle, StopCircle } from "lucide-react";
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

interface ToolDetailsProps {
  toolId?: string | null;
}

interface ToolDetailsData {
  id: string;
  name: string;
  coordinator: string;
  status: string;
  createdDate: string;
  location: string;
  description: string;
  submissions: {
    ut3: Submission[];
    ut4: Submission[];
    general: Submission[];
  };
}

interface Submission {
  id: string;
  submittedBy: string;
  submissionDate: string;
  responses: { [key: string]: string };
}

export function ToolDetails({ toolId: propToolId }: ToolDetailsProps) {
  const { tools, coordinatorEmail, setTools } = useData();
  const { toast } = useToast();
  const [selectedTool, setSelectedTool] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toolData, setToolData] = useState(null);
  const [isStopDialogOpen, setIsStopDialogOpen] = useState(false);
  const [stoppingTool, setStoppingTool] = useState(false);
  const [domainExpertsAssigned, setDomainExpertsAssigned] = useState(false);
  const [checkingAssignment, setCheckingAssignment] = useState(false);

  // Auto-load tool if toolId prop is provided
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
      // Check if domain experts have been assigned by checking all three assignment forms
      const assignmentFormIds = [
        'ap6dUEDwX7KUsKLFZUD7kb', // regular
        'au52CRd6ATzV7S36WcAdDu', // exante
        'aDrD6ZuThQweedHFoogbi4'  // assignment form
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
      // Fetch maturity level
      const mainRes = await fetch(getApiUrl(`assets/${KOBO_CONFIG.MAIN_FORM_ID}/data.json`, "mainForm"));
      
      if (!mainRes.ok) {
        throw new Error(`Failed to fetch main form: ${mainRes.statusText}`);
      }

      const text = await mainRes.text();
      if (!text) {
        throw new Error("Empty response from main form");
      }

      const mainData = JSON.parse(text);
      const toolInfo = mainData.results.find(r => r[KOBO_CONFIG.TOOL_ID_FIELD] === toolId);
      
      if (!toolInfo) {
        throw new Error("Tool not found");
      }

      const maturity = toolInfo[KOBO_CONFIG.MATURITY_FIELD];
      if (!maturity || (maturity !== 'advance_stage' && maturity !== 'early_stage')) {
        throw new Error(`Invalid maturity level: ${maturity}. Expected 'advance_stage' or 'early_stage'`);
      }

      // Prepare form IDs
      const ut3FormId = maturity === 'advance_stage' ? KOBO_CONFIG.USERTYPE3_FORMS.advance_stage : KOBO_CONFIG.USERTYPE3_FORMS.early_stage;
      const ut4FormId = maturity === 'advance_stage' ? KOBO_CONFIG.USERTYPE4_FORMS.advance_stage : KOBO_CONFIG.USERTYPE4_FORMS.early_stage;
      const domainFormId = KOBO_CONFIG.DOMAIN_EXPERT_FORMS[maturity];

      // Fetch all data in parallel using Promise.all for better performance
      const [innovatorRes, domainRes, ut3DataRes, ut4DataRes, ut3FormRes, ut4FormRes] = await Promise.all([
        // Innovator forms - all at once
        Promise.all(
          Object.entries(KOBO_CONFIG.INNOVATOR_FORMS).map(([role, formId]) =>
            fetch(getApiUrl(`assets/${formId}/data.json`, role))
          )
        ),
        // Domain experts
        fetch(getApiUrl(`assets/${domainFormId}/data.json`, "domainExperts")),
        // User surveys data
        fetch(getApiUrl(`assets/${ut3FormId}/data.json`, "ut3")),
        fetch(getApiUrl(`assets/${ut4FormId}/data.json`, "ut4")),
        // Form structures
        fetch(getApiUrl(`assets/${ut3FormId}.json`, "ut3Form")),
        fetch(getApiUrl(`assets/${ut4FormId}.json`, "ut4Form"))
      ]);

      // Process innovator forms
      const innovatorData = await Promise.all(
        innovatorRes.map(async (res, index) => {
          const [role] = Object.entries(KOBO_CONFIG.INNOVATOR_FORMS)[index];
          try {
            if (!res.ok) {
              console.warn(`Failed to fetch ${role} form: ${res.statusText}`);
              return {
                role: role === 'projectManager' ? 'Project Manager' : 
                      role === 'leadership' ? 'Leadership' : 
                      role === 'technical' ? 'Technical' : role,
                submitted: false,
                count: 0
              };
            }
            const text = await res.text();
            const data = text ? JSON.parse(text) : { results: [] };
            const matching = data.results.filter(r => 
              String(r["group_intro/Q_13110000"] || r["group_requester/Q_13110000"] || "").trim() === toolId
            );
            return {
              role: role === 'projectManager' ? 'Project Manager' : 
                    role === 'leadership' ? 'Leadership' : 
                    role === 'technical' ? 'Technical' : role,
              submitted: matching.length > 0,
              count: matching.length
            };
          } catch (err) {
            console.error(`Error processing ${role}:`, err);
            return {
              role: role === 'projectManager' ? 'Project Manager' : 
                    role === 'leadership' ? 'Leadership' : 
                    role === 'technical' ? 'Technical' : role,
              submitted: false,
              count: 0
            };
          }
        })
      );

      // Process domain experts
      let domainExpertData = KOBO_CONFIG.DOMAIN_CATEGORIES[maturity].map(category => ({
        category,
        submitted: false,
        count: 0
      }));

      try {
        if (domainRes.ok) {
          const domainText = await domainRes.text();
          const domainData = domainText ? JSON.parse(domainText) : { results: [] };
          const domainMatching = domainData.results.filter(r =>
            String(r["group_intro/Q_13110000"] || "").trim() === toolId
          );

          const categorySubmissions = new Map();
          domainMatching.forEach(record => {
            const expertiseString = String(
              maturity === 'early_stage'
                ? record["group_individualinfo/Q_22300000"] || ""
                : record["group_intro_001/Q_22300000"] || ""
            ).trim().toLowerCase();

            if (expertiseString) {
              const codes = expertiseString.split(/\s+/);
              codes.forEach(code => {
                const fullName = KOBO_CONFIG.DOMAIN_CODE_MAPPING[code];
                if (fullName) {
                  categorySubmissions.set(fullName, (categorySubmissions.get(fullName) || 0) + 1);
                }
              });
            }
          });

          domainExpertData = KOBO_CONFIG.DOMAIN_CATEGORIES[maturity].map(category => ({
            category,
            submitted: categorySubmissions.has(category),
            count: categorySubmissions.get(category) || 0
          }));
        }
      } catch (err) {
        console.warn("Error processing domain expert data:", err);
      }

      // Process user survey data
      let ut3Data = { results: [] };
      let ut4Data = { results: [] };

      try {
        if (ut3DataRes.ok) {
          const ut3Text = await ut3DataRes.text();
          ut3Data = ut3Text ? JSON.parse(ut3Text) : { results: [] };
        } else {
          console.warn(`UT3 data not found (${ut3DataRes.status})`);
        }
      } catch (err) {
        console.warn("Error processing UT3 data:", err);
      }

      try {
        if (ut4DataRes.ok) {
          const ut4Text = await ut4DataRes.text();
          ut4Data = ut4Text ? JSON.parse(ut4Text) : { results: [] };
        } else {
          console.warn(`UT4 data not found (${ut4DataRes.status})`);
        }
      } catch (err) {
        console.warn("Error processing UT4 data:", err);
      }

      // Process form structures
      let ut3Form = { content: {} };
      let ut4Form = { content: {} };

      try {
        if (ut3FormRes.ok) {
          const ut3FormText = await ut3FormRes.text();
          ut3Form = ut3FormText ? JSON.parse(ut3FormText) : { content: {} };
        } else {
          console.warn(`UT3 form structure not found (${ut3FormRes.status})`);
        }
      } catch (err) {
        console.warn("Error processing UT3 form structure:", err);
      }

      try {
        if (ut4FormRes.ok) {
          const ut4FormText = await ut4FormRes.text();
          ut4Form = ut4FormText ? JSON.parse(ut4FormText) : { content: {} };
        } else {
          console.warn(`UT4 form structure not found (${ut4FormRes.status})`);
        }
      } catch (err) {
        console.warn("Error processing UT4 form structure:", err);
      }

      const getToolId = (sub: any) => String(
        sub["group_intro/Q_13110000"] ||
        sub["group_requester/Q_13110000"] ||
        sub["Q_13110000"] ||
        ""
      ).trim();

      const ut3Matching = ut3Data.results.filter(r => getToolId(r) === toolId);
      const ut4Matching = ut4Data.results.filter(r => getToolId(r) === toolId);

      const extractQuestions = (form: any) => {
        const questions = [];
        const content = form.content?.survey || [];
        content.forEach((item: any) => {
          if (item.type && item.name && !item.name.startsWith('_')) {
            questions.push({
              name: item.name,
              label: item.label?.[0] || item.label || item.name,
              type: item.type,
              choices: item.select_from_list_name ? 
                (form.content?.choices?.[item.select_from_list_name] || []).map((c: any) => ({
                  name: c.name,
                  label: c.label?.[0] || c.label || c.name
                })) : []
            });
          }
        });
        return questions;
      };

      // Get tool status from tools array
      const currentTool = tools.find(t => t.id === toolId);
      const toolStatus = currentTool?.status || 'active';

      setToolData({
        toolId,
        toolName: toolInfo[KOBO_CONFIG.TOOL_NAME_FIELD],
        maturity,
        status: toolStatus,
        innovators: innovatorData,
        domainExperts: domainExpertData,
        directUsers: {
          data: ut3Matching,
          questions: extractQuestions(ut3Form)
        },
        indirectUsers: {
          data: ut4Matching,
          questions: extractQuestions(ut4Form)
        }
      });
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
      const calculationMethod = (toolData as any).maturity === "advance_stage" ? "MDII Regular Version" : "MDII Exante Version";
      const csvApiUrl = `${import.meta.env.VITE_AZURE_FUNCTION_BASE}/api/score_kobo_tool?code=${import.meta.env.VITE_AZURE_FUNCTION_KEY}&tool_id=${(toolData as any).toolId}&calculation_method=${encodeURIComponent(calculationMethod)}&column_names=column_names`;
      const img = new Image();
      img.src = csvApiUrl;
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      const apiUrl = `/api/score-tool?tool_id=${(toolData as any).toolId}`;
      const response = await fetch(apiUrl);

      if (!response.ok) throw new Error(`Failed to trigger tool stop: ${response.statusText}`);

      setTools((prev) =>
        prev.map((tool) => (tool.id === (toolData as any).toolId ? { ...tool, status: "stopped" } : tool))
      );

      // Update local toolData status
      setToolData((prev: any) => ({ ...prev, status: "stopped" }));

      toast({
        title: "Tool Stopped",
        description: `${(toolData as any).toolName} submissions stopped at ${formattedDateTime}. Email will be sent shortly.`,
      });

      setTimeout(async () => {
        try {
          const flowUrl = "https://default6afa0e00fa1440b78a2e22a7f8c357.d5.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/080a15cb2b9b4387ac23f1a7978a8bbb/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=XlWqhTpqNuxZJkvKeCoWziBX5Vhgtix8zdUq0IF8Npw";
          
          const pdfReportLink = `https://mdii-score-tool-gveza9gtabfbbxh8.eastus2-01.azurewebsites.net/api/report_pdf_generation?tool_id=${(toolData as any).toolId}`;
          
          const payload = {
            tool_id: (toolData as any).toolId,
            tool_name: (toolData as any).toolName,
            tool_maturity: (toolData as any).maturity || "unknown",
            stopped_at: formattedDateTime,
            stopped_at_iso: isoDateTime,
            timestamp: currentDateTime.getTime(),
            pdf_report_link: pdfReportLink
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
            description: `Email for tool ${(toolData as any).toolId} has been sent with Score report link attached.`,
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
    
    // Open KoboToolbox form with pre-filled tool ID
    const toolId = (toolData as any).toolId;
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
                  <h2 className="text-lg font-medium mb-2">{(toolData as any).toolName}</h2>
                  <div className="flex gap-2">
                    <span className="text-sm text-gray-600">Tool ID: {(toolData as any).toolId}</span>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {(toolData as any).maturity.charAt(0).toUpperCase() + (toolData as any).maturity.slice(1)}
                    </span>
                    <span className="text-sm text-gray-400">•</span>
                    <Badge className={(toolData as any).status === "active" ? "bg-success/20 text-success border-success/30" : ""} variant={(toolData as any).status === "stopped" ? "secondary" : "default"}>
                      {(toolData as any).status === "active" ? "Active" : "Stopped"}
                    </Badge>
                  </div>
                </div>
                {(toolData as any).status === "active" && (
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
                    {(toolData as any).innovators.map((innovator: any) => (
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
                      {(toolData as any).domainExperts.map((expert: any) => (
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
                      {(toolData as any).innovators.filter((i: any) => i.submitted).length}/{(toolData as any).innovators.length}
                    </div>
                    <div className="text-sm text-gray-600">Innovators</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-gray-900 mb-1">
                      {(toolData as any).domainExperts.filter((e: any) => e.submitted).length}/{(toolData as any).domainExperts.length}
                    </div>
                    <div className="text-sm text-gray-600">Domain Experts</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-gray-900 mb-1">
                      {(toolData as any).directUsers.data.length}
                    </div>
                    <div className="text-sm text-gray-600">Direct Users</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-gray-900 mb-1">
                      {(toolData as any).indirectUsers.data.length}
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

              {(toolData as any).directUsers.data.length > 0 && (
                <div className="bg-white border rounded-lg">
                  <div className="px-6 py-4 border-b">
                    <h3 className="text-lg font-medium">Direct Users</h3>
                    <p className="text-sm text-gray-600">{(toolData as any).directUsers.data.length} responses</p>
                  </div>
                  <div className="p-6">
                    <DataTable 
                      data={(toolData as any).directUsers.data} 
                      questions={(toolData as any).directUsers.questions}
                    />
                  </div>
                </div>
              )}

              {(toolData as any).indirectUsers.data.length > 0 && (
                <div className="bg-white border rounded-lg">
                  <div className="px-6 py-4 border-b">
                    <h3 className="text-lg font-medium">Indirect Users</h3>
                    <p className="text-sm text-gray-600">{(toolData as any).indirectUsers.data.length} responses</p>
                  </div>
                  <div className="p-6">
                    <DataTable 
                      data={(toolData as any).indirectUsers.data} 
                      questions={(toolData as any).indirectUsers.questions}
                    />
                  </div>
                </div>
              )}

              {(toolData as any).directUsers.data.length === 0 && (toolData as any).indirectUsers.data.length === 0 && (
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

      {/* Stop Confirmation Dialog */}
      <Dialog open={isStopDialogOpen} onOpenChange={setIsStopDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Stop Tool</DialogTitle>
            <DialogDescription>
              Are you sure you want to stop submissions for {toolData ? (toolData as any).toolName : ''}? This will close the evaluation and trigger the report generation.
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