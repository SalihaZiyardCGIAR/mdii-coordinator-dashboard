import { useState, useMemo } from "react";

export const useToolFilters = (allTools: any[], sortOrder: "asc" | "desc" | "none") => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("entire");
  const [coordinatorFilter, setCoordinatorFilter] = useState<string>("all");
  const [customDateRange, setCustomDateRange] = useState<{ from?: Date; to?: Date }>({});

  const filteredTools = useMemo(() => {
    // Filter by date
    const getFilteredByDate = (tools: typeof allTools) => {
      if (dateFilter === "entire") return tools;

      const now = new Date();
      return tools.filter((tool) => {
        const toolDate = tool.dateSubmitted ? new Date(tool.dateSubmitted) : null;
        if (!toolDate) return false;

        switch (dateFilter) {
          case "week": {
            const weekAgo = new Date(now);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return toolDate >= weekAgo;
          }
          case "month": {
            const monthAgo = new Date(now);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return toolDate >= monthAgo;
          }
          case "custom": {
            if (customDateRange.from && customDateRange.to) {
              return toolDate >= customDateRange.from && toolDate <= customDateRange.to;
            }
            if (customDateRange.from) {
              return toolDate >= customDateRange.from;
            }
            if (customDateRange.to) {
              return toolDate <= customDateRange.to;
            }
            return true;
          }
          default:
            return true;
        }
      });
    };

    // Filter by coordinator status
    const getFilteredByCoordinator = (tools: typeof allTools) => {
      if (coordinatorFilter === "all") return tools;

      return tools.filter((tool) => {
        const isUnassigned = tool.coordinator === "Unassigned" || tool.coordinator === "mdii@cgiar.org";
        return coordinatorFilter === "assigned" ? !isUnassigned : isUnassigned;
      });
    };

    // Apply filters
    let result = getFilteredByCoordinator(getFilteredByDate(allTools)).filter(
      (tool) =>
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.coordinator.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply sorting
    if (sortOrder !== "none") {
      result.sort((a, b) => {
        const coordA = (a.coordinator || "").toLowerCase();
        const coordB = (b.coordinator || "").toLowerCase();
        return sortOrder === "asc" ? coordA.localeCompare(coordB) : coordB.localeCompare(coordA);
      });
    }

    return result;
  }, [allTools, searchTerm, dateFilter, coordinatorFilter, customDateRange, sortOrder]);

  return {
    searchTerm,
    setSearchTerm,
    dateFilter,
    setDateFilter,
    coordinatorFilter,
    setCoordinatorFilter,
    customDateRange,
    setCustomDateRange,
    filteredTools,
  };
};