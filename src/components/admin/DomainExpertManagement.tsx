import React, { useState, useEffect } from "react";
import { Search, Loader2, Award, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { KOBO_CONFIG } from "@/config/koboConfig";
import { getApiUrl } from "@/config/apiConfig";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setDomainExperts, setLoading, setError } from "@/store/domainExpertsSlice";
import PageHeader from "../common/subcomponents/PageHeader";

interface DomainExpert {
  name: string;
  organization: string;
  domains: string[];
  toolIds: string[];
}

export default function DomainExpertManagement() {
  const dispatch = useAppDispatch();
  const { experts: domainExperts, loading, error: fetchError, lastFetched } = useAppSelector(
    (state) => state.domainExperts
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedExpert, setSelectedExpert] = useState<DomainExpert | null>(null);
  
  // Filter states
  const [selectedOrganizations, setSelectedOrganizations] = useState<Set<string>>(new Set());
  const [selectedDomains, setSelectedDomains] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [showDomainDropdown, setShowDomainDropdown] = useState(false);

  const expertsPerPage = 15;

  // Explicitly type the arrays
  const uniqueOrganizations: string[] = Array.from(
    new Set(domainExperts.map((expert: DomainExpert) => expert.organization))
  );
  const uniqueDomains: string[] = Array.from(
    new Set(domainExperts.flatMap((expert: DomainExpert) => expert.domains))
  );

  const domainColorPalette = [
    {
      bg: "hsl(var(--secondary))",
      text: "hsl(var(--secondary-foreground))",
    },
  ];

  const getDomainBadgeStyle = (domain: string) => {
    const hash = domain.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorIndex = hash % domainColorPalette.length;
    return domainColorPalette[colorIndex];
  };

  useEffect(() => {
    // Only fetch if we don't have data or if it's been more than 5 minutes
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

  const filteredExperts = domainExperts.filter((expert: DomainExpert) => {
    const matchesSearch =
      expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.domains.some((domain: string) => domain.toLowerCase().includes(searchQuery.toLowerCase())) ||
      expert.toolIds.some((toolId: string) => toolId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesOrganization = selectedOrganizations.size === 0 || selectedOrganizations.has(expert.organization);
    const matchesDomain = selectedDomains.size === 0 || expert.domains.some((domain: string) => selectedDomains.has(domain));

    return matchesSearch && matchesOrganization && matchesDomain;
  });

  const totalPages = Math.ceil(filteredExperts.length / expertsPerPage);
  const startIndex = (currentPage - 1) * expertsPerPage;
  const paginatedExperts = filteredExperts.slice(startIndex, startIndex + expertsPerPage);

  const activeFilterCount = selectedOrganizations.size + selectedDomains.size;

  const clearAllFilters = () => {
    setSelectedOrganizations(new Set());
    setSelectedDomains(new Set());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title={"Domain Expert Management"} subtitle={"View domain experts and their expertise areas"} />
      </div>

      {/* Compact Search and Filter Bar */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3">
            {/* Search and Filter Toggle Row */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search by name, organization, domain, or tool ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <Filter className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Expandable Filter Panel */}
            {showFilters && (
              <div className="border-t pt-4 mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Organization Filter */}
                <div className="relative">
                  <label className="text-sm font-medium mb-2 block">Organizations</label>
                  <Button
                    variant="outline"
                    onClick={() => setShowOrgDropdown(!showOrgDropdown)}
                    className="w-full justify-between"
                  >
                    <span className="text-sm">
                      {selectedOrganizations.size > 0 
                        ? `${selectedOrganizations.size} selected` 
                        : "All organizations"}
                    </span>
                    {showOrgDropdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                  {showOrgDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-64 overflow-y-auto">
                      {uniqueOrganizations.map((org: string) => (
                        <div 
                          key={org} 
                          className="flex items-center space-x-2 p-2 hover:bg-muted cursor-pointer"
                          onClick={() => {
                            const newSet = new Set(selectedOrganizations);
                            if (newSet.has(org)) {
                              newSet.delete(org);
                            } else {
                              newSet.add(org);
                            }
                            setSelectedOrganizations(newSet);
                          }}
                        >
                          <Checkbox checked={selectedOrganizations.has(org)} />
                          <label className="text-sm cursor-pointer flex-1">{org}</label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Domain Filter */}
                <div className="relative">
                  <label className="text-sm font-medium mb-2 block">Domains</label>
                  <Button
                    variant="outline"
                    onClick={() => setShowDomainDropdown(!showDomainDropdown)}
                    className="w-full justify-between"
                  >
                    <span className="text-sm">
                      {selectedDomains.size > 0 
                        ? `${selectedDomains.size} selected` 
                        : "All domains"}
                    </span>
                    {showDomainDropdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                  {showDomainDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-64 overflow-y-auto">
                      {uniqueDomains.map((domain: string) => (
                        <div 
                          key={domain} 
                          className="flex items-center space-x-2 p-2 hover:bg-muted cursor-pointer"
                          onClick={() => {
                            const newSet = new Set(selectedDomains);
                            if (newSet.has(domain)) {
                              newSet.delete(domain);
                            } else {
                              newSet.add(domain);
                            }
                            setSelectedDomains(newSet);
                          }}
                        >
                          <Checkbox checked={selectedDomains.has(domain)} />
                          <label className="text-sm cursor-pointer flex-1">{domain}</label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {loading && domainExperts.length === 0 && (
        <Card>
          <CardContent className="text-center py-6">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
            <p className="text-sm font-medium text-foreground">Loading domain experts...</p>
          </CardContent>
        </Card>
      )}

      {!loading && (
        <>
          {filteredExperts.length > 0 ? (
            <>
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#f5f5f5] border-b border-[#e9e9e9]">
                        <tr>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-[#28537D]">Name</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-[#28537D]">Organization</th>
                          <th className="text-left py-3 px-8 text-sm font-semibold text-[#28537D]">
                            Domains of Expertise
                          </th>
                          <th className="text-center py-3 px-4 text-sm font-semibold text-[#28537D]">
                            Tools Reviewed
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedExperts.map((expert: DomainExpert, index: number) => (
                          <tr
                            key={`${expert.name}-${expert.organization}`}
                            className={`border-b hover:bg-[#f9f9f9] transition-colors ${
                              index % 2 === 0 ? "bg-white" : "bg-[#fafafa]"
                            }`}
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm text-foreground">{expert.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-sm text-[#556B7D]">{expert.organization}</span>
                            </td>
                            <td className="py-3 px-8">
                              <div className="flex flex-wrap gap-1.5">
                                {expert.domains.map((domain: string, idx: number) => {
                                  const { bg, text } = getDomainBadgeStyle(domain);
                                  return (
                                    <span
                                      key={idx}
                                      className="text-xs px-2.5 py-1 rounded font-medium transition-all"
                                      style={{
                                        backgroundColor: bg,
                                        color: text,
                                      }}
                                    >
                                      {domain}
                                    </span>
                                  );
                                })}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span
                                className="text-sm font-bold text-[#0297A6] cursor-pointer underline hover:text-[#028399] transition-colors"
                                onClick={() => setSelectedExpert(expert)}
                              >
                                {expert.toolIds.length}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {filteredExperts.length > expertsPerPage && (
                <div className="flex items-center justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage === 1} 
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages} • {filteredExperts.length} experts
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage === totalPages} 
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-foreground mb-2">No domain experts found</p>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {searchQuery || selectedOrganizations.size > 0 || selectedDomains.size > 0
                    ? "Try adjusting your search or filter criteria"
                    : "No domain experts available"}
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Modal for Tools Reviewed */}
      {selectedExpert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedExpert(null)}>
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Tools Reviewed by {selectedExpert.name}</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedExpert(null)}
                className="h-6 w-6 p-0 hover:bg-red-500/10 rounded-full"
              >
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </div>
            <ul className="list-disc pl-5 max-h-64 overflow-y-auto">
              {selectedExpert.toolIds.length > 0 ? (
                selectedExpert.toolIds.map((toolId: string) => (
                  <li key={toolId} className="text-sm text-foreground mb-1">
                    {toolId}
                  </li>
                ))
              ) : (
                <li className="text-sm text-muted-foreground">No tools found.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}