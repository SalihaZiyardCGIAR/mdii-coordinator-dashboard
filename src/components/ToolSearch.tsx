"use client";

import React, { useState, useEffect } from "react";
import { Search, StopCircle, Loader2, CheckCircle, XCircle, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/context/DataContext";
import { getApiUrl } from "@/config/apiConfig";
import { KOBO_CONFIG } from "@/config/koboConfig";
import DataTable from "./DataTable";

interface Tool {
  id: string;
  name: string;
  status: string;
  ut3Submissions: number;
  ut4Submissions: number;
  coordinator: string;
  maturityLevel: "advanced" | "early" | null;
}

interface ToolSearchProps {
  onToolSelect?: (toolId: string) => void;
}

export const ToolSearch = ({ onToolSelect }: ToolSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("active");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<{ id: string; name: string; maturityLevel: string | null } | null>(null);
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [toolDetails, setToolDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  
  const { tools, setTools, loading, error } = useData();
  const { toast } = useToast();
  const toolsPerPage = 10;

  // Filter tools by status first, then by search query
  const activeTools = tools.filter(tool => tool.status === "active");
  const stoppedTools = tools.filter(tool => tool.status === "stopped");

  const filteredActiveTools = activeTools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.coordinator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStoppedTools = stoppedTools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.coordinator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic based on active tab
  const currentFilteredTools = activeTab === "active" ? filteredActiveTools : filteredStoppedTools;
  const totalPages = Math.ceil(currentFilteredTools.length / toolsPerPage);
  const startIndex = (currentPage - 1) * toolsPerPage;
  const paginatedTools = currentFilteredTools.slice(startIndex, startIndex + toolsPerPage);

  // Fetch tool details
  const fetchToolDetails = async (toolId: string) => {
    setLoadingDetails(true);
    setDetailsError(null);
    setToolDetails(null);

    try {
      const mainRes = await fetch(getApiUrl(`assets/${KOBO_CONFIG.MAIN_FORM_ID}/data.json`, "mainForm"));
      if (!mainRes.ok) throw new Error(`Failed to fetch main form: ${mainRes.statusText}`);
      
      const text = await mainRes.text();
      if (!text) throw new Error("Empty response from main form");

      const mainData = JSON.parse(text);
      const toolInfo = mainData.results.find(r => r[KOBO_CONFIG.TOOL_ID_FIELD] === toolId);
      
      if (!toolInfo) throw new Error("Tool not found");

      const maturity = toolInfo[KOBO_CONFIG.MATURITY_FIELD];
      if (!maturity || (maturity !== 'advance_stage' && maturity !== 'early_stage')) {
        throw new Error(`Invalid maturity level: ${maturity}`);
      }

      const ut3FormId = maturity === 'advance_stage' ? KOBO_CONFIG.USERTYPE3_FORMS.advance_stage : KOBO_CONFIG.USERTYPE3_FORMS.early_stage;
      const ut4FormId = maturity === 'advance_stage' ? KOBO_CONFIG.USERTYPE4_FORMS.advance_stage : KOBO_CONFIG.USERTYPE4_FORMS.early_stage;
      const domainFormId = KOBO_CONFIG.DOMAIN_EXPERT_FORMS[maturity];

      // Fetch all in parallel
      const [innovatorRes, domainRes, ut3DataRes, ut4DataRes, ut3FormRes, ut4FormRes] = await Promise.all([
        Promise.all(Object.entries(KOBO_CONFIG.INNOVATOR_FORMS).map(([, formId]) => fetch(getApiUrl(`assets/${formId}/data.json`, "innovator")))),
        fetch(getApiUrl(`assets/${domainFormId}/data.json`, "domainExperts")),
        fetch(getApiUrl(`assets/${ut3FormId}/data.json`, "ut3")),
        fetch(getApiUrl(`assets/${ut4FormId}/data.json`, "ut4")),
        fetch(getApiUrl(`assets/${ut3FormId}.json`, "ut3Form")),
        fetch(getApiUrl(`assets/${ut4FormId}.json`, "ut4Form"))
      ]);

      // Process innovators
      const innovatorData = await Promise.all(
        innovatorRes.map(async (res, index) => {
          const [role] = Object.entries(KOBO_CONFIG.INNOVATOR_FORMS)[index];
          try {
            if (!res.ok) return { role: role as string, submitted: false, count: 0 };
            const resText = await res.text();
            const data = resText ? JSON.parse(resText) : { results: [] };
            const matching = data.results.filter(r => 
              String(r["group_intro/Q_13110000"] || r["group_requester/Q_13110000"] || "").trim() === toolId
            );
            return { role: role as string, submitted: matching.length > 0, count: matching.length };
          } catch (err) {
            return { role: role as string, submitted: false, count: 0 };
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
          const domainMatching = domainData.results.filter(r => String(r["group_intro/Q_13110000"] || "").trim() === toolId);

          const categorySubmissions = new Map();
          domainMatching.forEach(record => {
            const expertiseString = String(
              maturity === 'early_stage' ? record["group_individualinfo/Q_22300000"] || "" : record["group_intro_001/Q_22300000"] || ""
            ).trim().toLowerCase();

            if (expertiseString) {
              expertiseString.split(/\s+/).forEach(code => {
                const fullName = KOBO_CONFIG.DOMAIN_CODE_MAPPING[code];
                if (fullName) categorySubmissions.set(fullName, (categorySubmissions.get(fullName) || 0) + 1);
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
        console.warn("Error processing domain experts:", err);
      }

      // Process user surveys
      let ut3Data = { results: [] };
      let ut4Data = { results: [] };
      let ut3Form = { content: {} };
      let ut4Form = { content: {} };

      try {
        if (ut3DataRes.ok) {
          const ut3Text = await ut3DataRes.text();
          ut3Data = ut3Text ? JSON.parse(ut3Text) : { results: [] };
        }
        if (ut4DataRes.ok) {
          const ut4Text = await ut4DataRes.text();
          ut4Data = ut4Text ? JSON.parse(ut4Text) : { results: [] };
        }
        if (ut3FormRes.ok) {
          const ut3FormText = await ut3FormRes.text();
          ut3Form = ut3FormText ? JSON.parse(ut3FormText) : { content: {} };
        }
        if (ut4FormRes.ok) {
          const ut4FormText = await ut4FormRes.text();
          ut4Form = ut4FormText ? JSON.parse(ut4FormText) : { content: {} };
        }
      } catch (err) {
        console.warn("Error processing user surveys:", err);
      }

      const getToolId = (sub: any) => String(sub["group_intro/Q_13110000"] || sub["group_requester/Q_13110000"] || sub["Q_13110000"] || "").trim();
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

      setToolDetails({
        toolId,
        toolName: toolInfo[KOBO_CONFIG.TOOL_NAME_FIELD],
        maturity,
        innovators: innovatorData,
        domainExperts: domainExpertData,
        directUsers: { data: ut3Matching, questions: extractQuestions(ut3Form) },
        indirectUsers: { data: ut4Matching, questions: extractQuestions(ut4Form) }
      });
    } catch (err: any) {
      setDetailsError(err.message);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSelectTool = (toolId: string) => {
    setSelectedToolId(toolId);
    fetchToolDetails(toolId);
    
    // Notify parent component of tool selection
    onToolSelect?.(toolId);
  };

  const handleStopTool = (toolId: string, toolName: string, maturityLevel: string | null) => {
    setSelectedTool({ id: toolId, name: toolName, maturityLevel });
    setIsDialogOpen(true);
  };

  const handleConfirmStop = async () => {
    if (!selectedTool) return;

    const currentDateTime = new Date();
    const formattedDateTime = currentDateTime.toLocaleString();
    const isoDateTime = currentDateTime.toISOString();

    try {
      const calculationMethod = selectedTool.maturityLevel === "advanced" ? "MDII Regular Version" : "MDII Exante Version";
      const csvApiUrl = `${import.meta.env.VITE_AZURE_FUNCTION_BASE}/api/score_kobo_tool?code=${import.meta.env.VITE_AZURE_FUNCTION_KEY}&tool_id=${selectedTool.id}&calculation_method=${encodeURIComponent(calculationMethod)}&column_names=column_names`;
      const img = new Image();
      img.src = csvApiUrl;
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      const apiUrl = `/api/score-tool?tool_id=${selectedTool.id}`;
      const response = await fetch(apiUrl);

      if (!response.ok) throw new Error(`Failed to trigger tool stop: ${response.statusText}`);

      setTools((prev: Tool[]) =>
        prev.map((tool) => (tool.id === selectedTool.id ? { ...tool, status: "stopped" } : tool))
      );

      toast({
        title: "Tool Stopped",
        description: `${selectedTool.name} submissions stopped at ${formattedDateTime}. Email will be sent shortly.`,
      });

      setActiveTab("stopped");
      setCurrentPage(1);

    setTimeout(async () => {
      try {
        const flowUrl = "https://default6afa0e00fa1440b78a2e22a7f8c357.d5.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/080a15cb2b9b4387ac23f1a7978a8bbb/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=XlWqhTpqNuxZJkvKeCoWziBX5Vhgtix8zdUq0IF8Npw";
        
        const pdfReportLink = `https://mdii-score-tool-gveza9gtabfbbxh8.eastus2-01.azurewebsites.net/api/report_pdf_generation?tool_id=${selectedTool.id}`;
        
        const payload = {
          tool_id: selectedTool.id,
          tool_name: selectedTool.name,
          tool_maturity: selectedTool.maturityLevel || "unknown",
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
          description: `Email for tool ${selectedTool.id} has been sent with Score report link attached.`,
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

      setIsDialogOpen(false);
    } catch (err: any) {
      console.error("Error stopping tool:", err);
      toast({
        title: "Error",
        description: err.message.includes("Failed to fetch") || err.message.includes("CORS")
          ? "Unable to connect to the server. Please try again later or contact support."
          : `Failed to stop tool: ${err.message}`,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-success/20 text-success border-success/30">Active</Badge>
    ) : (
      <Badge variant="secondary">Stopped</Badge>
    );
  };

  const getStatusIcon = (submitted: boolean) => {
    return submitted ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-gray-400" />;
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Tool Management</h1>
        <p className="text-muted-foreground">Search and manage research tools and control submissions</p>
      </div>

      {/* Search Bar */}
      <Card className="shadow-[var(--shadow-card)] p-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl p-0">
            <Search className="w-4 h-4" />
            Search Tools
          </CardTitle>
          <CardDescription>Find specific tools by name, coordinator, or tool ID</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 p-0" />
            <Input
              type="text"
              placeholder="Search by tool name, coordinator, or tool ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Loading and Error States */}
      {loading && (
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="text-center py-8">
            <p className="text-lg font-medium text-foreground">Loading tools...</p>
          </CardContent>
        </Card>
      )}
      {error && (
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="text-center py-8">
            <p className="text-lg font-medium text-foreground">Error</p>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Tabs for Active and Stopped Tools */}
      {!loading && !error && (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Running Evaluation ({activeTools.length})</TabsTrigger>
            <TabsTrigger value="stopped">Closed Evaluation ({stoppedTools.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4 mt-6">
            {filteredActiveTools.length > 0 ? (
              <>
                <div className="grid gap-4">
                  {paginatedTools.map((tool) => (
                    <Card
                      key={tool.id}
                      className={`shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow cursor-pointer ${
                        selectedToolId === tool.id ? "ring-2 ring-blue-500" : ""
                      }`}
                      onClick={() => handleSelectTool(tool.id)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CardTitle className="text-lg">{tool.name} - {tool.id}</CardTitle>
                            {getStatusBadge(tool.status)}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStopTool(tool.id, tool.name, tool.maturityLevel);
                              }}
                              className="gap-2"
                            >
                              <StopCircle className="w-4 h-4" />
                              Stop
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>

                {filteredActiveTools.length > toolsPerPage && (
                  <div className="flex items-center justify-between mt-4">
                    <Button variant="outline" disabled={currentPage === 1} onClick={handlePreviousPage}>
                      Previous
                    </Button>
                    <span className="text-muted-foreground">Page {currentPage} of {totalPages}</span>
                    <Button variant="outline" disabled={currentPage === totalPages} onClick={handleNextPage}>
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <Card className="shadow-[var(--shadow-card)]">
                <CardContent className="text-center py-8">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium text-foreground">No active tools found</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="stopped" className="space-y-4 mt-6">
            {filteredStoppedTools.length > 0 ? (
              <>
                <div className="grid gap-4">
                  {paginatedTools.map((tool) => (
                    <Card
                      key={tool.id}
                      className={`shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow cursor-pointer ${
                        selectedToolId === tool.id ? "ring-2 ring-blue-500" : ""
                      }`}
                      onClick={() => handleSelectTool(tool.id)}
                    >
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-lg">{tool.name} - {tool.id}</CardTitle>
                          {getStatusBadge(tool.status)}
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>

                {filteredStoppedTools.length > toolsPerPage && (
                  <div className="flex items-center justify-between mt-4">
                    <Button variant="outline" disabled={currentPage === 1} onClick={handlePreviousPage}>
                      Previous
                    </Button>
                    <span className="text-muted-foreground">Page {currentPage} of {totalPages}</span>
                    <Button variant="outline" disabled={currentPage === totalPages} onClick={handleNextPage}>
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <Card className="shadow-[var(--shadow-card)]">
                <CardContent className="text-center py-8">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium text-foreground">No stopped tools found</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Tool Details Section */}
      {selectedToolId && (
        <div className="space-y-6 pt-6 border-t">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Tool Details</h2>
            <Button variant="outline" onClick={() => { setSelectedToolId(null); setToolDetails(null); }}>
              Clear
            </Button>
          </div>

          {loadingDetails && (
            <Card>
              <CardContent className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-lg font-medium">Loading details...</p>
              </CardContent>
            </Card>
          )}

          {detailsError && (
            <Card className="border-l-4 border-l-destructive">
              <CardContent className="py-4">
                <p className="text-destructive font-semibold">Error: {detailsError}</p>
              </CardContent>
            </Card>
          )}

          {toolDetails && !loadingDetails && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>{(toolDetails as any).toolName}</CardTitle>
                  <CardDescription>ID: {(toolDetails as any).toolId} • Maturity: {(toolDetails as any).maturity}</CardDescription>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Innovators Team</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {(toolDetails as any).innovators.map((i: any) => (
                      <div key={i.role} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(i.submitted)}
                          <span className="text-sm">{i.role}</span>
                        </div>
                        <span className={`text-sm font-medium ${i.submitted ? "text-green-600" : "text-gray-500"}`}>
                          {i.submitted ? `Submitted (${i.count})` : "Not Submitted"}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Domain Experts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {(toolDetails as any).domainExperts.map((e: any) => (
                      <div key={e.category} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(e.submitted)}
                          <span className="text-sm">{e.category}</span>
                        </div>
                        <span className={`text-sm font-medium ${e.submitted ? "text-green-600" : "text-gray-500"}`}>
                          {e.submitted ? `Submitted (${e.count})` : "Not Submitted"}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {(toolDetails as any).innovators.filter((i: any) => i.submitted).length}/{(toolDetails as any).innovators.length}
                      </div>
                      <div className="text-sm text-gray-600">Innovators</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {(toolDetails as any).domainExperts.filter((e: any) => e.submitted).length}/{(toolDetails as any).domainExperts.length}
                      </div>
                      <div className="text-sm text-gray-600">Domain Experts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{(toolDetails as any).directUsers.data.length}</div>
                      <div className="text-sm text-gray-600">Direct Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{(toolDetails as any).indirectUsers.data.length}</div>
                      <div className="text-sm text-gray-600">Indirect Users</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {((toolDetails as any).directUsers.data.length > 0 || (toolDetails as any).indirectUsers.data.length > 0) && (
                <Card>
                  <CardHeader>
                    <CardTitle>User Survey Responses</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {(toolDetails as any).directUsers.data.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-4">Direct Users ({(toolDetails as any).directUsers.data.length})</h4>
                        <DataTable data={(toolDetails as any).directUsers.data} questions={(toolDetails as any).directUsers.questions} />
                      </div>
                    )}
                    {(toolDetails as any).indirectUsers.data.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-4">Indirect Users ({(toolDetails as any).indirectUsers.data.length})</h4>
                        <DataTable data={(toolDetails as any).indirectUsers.data} questions={(toolDetails as any).indirectUsers.questions} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Stop</DialogTitle>
            <DialogDescription>Are you sure you want to stop submissions for {selectedTool?.name}?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmStop}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};