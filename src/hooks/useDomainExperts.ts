import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setDomainExperts, setLoading, setError } from "@/store/domainExpertsSlice";
import { KOBO_CONFIG } from "@/config/koboConfig";
import { getApiUrl } from "@/config/apiConfig";

interface DomainExpert {
  name: string;
  organization: string;
  domains: string[];
  toolIds: string[];
}

export const useDomainExperts = () => {
  const dispatch = useAppDispatch();
  const { experts: domainExperts, loading, error: fetchError, lastFetched } = useAppSelector(
    (state) => state.domainExperts
  );

  useEffect(() => {
    const shouldFetch = !lastFetched || Date.now() - lastFetched > 5 * 60 * 1000;
    
    if (shouldFetch && domainExperts.length === 0) {
      fetchDomainExperts();
    }
  }, []);

  const fetchDomainExperts = async () => {
    try {
      dispatch(setLoading(true));

      const domainExpertSubs: any = {
        advancedDomain: [],
        earlyDomain: [],
      };

      try {
        const advDomainRes = await fetch(
          getApiUrl(`assets/${KOBO_CONFIG.DOMAIN_EXPERT_FORMS.advance_stage}/data.json`, "advancedDomain")
        );
        if (advDomainRes.ok) {
          const data = await advDomainRes.json();
          domainExpertSubs.advancedDomain = data.results || [];
        }
      } catch (err) {
        console.warn("Failed to fetch advanced domain expert form:", err);
      }

      try {
        const earlyDomainRes = await fetch(
          getApiUrl(`assets/${KOBO_CONFIG.DOMAIN_EXPERT_FORMS.early_stage}/data.json`, "earlyDomain")
        );
        if (earlyDomainRes.ok) {
          const data = await earlyDomainRes.json();
          domainExpertSubs.earlyDomain = data.results || [];
        }
      } catch (err) {
        console.warn("Failed to fetch early domain expert form:", err);
      }

      const expertMap = new Map<string, DomainExpert>();

      // Process advanced domain submissions
      domainExpertSubs.advancedDomain.forEach((sub: any) => {
        const name = sub["group_intro_001/Q_22100000"] || "Unknown";
        const organization = sub["group_intro_001/Q_22200000"] || "Unknown";
        const domainsStr = sub["group_intro_001/Q_22300000"];
        const toolId = sub["group_intro_001/Q_13110000"] || sub["group_intro/Q_13110000"];

        if (name && domainsStr) {
          const key = `${name}-${organization}`;

          if (!expertMap.has(key)) {
            expertMap.set(key, {
              name,
              organization,
              domains: [],
              toolIds: [],
            });
          }

          const expert = expertMap.get(key)!;

          if (toolId && !expert.toolIds.includes(toolId)) {
            expert.toolIds.push(toolId);
          }

          const domainCodes = domainsStr.split(/[,\s]+/).filter((d: string) => d.trim());
          domainCodes.forEach((code: string) => {
            const trimmed = code.trim().toLowerCase();
            const mappedDomain =
              KOBO_CONFIG.DOMAIN_CODE_MAPPING[trimmed as keyof typeof KOBO_CONFIG.DOMAIN_CODE_MAPPING] ||
              code.trim();
            if (mappedDomain && !expert.domains.includes(mappedDomain)) {
              expert.domains.push(mappedDomain);
            }
          });
        }
      });

      // Process early domain submissions
      domainExpertSubs.earlyDomain.forEach((sub: any) => {
        const name = sub["group_individualinfo/Q_22100000"] || "Unknown";
        const organization = sub["group_individualinfo/Q_22200000"] || "Unknown";
        const domainsStr = sub["group_individualinfo/Q_22300000"];
        const toolId = sub["group_toolid/Q_13110000"] || sub["group_intro/Q_13110000"];

        if (name && domainsStr) {
          const key = `${name}-${organization}`;

          if (!expertMap.has(key)) {
            expertMap.set(key, {
              name,
              organization,
              domains: [],
              toolIds: [],
            });
          }

          const expert = expertMap.get(key)!;

          if (toolId && !expert.toolIds.includes(toolId)) {
            expert.toolIds.push(toolId);
          }

          const domainCodes = domainsStr.split(/[,\s]+/).filter((d: string) => d.trim());
          domainCodes.forEach((code: string) => {
            const trimmed = code.trim().toLowerCase();
            const mappedDomain =
              KOBO_CONFIG.DOMAIN_CODE_MAPPING[trimmed as keyof typeof KOBO_CONFIG.DOMAIN_CODE_MAPPING] ||
              code.trim();
            if (mappedDomain && !expert.domains.includes(mappedDomain)) {
              expert.domains.push(mappedDomain);
            }
          });
        }
      });

      const expertList = Array.from(expertMap.values());
      dispatch(setDomainExperts(expertList));
    } catch (error) {
      console.error("Error fetching domain experts:", error);
      dispatch(setError(error instanceof Error ? error.message : "Failed to fetch domain experts"));
    }
  };

  return {
    domainExperts,
    loading,
    fetchError,
    fetchDomainExperts,
  };
};