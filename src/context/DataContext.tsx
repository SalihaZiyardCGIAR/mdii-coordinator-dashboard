import React, { createContext, useContext, useEffect } from "react";
import { KOBO_CONFIG } from "@/config/koboConfig";
import { getApiUrl } from "@/config/apiConfig";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setStats,
  setRecentActivity,
  setTools,
  setAllTools,
  setLoading,
  setError,
} from "@/store/toolsSlice";
import { setAuth } from "@/store/authSlice";

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
  const dispatch = useAppDispatch();
  
  // Get state from Redux
  const { stats, recentActivity, tools, allTools, loading, error } = useAppSelector(
    (state) => state.tools
  );
  const { coordinatorEmail, isAdmin } = useAppSelector((state) => state.auth);

  useEffect(() => {
    console.log('=== DATA CONTEXT MOUNT ===');
    // Load from localStorage on mount
    const email = localStorage.getItem("coordinatorEmail");
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    
    console.log('Loading from localStorage:');
    console.log('  - Email:', email);
    console.log('  - Admin status:', adminStatus);
    
    if (email) {
      console.log('Setting auth from localStorage');
      dispatch(setAuth({ email, isAdmin: adminStatus }));
    }
    
    // Auto-fetch data if we have auth but no tools
    if (email && allTools.length === 0) {
      console.log('Auto-fetching data (have email but no tools)');
      fetchData();
    } else {
      console.log('Skipping auto-fetch:', { hasEmail: !!email, toolsLength: allTools.length });
    }
  }, []);

  const fetchData = async () => {
    console.log('=== FETCH DATA START ===');
    console.log('Coordinator Email:', coordinatorEmail);
    console.log('Is Admin:', isAdmin);
    
    dispatch(setLoading(true));
    dispatch(setError(null));
    
    try {
      // Fetch main form
      const mainFormUrl = getApiUrl(`assets/${KOBO_CONFIG.MAIN_FORM_ID}/data.json`, "mainForm");
      console.log('Fetching main form URL:', mainFormUrl);
      console.log('Main Form ID:', KOBO_CONFIG.MAIN_FORM_ID);
      
      const mainRes = await fetch(mainFormUrl);
      console.log('Main form response status:', mainRes.status, mainRes.statusText);
      
      if (!mainRes.ok) {
        const errorText = await mainRes.text();
        console.error('Main form error response:', errorText);
        throw new Error("Failed to fetch main form");
      }
      
      const mainData = await mainRes.json();
      console.log('Main form data received, results count:', mainData.results?.length || 0);
      const mainSubs: Submission[] = mainData.results || [];

      // Fetch change coordinator form
      const changeFormUrl = getApiUrl(`assets/${KOBO_CONFIG.change_coordinator}/data.json`, "changeCoordinator");
      console.log('Fetching change coordinator form URL:', changeFormUrl);
      console.log('Change Coordinator Form ID:', KOBO_CONFIG.change_coordinator);
      
      const changeRes = await fetch(changeFormUrl);
      console.log('Change coordinator response status:', changeRes.status, changeRes.statusText);
      
      if (!changeRes.ok) {
        const errorText = await changeRes.text();
        console.error('Change coordinator error response:', errorText);
        throw new Error("Failed to fetch change form");
      }
      
      const changeData = await changeRes.json();
      console.log('Change coordinator data received, results count:', changeData.results?.length || 0);
      const changeSubs: Submission[] = changeData.results || [];

      // Fetch evaluation forms
      console.log('Starting evaluation forms fetch...');
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

      console.log('Form Map:', formMap);

      for (const key in formMap) {
        const { id: fid, label } = formMap[key as keyof typeof formMap];
        const evalFormUrl = getApiUrl(`assets/${fid}/data.json`, label);
        
        console.log(`Fetching ${key} form...`);
        console.log(`  - Form ID: ${fid}`);
        console.log(`  - URL: ${evalFormUrl}`);
        
        const res = await fetch(evalFormUrl);
        console.log(`  - Response status: ${res.status} ${res.statusText}`);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error(`  - Error response for ${key}:`, errorText);
          throw new Error(`Failed to fetch form ${key}`);
        }
        
        const data = await res.json();
        console.log(`  - Results count: ${data.results?.length || 0}`);
        evalSubs[key as keyof EvalSubs] = data.results || [];
      }

      console.log('All evaluation forms fetched successfully');

      // Process the fetched data
      console.log('Starting data processing...');
      console.log('Main subs count:', mainSubs.length);
      console.log('Change subs count:', changeSubs.length);
      console.log('Eval subs counts:', {
        advanced3: evalSubs.advanced3.length,
        early3: evalSubs.early3.length,
        advanced4: evalSubs.advanced4.length,
        early4: evalSubs.early4.length,
      });
      
      processAndSetData({ mainSubs, changeSubs, evalSubs, coordinatorEmail, isAdmin });
      console.log('=== FETCH DATA COMPLETE ===');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch data";
      console.error('=== FETCH DATA ERROR ===');
      console.error('Error type:', err instanceof Error ? err.constructor.name : typeof err);
      console.error('Error message:', errorMessage);
      console.error('Error stack:', err instanceof Error ? err.stack : 'No stack trace');
      console.error('Full error object:', err);
      
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
      console.log('Loading state set to false');
    }
  };

