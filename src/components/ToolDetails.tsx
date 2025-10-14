// ToolDetails.tsx - Updated component
import { useState, useEffect } from "react";
import { Search, FileText, Calendar, User, MapPin, Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/context/DataContext";
import { getApiUrl } from "@/config/apiConfig";
import { KOBO_CONFIG } from "@/config/koboConfig";
import { Loader } from "@/components/Loader";
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
  const { tools, coordinatorEmail } = useData();
  const [selectedTool, setSelectedTool] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toolData, setToolData] = useState(null);

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

    try {
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

      setToolData({
        toolId,
        toolName: toolInfo[KOBO_CONFIG.TOOL_NAME_FIELD],
        maturity,
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

  const getStatusIcon = (submitted: boolean) => {
    return submitted ?
      <CheckCircle className="h-4 w-4 text-green-600" /> :
      <XCircle className="h-4 w-4 text-gray-400" />;
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground"> 
             {/* className="text-2xl font-semibold text-gray-900 mb-2" */}
            {/* <span style={{ color: "#591fd5" }}>MDII</span>{" "} */}
            {/* <span style={{ color: "#cbced4" }}>|</span>  */}
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
              <h2 className="text-lg font-medium mb-2">{(toolData as any).toolName}</h2>
              <div className="flex gap-2">
                <span className="text-sm text-gray-600">Tool ID: {(toolData as any).toolId}</span>
                <span className="text-sm text-gray-400">•</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  {(toolData as any).maturity.charAt(0).toUpperCase() + (toolData as any).maturity.slice(1)}
                </span>
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
                  <h3 className="text-lg font-medium">Domain Experts</h3>
                  <p className="text-sm text-gray-600">Expert submissions by domain</p>
                </div>
                <div className="p-6">
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
    </div>
  );
}