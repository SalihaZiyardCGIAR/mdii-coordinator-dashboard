import { updateToolStatusOnStop } from '@/utils/blobStorage';
import {createSlice, PayloadAction} from '@reduxjs/toolkit'

interface Tool {
    id: string;
    name: string;
    coordinator: string;
    maturityLevel: "advanced" | "early" | null;
    status: "active" | "stopped";
    ut3Submissions: number;
    ut4Submissions: number;
    dateSubmitted?: string;
}

interface Activity {
    id: string;
    tool: string;
    status: "active" | "stopped";
    date: string;
    coordinator: string;
}

interface Stats{
    totalTools: number;
    appointedTools: number;
    evaluatedTools: number;
    ongoingTools: number;
    completionRate: number;
}

interface ToolState {
  stats: Stats;
  recentActivity: Activity[];
  tools: Tool[];
  allTools: Tool[];
  loading: boolean;
  error: string | null;
}

const initialState: ToolState = {
    stats: {
        totalTools: 0,
        appointedTools: 0,
        evaluatedTools: 0,
        ongoingTools: 0,
        completionRate: 0,  
    }, 
    recentActivity: [],
    tools: [],
    allTools: [],
    loading: false,
    error: null,
};

const toolsSlice = createSlice({
    name: 'tools',
    initialState,
    reducers: {
        setStats: (state, action: PayloadAction<Stats>) => {
            state.stats = action.payload;
        },
        setRecentActivity: (state, action: PayloadAction<Activity[]>) => {
            state.recentActivity = action.payload;
        },
        setTools: (state, action: PayloadAction<Tool[]>) => {
            state.tools = action.payload;
        },
        setAllTools: (state, action: PayloadAction<Tool[]>) =>{
            state.allTools = action.payload;
        },
        updateToolStatus: (state, action: PayloadAction<{id: string, status: "active" | "stopped" }>) => {
            const tool = state.tools.find(t => t.id === action.payload.id);
            if(tool) {
                tool.status = action.payload.status;
            }
            
            const allTool = state.allTools.find(t => t.id === action.payload.id);
            if(allTool) {
                allTool.status = action.payload.status;
            }
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.loading = false;
        },
    }
});

export const {
  setStats,
  setRecentActivity,
  setTools,
  setAllTools,
  updateToolStatus,
  setLoading,
  setError,
} = toolsSlice.actions;

export default toolsSlice.reducer;