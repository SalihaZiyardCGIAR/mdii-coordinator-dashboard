import React, { useState, useEffect } from "react";
import { Search, Loader2, Award, Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { KOBO_CONFIG } from "@/config/koboConfig";
import { getApiUrl } from "@/config/apiConfig";

interface DomainExpert {
  name: string;
  organization: string;
  domains: string[];
  toolIds: string[];
  maturityType: string;
}

export default function DomainExpertManagement() {
  const [domainExperts, setDomainExperts] = useState<DomainExpert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedExpert, setSelectedExpert] = useState<DomainExpert | null>(null);
  
  // Filter states
  const [selectedMaturity, setSelectedMaturity] = useState<string | "all">("all");
  const [selectedOrganizations, setSelectedOrganizations] = useState<Set<string>>(new Set());
  const [selectedDomains, setSelectedDomains] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [showDomainDropdown, setShowDomainDropdown] = useState(false);

  const expertsPerPage = 10;

  const uniqueOrganizations = Array.from(new Set(domainExperts.map(expert => expert.organization)));
  const uniqueDomains = Array.from(new Set(domainExperts.flatMap(expert => expert.domains)));

  useEffect(() => {
    fetchDomainExperts();
  }, []);

  const fetchDomainExperts = async () => {
    try {
      setLoading(true);

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
              maturityType: "Advanced Stage",
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
              maturityType: "Early Stage",
            });
          }

          const expert = expertMap.get(key)!;

          if (expert.maturityType === "Advanced Stage") {
            expert.maturityType = "Both";
          } else if (expert.maturityType !== "Both") {
            expert.maturityType = "Early Stage";
          }

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
      setDomainExperts(expertList);
    } catch (error) {
      console.error("Error fetching domain experts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredExperts = domainExperts.filter((expert) => {
    const matchesSearch =
      expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.domains.some((domain) => domain.toLowerCase().includes(searchQuery.toLowerCase())) ||
      expert.toolIds.some((toolId) => toolId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMaturity = selectedMaturity === "all" || expert.maturityType === selectedMaturity;
    const matchesOrganization = selectedOrganizations.size === 0 || selectedOrganizations.has(expert.organization);
    const matchesDomain = selectedDomains.size === 0 || expert.domains.some(domain => selectedDomains.has(domain));

    return matchesSearch && matchesMaturity && matchesOrganization && matchesDomain;
  });

  const totalPages = Math.ceil(filteredExperts.length / expertsPerPage);
  const startIndex = (currentPage - 1) * expertsPerPage;
  const paginatedExperts = filteredExperts.slice(startIndex, startIndex + expertsPerPage);

  const activeFilterCount = 
    (selectedMaturity !== "all" ? 1 : 0) +
    selectedOrganizations.size +
    selectedDomains.size;

  const clearAllFilters = () => {
    setSelectedMaturity("all");
    setSelectedOrganizations(new Set());
    setSelectedDomains(new Set());
  };

  const getMaturityClassName = (maturityType: string) => {
    switch (maturityType) {
      case "Both":
        return "inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800";
      case "Advanced Stage":
        return "inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800";
      case "Early Stage":
        return "inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Domain Expert Management</h1>
        <p className="text-gray-600">View domain experts and their expertise areas</p>
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

            {/* Active Filters Display */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {selectedMaturity !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {selectedMaturity}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-destructive" 
                      onClick={() => setSelectedMaturity("all")}
                    />
                  </Badge>
                )}
                {Array.from(selectedOrganizations).map(org => (
                  <Badge key={org} variant="secondary" className="flex items-center gap-1">
                    {org}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-destructive" 
                      onClick={() => {
                        const newSet = new Set(selectedOrganizations);
                        newSet.delete(org);
                        setSelectedOrganizations(newSet);
                      }}
                    />
                  </Badge>
                ))}
                {Array.from(selectedDomains).map(domain => (
                  <Badge key={domain} variant="secondary" className="flex items-center gap-1">
                    {domain}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-destructive" 
                      onClick={() => {
                        const newSet = new Set(selectedDomains);
                        newSet.delete(domain);
                        setSelectedDomains(newSet);
                      }}
                    />
                  </Badge>
                ))}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearAllFilters}
                  className="h-7 text-xs"
                >
                  Clear all
                </Button>
              </div>
            )}

            {/* Expandable Filter Panel */}
            {showFilters && (
              <div className="border-t pt-4 mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Maturity Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Maturity Level</label>
                  <Select value={selectedMaturity} onValueChange={setSelectedMaturity}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Maturity Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Maturity Levels</SelectItem>
                      <SelectItem value="Early Stage">Early Stage</SelectItem>
                      <SelectItem value="Advanced Stage">Advanced Stage</SelectItem>
                      <SelectItem value="Both">Both Stages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
                      {uniqueOrganizations.map((org) => (
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
                      {uniqueDomains.map((domain) => (
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

      {loading && (
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
                      <thead className="bg-muted/50 border-b">
                        <tr>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Organization</th>
                          <th className="text-left py-3 px-8 text-sm font-medium text-muted-foreground">
                            Domains of Expertise
                          </th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                            Maturity
                          </th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                            Tools Reviewed
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedExperts.map((expert, index) => (
                          <tr
                            key={`${expert.name}-${expert.organization}`}
                            className={`border-b hover:bg-muted/30 transition-colors ${
                              index % 2 === 0 ? "bg-background" : "bg-muted/10"
                            }`}
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Award className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-sm">{expert.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-sm text-muted-foreground">{expert.organization}</span>
                            </td>
                            <td className="py-3 px-8">
                              <div className="flex flex-wrap gap-1.5">
                                {expert.domains.map((domain, idx) => (
                                  <Badge key={idx} variant="teal" className="text-xs px-2 py-0.5">
                                    {domain}
                                  </Badge>
                                ))}
                              </div>
                            </td>
                              <td className="py-3 px-4 text-center">
                                <Badge
                                  className={`text-xs font-medium px-3 py-1 ${getMaturityClassName(expert.maturityType)}`}
                                >
                                  {expert.maturityType}
                                </Badge>
                              </td>
                            <td className="py-3 px-4 text-center">
                              <span
                                className="text-sm font-bold text-blue-600 cursor-pointer underline hover:text-blue-700 transition-colors"
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
          selectedExpert.toolIds.map((toolId) => (
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