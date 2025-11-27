import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DomainExpert {
    name: string;
    organization: string;
    domains: string[];
    toolIds: string[];
}

interface DomainExpertState {
    experts: DomainExpert[],
    loading: boolean;
    error: string | null;
    lastFetched: number | null;
}

const initialState: DomainExpertState = {
    experts: [],
    loading: false,
    error: null,
    lastFetched: null,
};

const domainExpertsSlice = createSlice({
    name: 'domainExperts',
    initialState,
    reducers: {
        setDomainExperts: (state, action: PayloadAction<DomainExpert[]>) => {
            state.experts = action.payload;
            state.loading = false;
            state.error = null;
            state.lastFetched = Date.now();
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.loading = false;
        },
        clearDomainExperts: (state) => {
            state.experts = [];
            state.lastFetched = null;
        },
    },
});

export const { setDomainExperts, setLoading, setError, clearDomainExperts } = domainExpertsSlice.actions;
export default domainExpertsSlice.reducer;