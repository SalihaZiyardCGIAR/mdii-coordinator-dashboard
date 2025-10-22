import React, { createContext, useContext, useState, useEffect } from "react";
import { KOBO_CONFIG } from "@/config/koboConfig";
import { getApiUrl } from "@/config/apiConfig";

// Define interfaces
interface Submission {
  tool_id?: string;
  _submission_time: string;
  coordinator_email?: string;
  Email_of_the_Coordinator?: string;
  [key: string]: any;
}

interface EvalSubs {
  advanced3: Submission[];
  early3: Submission[];
  advanced4: Submission[];
  early4: Submission[];
}

interface Tool {
  id: string;
  name: string;
  status: "active" | "stopped";
  ut3Submissions: number;
  ut4Submissions: number;
  coordinator: string;
  maturityLevel: "advanced" | "early" | null;
  dateSubmitted?: string;
}

interface Activity {
  id: string;
  tool: string;
  status: "active" | "stopped";
  date: string;
  coordinator: string;
}

interface Stats {
  totalTools: number;
  appointedTools: number;
  evaluatedTools: number;
  ongoingTools: number;
  completionRate: number;
}

interface DataContextType {
  stats: Stats;
  recentActivity: Activity[];
  tools: Tool[];
  allTools: Tool[];
  coordinatorEmail: string;
  isAdmin: boolean;
  setData: (data: {
    mainSubs: Submission[];
    changeSubs: Submission[];
    evalSubs: EvalSubs;
    coordinatorEmail: string;
    isAdmin?: boolean;
  }) => void;
  setTools: (tools: Tool[] | ((prev: Tool[]) => Tool[])) => void;
  fetchData: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<Stats>({
    totalTools: 0,
    appointedTools: 0,
    evaluatedTools: 0,
    ongoingTools: 0,
    completionRate: 0,
  });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [allTools, setAllTools] = useState<Tool[]>([]);
  const [coordinatorEmail, setCoordinatorEmail] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("coordinatorEmail");
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    if (email) {
      setCoordinatorEmail(email);
      setIsAdmin(adminStatus);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch main form
      const mainRes = await fetch(getApiUrl(`assets/${KOBO_CONFIG.MAIN_FORM_ID}/data.json`, "mainForm"));
      if (!mainRes.ok) throw new Error("Failed to fetch main form");
      const mainData = await mainRes.json();
      const mainSubs: Submission[] = mainData.results || [];

      // Fetch change coordinator form
      const changeRes = await fetch(getApiUrl(`assets/${KOBO_CONFIG.change_coordinator}/data.json`, "changeCoordinator"));
      if (!changeRes.ok) throw new Error("Failed to fetch change form");
      const changeData = await changeRes.json();
      const changeSubs: Submission[] = changeData.results || [];

      // Fetch evaluation forms
      const evalSubs: EvalSubs = {
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
        const res = await fetch(getApiUrl(`assets/${fid}/data.json`, label));
        if (!res.ok) throw new Error(`Failed to fetch form ${key}`);
        const data = await res.json();
        evalSubs[key as keyof EvalSubs] = data.results || [];
      }

      // Process the fetched data
      setData({ mainSubs, changeSubs, evalSubs, coordinatorEmail, isAdmin });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      console.error("Data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const processData = (
    mainSubs: Submission[],
    changeSubs: Submission[],
    evalSubs: EvalSubs,
    email: string,
    isAdminUser: boolean = false
  ) => {
    try {
      // Sort change submissions by submission time
      changeSubs.sort((a, b) => new Date(a._submission_time).getTime() - new Date(b._submission_time).getTime());

      // Build current coordinators map and appointment times
      const currentCoord: { [key: string]: string } = {};
      const appointmentTimes: { [key: string]: Date } = {};
      const maturityLevels: { [key: string]: "advanced" | "early" | null } = {};
      mainSubs.forEach((sub) => {
        const toolId = sub[KOBO_CONFIG.TOOL_ID_FIELD];
        if (sub.coordinator_email) {
          currentCoord[toolId] = sub.coordinator_email;
          appointmentTimes[toolId] = new Date(sub._submission_time);
          maturityLevels[toolId] = sub[KOBO_CONFIG.MATURITY_FIELD] || null;
        }
      });
      changeSubs.forEach((ch) => {
        const toolId = ch.tool_id;
        const newEmail = ch.Email_of_the_Coordinator;
        if (toolId && newEmail) {
          currentCoord[toolId] = newEmail;
          appointmentTimes[toolId] = new Date(ch._submission_time);
        }
      });

      // Calculate total tools
      const totalTools = mainSubs.length;

      // Helper to extract tool_id from evaluation submissions
      const getToolId = (sub: Submission): string => {
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

      // Process tools for stats and recent activity
      const toolStatus: { [key: string]: "active" | "stopped" } = {};
      const lastTimes: { [key: string]: Date } = {};
      const toolMap: { [key: string]: Submission } = {};

      mainSubs.forEach((sub) => {
        const toolId = sub[KOBO_CONFIG.TOOL_ID_FIELD];
        toolMap[toolId] = sub;
        lastTimes[toolId] = appointmentTimes[toolId] || new Date(sub._submission_time);

        const maturity = sub[KOBO_CONFIG.MATURITY_FIELD];
        let has3 = false;
        let has4 = false;
        let allEvalForTool: Submission[] = [];

        if (maturity === "advanced") {
          has3 = advanced3.has(toolId);
          has4 = advanced4.has(toolId);
          allEvalForTool = [
            ...evalSubs.advanced3.filter((s) => getToolId(s) === toolId),
            ...evalSubs.advanced4.filter((s) => getToolId(s) === toolId),
          ];
        } else if (maturity === "early") {
          has3 = early3.has(toolId);
          has4 = early4.has(toolId);
          allEvalForTool = [
            ...evalSubs.early3.filter((s) => getToolId(s) === toolId),
            ...evalSubs.early4.filter((s) => getToolId(s) === toolId),
          ];
        }

        const status = has3 && has4 ? "stopped" : "active";
        toolStatus[toolId] = status;

        // Update last time with evaluation times if available
        if (allEvalForTool.length > 0) {
          const maxTime = allEvalForTool.reduce((max, s) => {
            const d = new Date(s._submission_time);
            return d > max ? d : max;
          }, lastTimes[toolId]);
          lastTimes[toolId] = maxTime;
        }
      });

      // Calculate submission counts for all tools
      const submissionCounts: { [key: string]: { ut3: number; ut4: number } } = {};
      mainSubs.forEach((sub: any) => {
        const toolId = sub[KOBO_CONFIG.TOOL_ID_FIELD];
        const maturity = sub[KOBO_CONFIG.MATURITY_FIELD];
        let ut3Subs = 0;
        let ut4Subs = 0;

        if (maturity === "advanced") {
          ut3Subs = evalSubs.advanced3.filter((s: any) => getToolId(s) === toolId).length;
          ut4Subs = evalSubs.advanced4.filter((s: any) => getToolId(s) === toolId).length;
        } else if (maturity === "early") {
          ut3Subs = evalSubs.early3.filter((s: any) => getToolId(s) === toolId).length;
          ut4Subs = evalSubs.early4.filter((s: any) => getToolId(s) === toolId).length;
        }

        submissionCounts[toolId] = { ut3: ut3Subs, ut4: ut4Subs };
      });

      // Create all tools array (for admin view)
      const allToolsArray = mainSubs.map((sub: any) => {
        const toolId = sub[KOBO_CONFIG.TOOL_ID_FIELD];
        const submissionDate = appointmentTimes[toolId] || new Date(sub._submission_time);
        return {
          id: toolId,
          name: sub[KOBO_CONFIG.TOOL_NAME_FIELD] || "Unknown Tool",
          status: toolStatus[toolId] || "active",
          ut3Submissions: submissionCounts[toolId]?.ut3 || 0,
          ut4Submissions: submissionCounts[toolId]?.ut4 || 0,
          coordinator: currentCoord[toolId] || "Unassigned",
          maturityLevel: maturityLevels[toolId],
          dateSubmitted: submissionDate.toLocaleDateString("en-CA"),
        };
      });

      setAllTools(allToolsArray);

      // Process based on user type
      if (isAdminUser) {
        // Admin stats
        const totalCoordinators = new Set(Object.values(currentCoord)).size;
        let stoppedCount = 0;
        let activeCount = 0;

        Object.keys(toolStatus).forEach((toolId) => {
          if (toolStatus[toolId] === "stopped") stoppedCount++;
          if (toolStatus[toolId] === "active") activeCount++;
        });

        const overallCompletion = mainSubs.length > 0 ? Math.round((stoppedCount / mainSubs.length) * 100) : 0;

        setStats({
          totalTools: mainSubs.length,
          appointedTools: totalCoordinators,
          evaluatedTools: stoppedCount,
          ongoingTools: activeCount,
          completionRate: overallCompletion,
        });

        // Admin recent activity: last 3 tool updates
        let allActivities: Activity[] = Object.keys(toolMap).map((id) => ({
          id,
          tool: toolMap[id]?.[KOBO_CONFIG.TOOL_NAME_FIELD] || "Unknown Tool",
          status: toolStatus[id] || "active",
          date: (lastTimes[id] || new Date()).toLocaleDateString("en-CA"),
          coordinator: currentCoord[id] || "Unassigned",
        }));
        allActivities.sort((a, b) =>
          (lastTimes[b.id] || new Date()).getTime() - (lastTimes[a.id] || new Date()).getTime()
        );
        setRecentActivity(allActivities.slice(0, 3));
        setTools(allToolsArray);
      } else {
        // Coordinator specific stats
        const appointedToolsCount = Object.entries(currentCoord).filter(
          ([_, coordEmail]) => coordEmail === email
        ).length;

        let stoppedCount = 0;
        let activeCount = 0;

        Object.entries(currentCoord).forEach(([toolId, coordEmail]) => {
          if (coordEmail === email) {
            if (toolStatus[toolId] === "stopped") stoppedCount++;
            if (toolStatus[toolId] === "active") activeCount++;
          }
        });

        const completionRate = appointedToolsCount > 0 ? Math.round((stoppedCount / appointedToolsCount) * 100) : 0;

        setStats({
          totalTools,
          appointedTools: appointedToolsCount,
          evaluatedTools: stoppedCount,
          ongoingTools: activeCount,
          completionRate,
        });

        // Coordinator recent activity
        const appointedIds = Object.entries(currentCoord)
          .filter(([_, coordEmail]) => coordEmail === email)
          .map(([id]) => id);

        let activities: Activity[] = appointedIds.map((id) => ({
          id,
          tool: toolMap[id]?.[KOBO_CONFIG.TOOL_NAME_FIELD] || "Unknown Tool",
          status: toolStatus[id] || "active",
          date: (appointmentTimes[id] || lastTimes[id]).toLocaleDateString("en-CA"),
          coordinator: currentCoord[id],
        }));

        activities.sort((a, b) =>
          (appointmentTimes[b.id] || lastTimes[b.id]).getTime() -
          (appointmentTimes[a.id] || lastTimes[a.id]).getTime()
        );
        setRecentActivity(activities.slice(0, 3));

        // Coordinator tools - Filter by coordinator email from currentCoord
        const appointedTools = Object.entries(currentCoord)
          .filter(([_, coordEmail]) => coordEmail === email)
          .map(([toolId]) => {
            const sub = toolMap[toolId];
            const submissionDate = appointmentTimes[toolId] || new Date(sub._submission_time);
            return {
              id: toolId,
              name: sub?.[KOBO_CONFIG.TOOL_NAME_FIELD] || "Unknown Tool",
              status: toolStatus[toolId] || "active",
              ut3Submissions: submissionCounts[toolId]?.ut3 || 0,
              ut4Submissions: submissionCounts[toolId]?.ut4 || 0,
              coordinator: currentCoord[toolId] || "Unassigned",
              maturityLevel: maturityLevels[toolId],
              dateSubmitted: submissionDate.toLocaleDateString("en-CA"),
            };
          });

        setTools(appointedTools);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process data");
      console.error("Data processing error:", err);
    }
  };

  const setData = ({
    mainSubs,
    changeSubs,
    evalSubs,
    coordinatorEmail: email,
    isAdmin: adminStatus = false,
  }: {
    mainSubs: Submission[];
    changeSubs: Submission[];
    evalSubs: EvalSubs;
    coordinatorEmail: string;
    isAdmin?: boolean;
  }) => {
    setCoordinatorEmail(email);
    setIsAdmin(adminStatus);
    localStorage.setItem("coordinatorEmail", email);
    localStorage.setItem("isAdmin", adminStatus.toString());
    processData(mainSubs, changeSubs, evalSubs, email, adminStatus);
  };

  const value: DataContextType = {
    stats,
    recentActivity,
    tools,
    allTools,
    coordinatorEmail,
    isAdmin,
    setData,
    setTools,
    fetchData,
    loading,
    error,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};