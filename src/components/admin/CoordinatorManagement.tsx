import React, { useState, useEffect } from "react";
import { Search, Mail, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KOBO_CONFIG } from "@/config/koboConfig";
import { getApiUrl } from "@/config/apiConfig";

interface Coordinator {
  email: string;
  name: string;
  totalTools: number;
  completedTools: number;
  completedToolIds: string[];
}

export default function CoordinatorManagement() {
  const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCoordinator, setSelectedCoordinator] = useState<Coordinator | null>(null);

  const coordinatorsPerPage = 10;

  useEffect(() => {
    fetchCoordinators();
  }, []);

  const fetchCoordinators = async () => {
    try {
      setLoading(true);
      
      // Fetch main form
      const mainRes = await fetch(getApiUrl(`assets/${KOBO_CONFIG.MAIN_FORM_ID}/data.json`, "mainForm"));
      if (!mainRes.ok) throw new Error("Failed to fetch main form");
      const mainData = await mainRes.json();
      const mainSubs = mainData.results || [];

      // Fetch change coordinator form
      const changeRes = await fetch(getApiUrl(`assets/${KOBO_CONFIG.change_coordinator}/data.json`, "changeCoordinator"));
      if (!changeRes.ok) throw new Error("Failed to fetch change form");
      const changeData = await changeRes.json();
      const changeSubs = changeData.results || [];

      // Sort change submissions by submission time
      changeSubs.sort((a: any, b: any) => 
        new Date(a._submission_time).getTime() - new Date(b._submission_time).getTime()
      );

      // Build current coordinators map
      const currentCoord: { [key: string]: string } = {};
      const toolInfo: { [key: string]: { maturity: string; name: string; status: string } } = {};

      mainSubs.forEach((sub: any) => {
        const toolId = sub[KOBO_CONFIG.TOOL_ID_FIELD];
        if (sub.coordinator_email) {
          currentCoord[toolId] = sub.coordinator_email;
          toolInfo[toolId] = {
            maturity: sub[KOBO_CONFIG.MATURITY_FIELD] || "unknown",
            name: sub[KOBO_CONFIG.TOOL_NAME_FIELD] || "Unknown",
            status: "active"
          };
        }
      });

      // Update with change coordinator submissions
      changeSubs.forEach((ch: any) => {
        const toolId = ch.tool_id;
        const newEmail = ch.Email_of_the_Coordinator;
        if (toolId && newEmail) {
          currentCoord[toolId] = newEmail;
        }
      });

      // Fetch evaluation forms to determine completed tools
      const evalSubs: any = {
        advanced3: [],
        early3: [],
        advanced4: [],
        early4: [],
      };

      const formMap = {
        advanced3: { id: KOBO_CONFIG.USERTYPE3_FORMS.advance_stage, label: "advanced3" },
        early3: { id: KOBO_CONFIG.USERTYPE3_FORMS.early_stage, label: "early3" },
        advanced4: { id: KOBO_CONFIG.USERTYPE4_FORMS.advance_stage, label: "advanced4" },
        early4: { id: KOBO_CONFIG.USERTYPE4_FORMS.early_stage, label: "early4" },
      };

      for (const key in formMap) {
        const { id: fid, label } = formMap[key as keyof typeof formMap];
        try {
          const res = await fetch(getApiUrl(`assets/${fid}/data.json`, label));
          if (res.ok) {
            const data = await res.json();
            evalSubs[key as keyof typeof evalSubs] = data.results || [];
          }
        } catch (err) {
          console.warn(`Failed to fetch form ${key}:`, err);
        }
      }

      // Helper to extract tool_id from evaluation submissions
      const getToolId = (sub: any): string => {
        return String(
          sub["group_intro/Q_13110000"] ||
          sub["group_requester/Q_13110000"] ||
          sub["Q_13110000"] ||
          sub.tool_id ||
          ""
        ).trim();
      };

      // Create sets of tool_ids with submissions
      const advanced3 = new Set(evalSubs.advanced3.map(getToolId));
      const early3 = new Set(evalSubs.early3.map(getToolId));
      const advanced4 = new Set(evalSubs.advanced4.map(getToolId));
      const early4 = new Set(evalSubs.early4.map(getToolId));

      // Determine tool status and collect completed tool IDs
      const completedToolIdsMap: { [key: string]: string[] } = {};
      Object.keys(toolInfo).forEach((toolId) => {
        const maturity = toolInfo[toolId].maturity;
        let has3 = false;
        let has4 = false;

        if (maturity === "advance_stage" || maturity === "advanced") {
          has3 = advanced3.has(toolId);
          has4 = advanced4.has(toolId);
        } else if (maturity === "early_stage" || maturity === "early") {
          has3 = early3.has(toolId);
          has4 = early4.has(toolId);
        }

        if (has3 && has4) {
          toolInfo[toolId].status = "stopped";
          const email = currentCoord[toolId];
          if (email) {
            if (!completedToolIdsMap[email]) completedToolIdsMap[email] = [];
            completedToolIdsMap[email].push(toolId);
          }
        }
      });

      // Process coordinators
      const coordinatorMap = new Map<string, Coordinator>();

      Object.entries(currentCoord).forEach(([toolId, email]) => {
        if (!email) return;

        const name = extractNameFromEmail(email);
        const tool = toolInfo[toolId];

        if (!coordinatorMap.has(email)) {
          coordinatorMap.set(email, {
            email,
            name,
            totalTools: 0,
            completedTools: 0,
            completedToolIds: completedToolIdsMap[email] || [],
          });
        }

        const coord = coordinatorMap.get(email)!;
        coord.totalTools++;

        if (tool.status === "stopped") {
          coord.completedTools++;
        }
      });

      const coordinatorList = Array.from(coordinatorMap.values());
      setCoordinators(coordinatorList);
    } catch (error) {
      console.error('Error fetching coordinators:', error);
    } finally {
      setLoading(false);
    }
  };

  const extractNameFromEmail = (email: string): string => {
    const namePart = email.split('@')[0];
    const parts = namePart.split(/[._]/);
    if (parts.length >= 2) {
      const lastName = parts[parts.length - 1];
      const firstName = parts.slice(0, -1).join(' ');
      return `${capitalize(lastName)} ${capitalize(firstName)}`;
    }
    return capitalize(namePart);
  };

  const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const filteredCoordinators = coordinators.filter(
    (coord) =>
      coord.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coord.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCoordinators.length / coordinatorsPerPage);
  const startIndex = (currentPage - 1) * coordinatorsPerPage;
  const paginatedCoordinators = filteredCoordinators.slice(startIndex, startIndex + coordinatorsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleEmailClick = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleCompletedClick = (coordinator: Coordinator) => {
    setSelectedCoordinator(coordinator);
  };

  const closeModal = () => {
    setSelectedCoordinator(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Coordinator Management</h1>
        <p className="text-muted-foreground text-sm">View and contact research coordinators</p>
      </div>

      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="w-4 h-4" />
            Search Coordinators
          </CardTitle>
          <CardDescription className="text-sm">Find coordinators by name or email</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search by name or email..."
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
            <p className="text-sm font-medium text-foreground">Loading coordinators...</p>
          </CardContent>
        </Card>
      )}

      {!loading && (
        <>
          {filteredCoordinators.length > 0 ? (
            <>
              <Card className="shadow-[var(--shadow-card)]">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50 border-b">
                        <tr>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Tools Managed</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Completed</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedCoordinators.map((coordinator, index) => (
                          <tr 
                            key={coordinator.email}
                            className={`border-b hover:bg-muted/30 transition-colors ${
                              index % 2 === 0 ? 'bg-background' : 'bg-muted/10'
                            }`}
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{coordinator.name}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {coordinator.completedTools}/{coordinator.totalTools}
                                </Badge>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-sm font-mono text-muted-foreground">{coordinator.email}</span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="text-sm font-bold">{coordinator.totalTools}</span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span
                                className="text-sm font-bold text-green-600 cursor-pointer underline"
                                onClick={() => handleCompletedClick(coordinator)}
                              >
                                {coordinator.completedTools}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEmailClick(coordinator.email)}
                                className="gap-2"
                              >
                                <Mail className="h-3 w-3" />
                                Email
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {filteredCoordinators.length > coordinatorsPerPage && (
                <div className="flex items-center justify-between pt-2">
                  <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={handlePreviousPage}>
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages} • {filteredCoordinators.length} coordinators
                  </span>
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
                <p className="text-base font-medium text-foreground">No coordinators found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {searchQuery ? "Try adjusting your search query" : "No coordinators available"}
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Modal for Completed Tool IDs */}
      {selectedCoordinator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Completed Tools for {selectedCoordinator.name}</h2>
            <ul className="list-disc pl-5">
              {selectedCoordinator.completedToolIds.length > 0 ? (
                selectedCoordinator.completedToolIds.map((toolId) => (
                  <li key={toolId} className="text-sm text-foreground">{toolId}</li>
                ))
              ) : (
                <li className="text-sm text-muted-foreground">No completed tools found.</li>
              )}
            </ul>
            <Button onClick={closeModal} className="mt-4">Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}