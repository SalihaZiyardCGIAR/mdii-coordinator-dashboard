// src/config/koboConfig.ts
export const KOBO_CONFIG = {
  // Note: BASE_URL is not used when using Vite proxy
  // All requests go through /api/kobo instead
  TOOL_ID_FIELD: "ID",
  MATURITY_FIELD: "tool_maturity",
  TOOL_NAME_FIELD: "tool_name",
  MAIN_FORM_ID: "aJn2DsjpAeJjrB6VazHjtz",
  change_coordinator: "avPNYf5KFFyGhrxGx6u4K3",

  USERTYPE3_FORMS: {
    advance_stage: "aFfhFi5vpsierwc3b5SNvc",  
    early_stage: "aCAhpbKYdsMbnGcWo4yR42",    
  },

  USERTYPE4_FORMS: {
    advance_stage: "aU5LwrZps9u7Yt7obeShjv",  
    early_stage: "aKhnEosysRHsrUKxanCSKc",    
  },

  DOMAIN_EXPERT_FORMS: {
    advance_stage: "ap6dUEDwX7KUsKLFZUD7kb",  
    early_stage: "au52CRd6ATzV7S36WcAdDu",    
  },

  INNOVATOR_FORMS :{
  leadership: "afiUqEoYaGMS8RaygTPuAR",
  technical: "aqxEbPgQTMQQqe42ZFW2cc",
  projectManager: "auq274db5dfNGasdH4bWdU"
},
  DOMAIN_CATEGORIES: {
    advance_stage: [  
      "Country Expert",
      "Data",
      "Economics",
      "Gender Equity and Social Inclusion",
      "Human-Centered Design",
      "Information and Communication Technologies",
    ],
    early_stage: [  
      "Country Expert",
      "Data",
      "Economics",
      "Gender Equity and Social Inclusion",
      "Information and Communication Technologies",
    ],
    
  },
  DOMAIN_CODE_MAPPING: {
    ce: "Country Expert",
    country_expert: "Country Expert",
    data: "Data",
    econ: "Economics",
    gesi: "Gender Equity and Social Inclusion",
    hcd: "Human-Centered Design",
    ict: "Information and Communication Technologies",
  },
  DOMAIN_EXPERT_ASSIGNMENT_FORM_IDS: [
    "ap6dUEDwX7KUsKLFZUD7kb",
    "au52CRd6ATzV7S36WcAdDu",
    "aDrD6ZuThQweedHFoogbi4",
  ] as const,

  DOMAIN_EXPERT_QUESTIONS: {
    advance_stage: {
      name: "group_intro_001/Q_22100000",
      organization: "group_intro_001/Q_22200000",
      domains: "group_intro_001/Q_22300000",
      toolId: "group_intro_001/Q_13110000",
    },
    early_stage: {
      name: "group_individualinfo/Q_22100000",
      organization: "group_individualinfo/Q_22200000",
      domains: "group_individualinfo/Q_22300000",
      toolId: "group_toolid/Q_13110000",
    },
  } as const,

  MONTH_NAMES: [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  ] as const,

  DAY_NAMES_SHORT: [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  ] as const,

  DAY_NAMES_FULL: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ] as const,
} as const;