const processAndSetData = ({
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
  console.log('=== PROCESS AND SET DATA START ===');
  console.log('Processing for email:', email);
  console.log('Admin status:', adminStatus);
  
  try {
    // Sort change submissions by submission time
    console.log('Sorting change submissions...');
    changeSubs.sort((a, b) => new Date(a._submission_time).getTime() - new Date(b._submission_time).getTime());
    console.log('Change submissions sorted');

    // Build current coordinators map and appointment times
    console.log('Building coordinators map...');
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
    console.log('Main submissions processed, coordinators found:', Object.keys(currentCoord).length);
    
    changeSubs.forEach((ch) => {
      const toolId = ch.tool_id;
      const newEmail = ch.Email_of_the_Coordinator;
      if (toolId && newEmail) {
        currentCoord[toolId] = newEmail;
        appointmentTimes[toolId] = new Date(ch._submission_time);
      }
    });
    console.log('Change submissions processed, total coordinators:', Object.keys(currentCoord).length);

    // Calculate total tools
    const totalTools = mainSubs.length;
    console.log('Total tools:', totalTools);

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
    console.log('Creating evaluation submission sets...');
    const advanced3 = new Set(evalSubs.advanced3.map(getToolId));
    const early3 = new Set(evalSubs.early3.map(getToolId));
    const advanced4 = new Set(evalSubs.advanced4.map(getToolId));
    const early4 = new Set(evalSubs.early4.map(getToolId));
    console.log('Evaluation sets created:', {
      advanced3: advanced3.size,
      early3: early3.size,
      advanced4: advanced4.size,
      early4: early4.size,
    });

    // Process tools for stats and recent activity
    console.log('Processing tool status...');
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
    console.log('Calculating submission counts...');
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
    console.log('Submission counts calculated for', Object.keys(submissionCounts).length, 'tools');

    // Create all tools array (for admin view)
    console.log('Creating all tools array...');
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
    console.log('All tools array created with', allToolsArray.length, 'tools');

    dispatch(setAllTools(allToolsArray));

    // Process based on user type
    if (adminStatus) {
      console.log('Processing admin stats...');
      // Admin stats
      const totalCoordinators = new Set(Object.values(currentCoord)).size;
      let stoppedCount = 0;
      let activeCount = 0;

      Object.keys(toolStatus).forEach((toolId) => {
        if (toolStatus[toolId] === "stopped") stoppedCount++;
        if (toolStatus[toolId] === "active") activeCount++;
      });

      const overallCompletion = mainSubs.length > 0 ? Math.round((stoppedCount / mainSubs.length) * 100) : 0;

      console.log('Admin stats calculated:', {
        totalTools: mainSubs.length,
        appointedTools: totalCoordinators,
        evaluatedTools: stoppedCount,
        ongoingTools: activeCount,
        completionRate: overallCompletion,
      });

      dispatch(setStats({
        totalTools: mainSubs.length,
        appointedTools: totalCoordinators,
        evaluatedTools: stoppedCount,
        ongoingTools: activeCount,
        completionRate: overallCompletion,
      }));

      // Admin recent activity: last 3 tool updates
      console.log('Creating admin recent activity...');
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
      
      console.log('Admin activities sorted, showing top 3 of', allActivities.length);
      dispatch(setRecentActivity(allActivities.slice(0, 3)));
      dispatch(setTools(allToolsArray));
      console.log('Admin data dispatched');
    } else {
      // Coordinator specific stats
      console.log('Processing coordinator stats for:', email);
      const appointedToolsCount = Object.entries(currentCoord).filter(
        ([_, coordEmail]) => coordEmail === email
      ).length;
      console.log('Coordinator appointed tools count:', appointedToolsCount);

      let stoppedCount = 0;
      let activeCount = 0;

      Object.entries(currentCoord).forEach(([toolId, coordEmail]) => {
        if (coordEmail === email) {
          if (toolStatus[toolId] === "stopped") stoppedCount++;
          if (toolStatus[toolId] === "active") activeCount++;
        }
      });

      const completionRate = appointedToolsCount > 0 ? Math.round((stoppedCount / appointedToolsCount) * 100) : 0;

      console.log('Coordinator stats calculated:', {
        totalTools,
        appointedTools: appointedToolsCount,
        evaluatedTools: stoppedCount,
        ongoingTools: activeCount,
        completionRate,
      });

      dispatch(setStats({
        totalTools,
        appointedTools: appointedToolsCount,
        evaluatedTools: stoppedCount,
        ongoingTools: activeCount,
        completionRate,
      }));

      // Coordinator recent activity
      console.log('Creating coordinator recent activity...');
      const appointedIds = Object.entries(currentCoord)
        .filter(([_, coordEmail]) => coordEmail === email)
        .map(([id]) => id);
      console.log('Coordinator appointed tool IDs:', appointedIds.length);

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
      
      console.log('Coordinator activities sorted, showing top 3 of', activities.length);
      dispatch(setRecentActivity(activities.slice(0, 3)));

      // Coordinator tools - Filter by coordinator email from currentCoord
      console.log('Creating coordinator tools list...');
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

      console.log('Coordinator tools created:', appointedTools.length);
      dispatch(setTools(appointedTools));
      console.log('Coordinator data dispatched');
    }
    
    console.log('=== PROCESS AND SET DATA COMPLETE ===');
    
    // CRITICAL FIX: Clear loading and error states after successful processing
    dispatch(setLoading(false));
    dispatch(setError(null));
    console.log('Loading and error states cleared');
    
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to process data";
    console.error('=== PROCESS AND SET DATA ERROR ===');
    console.error('Error:', errorMessage);
    console.error('Stack:', err instanceof Error ? err.stack : 'No stack');
    dispatch(setError(errorMessage));
    dispatch(setLoading(false)); // Also clear loading state on error
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
  console.log('=== SET DATA CALLED ===');
  console.log('Email:', email);
  console.log('Admin:', adminStatus);
  
  // CLEAR ANY PREVIOUS ERRORS - ADD THIS LINE
  dispatch(setError(null));
  
  // Update auth in Redux and localStorage
  dispatch(setAuth({ email, isAdmin: adminStatus }));
  localStorage.setItem("coordinatorEmail", email);
  localStorage.setItem("isAdmin", adminStatus.toString());
  console.log('Auth updated in Redux and localStorage');
  
  // Process and store data
  processAndSetData({ mainSubs, changeSubs, evalSubs, coordinatorEmail: email, isAdmin: adminStatus });
};

  const handleSetTools = (tools: Tool[] | ((prev: Tool[]) => Tool[])) => {
    if (typeof tools === 'function') {
      // Handle function updater
      const currentTools = useAppSelector((state) => state.tools.tools);
      dispatch(setTools(tools(currentTools)));
    } else {
      dispatch(setTools(tools));
    }
  };

  const value: DataContextType = {
    stats,
    recentActivity,
    tools,
    allTools,
    coordinatorEmail,
    isAdmin,
    setData,
    setTools: handleSetTools,
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