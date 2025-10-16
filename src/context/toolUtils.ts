import { getApiUrl } from "@/config/apiConfig";
import { KOBO_CONFIG } from "@/config/koboConfig";

export interface Submission {
  id: string;
  submittedBy: string;
  submissionDate: string;
  responses: { [key: string]: string };
}

export interface ToolDetailsData {
  toolId: string;
  toolName: string;
  maturity: string;
  status?: string;
  innovators: Array<{ role: string; submitted: boolean; count: number }>;
  domainExperts: Array<{ category: string; submitted: boolean; count: number }>;
  directUsers: { data: Submission[]; questions: any[] };
  indirectUsers: { data: Submission[]; questions: any[] };
}

export const fetchToolDetails = async (toolId: string, tools: any[] = []): Promise<ToolDetailsData | null> => {
  try {
    const mainRes = await fetch(getApiUrl(`assets/${KOBO_CONFIG.MAIN_FORM_ID}/data.json`, "mainForm"));
    if (!mainRes.ok) throw new Error(`Failed to fetch main form: ${mainRes.statusText}`);

    const text = await mainRes.text();
    if (!text) throw new Error("Empty response from main form");

    const mainData = JSON.parse(text);
    const toolInfo = mainData.results.find((r: any) => r[KOBO_CONFIG.TOOL_ID_FIELD] === toolId);

    if (!toolInfo) throw new Error("Tool not found");

    const maturity = toolInfo[KOBO_CONFIG.MATURITY_FIELD];
    if (!maturity || (maturity !== 'advance_stage' && maturity !== 'early_stage')) {
      throw new Error(`Invalid maturity level: ${maturity}`);
    }

    const ut3FormId = maturity === 'advance_stage' ? KOBO_CONFIG.USERTYPE3_FORMS.advance_stage : KOBO_CONFIG.USERTYPE3_FORMS.early_stage;
    const ut4FormId = maturity === 'advance_stage' ? KOBO_CONFIG.USERTYPE4_FORMS.advance_stage : KOBO_CONFIG.USERTYPE4_FORMS.early_stage;
    const domainFormId = KOBO_CONFIG.DOMAIN_EXPERT_FORMS[maturity];

    const [innovatorRes, domainRes, ut3DataRes, ut4DataRes, ut3FormRes, ut4FormRes] = await Promise.all([
      Promise.all(
        Object.entries(KOBO_CONFIG.INNOVATOR_FORMS).map(([, formId]) =>
          fetch(getApiUrl(`assets/${formId}/data.json`, "innovator"))
        )
      ),
      fetch(getApiUrl(`assets/${domainFormId}/data.json`, "domainExperts")),
      fetch(getApiUrl(`assets/${ut3FormId}/data.json`, "ut3")),
      fetch(getApiUrl(`assets/${ut4FormId}/data.json`, "ut4")),
      fetch(getApiUrl(`assets/${ut3FormId}.json`, "ut3Form")),
      fetch(getApiUrl(`assets/${ut4FormId}.json`, "ut4Form")),
    ]);

    const innovatorData = await Promise.all(
      innovatorRes.map(async (res, index) => {
        const [role] = Object.entries(KOBO_CONFIG.INNOVATOR_FORMS)[index];
        try {
          if (!res.ok) {
            console.warn(`Failed to fetch ${role} form: ${res.statusText}`);
            return {
              role:
                role === 'projectManager' ? 'Project Manager' :
                role === 'leadership' ? 'Leadership' :
                role === 'technical' ? 'Technical' : role,
              submitted: false,
              count: 0,
            };
          }
          const text = await res.text();
          const data = text ? JSON.parse(text) : { results: [] };
          const matching = data.results.filter((r: any) =>
            String(r["group_intro/Q_13110000"] || r["group_requester/Q_13110000"] || "").trim() === toolId
          );
          return {
            role:
              role === 'projectManager' ? 'Project Manager' :
              role === 'leadership' ? 'Leadership' :
              role === 'technical' ? 'Technical' : role,
            submitted: matching.length > 0,
            count: matching.length,
          };
        } catch (err) {
          console.error(`Error processing ${role}:`, err);
          return {
            role:
              role === 'projectManager' ? 'Project Manager' :
              role === 'leadership' ? 'Leadership' :
              role === 'technical' ? 'Technical' : role,
            submitted: false,
            count: 0,
          };
        }
      })
    );

    let domainExpertData = KOBO_CONFIG.DOMAIN_CATEGORIES[maturity].map((category: string) => ({
      category,
      submitted: false,
      count: 0,
    }));

    try {
      if (domainRes.ok) {
        const domainText = await domainRes.text();
        const domainData = domainText ? JSON.parse(domainText) : { results: [] };
        const domainMatching = domainData.results.filter((r: any) =>
          String(r["group_intro/Q_13110000"] || "").trim() === toolId
        );

        const categorySubmissions = new Map();
        domainMatching.forEach((record: any) => {
          const expertiseString = String(
            maturity === 'early_stage'
              ? record["group_individualinfo/Q_22300000"] || ""
              : record["group_intro_001/Q_22300000"] || ""
          ).trim().toLowerCase();

          if (expertiseString) {
            const codes = expertiseString.split(/\s+/);
            codes.forEach((code: string) => {
              const fullName = KOBO_CONFIG.DOMAIN_CODE_MAPPING[code];
              if (fullName) {
                categorySubmissions.set(fullName, (categorySubmissions.get(fullName) || 0) + 1);
              }
            });
          }
        });

        domainExpertData = KOBO_CONFIG.DOMAIN_CATEGORIES[maturity].map((category: string) => ({
          category,
          submitted: categorySubmissions.has(category),
          count: categorySubmissions.get(category) || 0,
        }));
      }
    } catch (err) {
      console.warn("Error processing domain expert data:", err);
    }

    let ut3Data = { results: [] };
    let ut4Data = { results: [] };
    let ut3Form = { content: {} };
    let ut4Form = { content: {} };

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

    const getToolId = (sub: any) =>
      String(
        sub["group_intro/Q_13110000"] ||
        sub["group_requester/Q_13110000"] ||
        sub["Q_13110000"] ||
        ""
      ).trim();

    const ut3Matching = ut3Data.results.filter((r: any) => getToolId(r) === toolId);
    const ut4Matching = ut4Data.results.filter((r: any) => getToolId(r) === toolId);

    const extractQuestions = (form: any) => {
      const questions: any[] = [];
      const content = form.content?.survey || [];
      content.forEach((item: any) => {
        if (item.type && item.name && !item.name.startsWith('_')) {
          questions.push({
            name: item.name,
            label: item.label?.[0] || item.label || item.name,
            type: item.type,
            choices: item.select_from_list_name
              ? (form.content?.choices?.[item.select_from_list_name] || []).map((c: any) => ({
                  name: c.name,
                  label: c.label?.[0] || c.label || c.name,
                }))
              : [],
          });
        }
      });
      return questions;
    };

    const currentTool = tools.find((t) => t.id === toolId);
    const toolStatus = currentTool?.status || 'active';

    return {
      toolId,
      toolName: toolInfo[KOBO_CONFIG.TOOL_NAME_FIELD],
      maturity,
      status: toolStatus,
      innovators: innovatorData,
      domainExperts: domainExpertData,
      directUsers: {
        data: ut3Matching,
        questions: extractQuestions(ut3Form),
      },
      indirectUsers: {
        data: ut4Matching,
        questions: extractQuestions(ut4Form),
      },
    };
  } catch (err: any) {
    console.error("Error fetching tool details:", err);
    throw err;
  }
};