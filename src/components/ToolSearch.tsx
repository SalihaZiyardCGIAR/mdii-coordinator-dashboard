"use client";

import React, { useState } from "react";
import { Search, Loader2, CheckCircle, XCircle, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useData } from "@/context/DataContext";
import DataTable from "./DataTable";
import { fetchToolDetails, ToolDetailsData } from "@/context/toolUtils";

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
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [toolDetails, setToolDetails] = useState<ToolDetailsData | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  
  const { tools, loading, error } = useData();
  const toolsPerPage = 10;

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

  const currentFilteredTools = activeTab === "active" ? filteredActiveTools : filteredStoppedTools;
  const totalPages = Math.ceil(currentFilteredTools.length / toolsPerPage);
  const startIndex = (currentPage - 1) * toolsPerPage;
  const paginatedTools = currentFilteredTools.slice(startIndex, startIndex + toolsPerPage);

  const handleSelectTool = async (toolId: string) => {
    setSelectedToolId(toolId);
    setLoadingDetails(true);
    setDetailsError(null);
    setToolDetails(null);

    try {
      const data = await fetchToolDetails(toolId, tools);
      setToolDetails(data);
      onToolSelect?.(toolId);
    } catch (err: any) {
      setDetailsError(err.message);
    } finally {
      setLoadingDetails(false);
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
    setSelectedToolId(null);
    setToolDetails(null);
    setDetailsError(null);
  };

  return (
    <div className="space-y-4 relative">
      {loadingDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <p className="text-lg font-medium text-gray-800">Loading tool details...</p>
          </div>
        </div>
      )}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Tool Management</h1>
        <p className="text-muted-foreground text-sm">Search and manage research tools</p>
      </div>

      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="w-4 h-4" />
            Search Tools
          </CardTitle>
          <CardDescription className="text-sm">Find specific tools by name, coordinator, or tool ID</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
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

      {loading && (
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="text-center py-6">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
            <p className="text-sm font-medium text-foreground">Loading tools...</p>
          </CardContent>
        </Card>
      )}
      {error && (
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="text-center py-6">
            <p className="text-sm font-medium text-foreground">Error</p>
            <p className="text-muted-foreground text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Running Evaluation ({activeTools.length})</TabsTrigger>
            <TabsTrigger value="stopped">Closed Evaluation ({stoppedTools.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-3 mt-4">
            {filteredActiveTools.length > 0 ? (
              <>
                <div className="grid gap-3">
                  {paginatedTools.map((tool) => (
                    <Card
                      key={tool.id}
                      className={`shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow cursor-pointer ${
                        selectedToolId === tool.id ? "ring-2 ring-blue-500" : ""
                      }`}
                      onClick={() => handleSelectTool(tool.id)}
                    >
                      <CardHeader className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-base font-medium">{tool.name} - {tool.id}</CardTitle>
                          {getStatusBadge(tool.status)}
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>

                {filteredActiveTools.length > toolsPerPage && (
                  <div className="flex items-center justify-between pt-2">
                    <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={handlePreviousPage}>
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
                    <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={handleNextPage}>
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <Card className="shadow-[var(--shadow-card)]">
                <CardContent className="text-center py-8">
                  <Search className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-base font-medium text-foreground">No active tools found</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="stopped" className="space-y-3 mt-4">
            {filteredStoppedTools.length > 0 ? (
              <>
                <div className="grid gap-3">
                  {paginatedTools.map((tool) => (
                    <Card
                      key={tool.id}
                      className={`shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow cursor-pointer ${
                        selectedToolId === tool.id ? "ring-2 ring-blue-500" : ""
                      }`}
                      onClick={() => handleSelectTool(tool.id)}
                    >
                      <CardHeader className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-base font-medium">{tool.name} - {tool.id}</CardTitle>
                          {getStatusBadge(tool.status)}
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>

                {filteredStoppedTools.length > toolsPerPage && (
                  <div className="flex items-center justify-between pt-2">
                    <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={handlePreviousPage}>
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
                    <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={handleNextPage}>
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <Card className="shadow-[var(--shadow-card)]">
                <CardContent className="text-center py-8">
                  <Search className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-base font-medium text-foreground">No stopped tools found</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}

      {selectedToolId && !loadingDetails && (
        <div className="space-y-6 pt-6 border-t">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Tool Details</h2>
            <Button variant="outline" onClick={() => { setSelectedToolId(null); setToolDetails(null); }}>
              Clear
            </Button>
          </div>

          {detailsError && (
            <Card className="border-l-4 border-l-destructive">
              <CardContent className="py-4">
                <p className="text-destructive font-semibold">Error: {detailsError}</p>
              </CardContent>
            </Card>
          )}

          {toolDetails && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>{toolDetails.toolName}</CardTitle>
                  <CardDescription>ID: {toolDetails.toolId} • Maturity: {toolDetails.maturity}</CardDescription>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Innovators Team</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {toolDetails.innovators.map((i) => (
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
                    {toolDetails.domainExperts.map((e) => (
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
                        {toolDetails.innovators.filter((i) => i.submitted).length}/{toolDetails.innovators.length}
                      </div>
                      <div className="text-sm text-gray-600">Innovators</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {toolDetails.domainExperts.filter((e) => e.submitted).length}/{toolDetails.domainExperts.length}
                      </div>
                      <div className="text-sm text-gray-600">Domain Experts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{toolDetails.directUsers.data.length}</div>
                      <div className="text-sm text-gray-600">Direct Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{toolDetails.indirectUsers.data.length}</div>
                      <div className="text-sm text-gray-600">Indirect Users</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {(toolDetails.directUsers.data.length > 0 || toolDetails.indirectUsers.data.length > 0) && (
                <Card>
                  <CardHeader>
                    <CardTitle>User Survey Responses</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {toolDetails.directUsers.data.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-4">Direct Users ({toolDetails.directUsers.data.length})</h4>
                        <DataTable data={toolDetails.directUsers.data} questions={toolDetails.directUsers.questions} />
                      </div>
                    )}
                    {toolDetails.indirectUsers.data.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-4">Indirect Users ({toolDetails.indirectUsers.data.length})</h4>
                        <DataTable data={toolDetails.indirectUsers.data} questions={toolDetails.indirectUsers.questions} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};