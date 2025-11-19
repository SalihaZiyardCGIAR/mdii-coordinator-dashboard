import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { TableFilters } from "./TableFilters";
import { TableContent } from "./TableContent";
import { TablePagination } from "./TablePagination";

interface ToolsTableProps {
  currentTools: any[];
  filteredTools: any[];
  searchTerm: string;
  dateFilter: string;
  coordinatorFilter: string;
  customDateRange: { from?: Date; to?: Date };
  sortOrder: "asc" | "desc" | "none";
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  stoppingToolId: string | null;
  onSearchChange: (value: string) => void;
  onDateFilterChange: (value: string) => void;
  onCoordinatorFilterChange: (value: string) => void;
  onCustomDateRangeChange: (range: { from?: Date; to?: Date }) => void;
  onSortChange: () => void;
  onPageChange: (page: number) => void;
  onToolSelect?: (toolId: string) => void;
  onStopTool: (toolId: string) => void;
}

export const ToolsTable = ({
  currentTools,
  filteredTools,
  searchTerm,
  dateFilter,
  coordinatorFilter,
  customDateRange,
  sortOrder,
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  stoppingToolId,
  onSearchChange,
  onDateFilterChange,
  onCoordinatorFilterChange,
  onCustomDateRangeChange,
  onSortChange,
  onPageChange,
  onToolSelect,
  onStopTool,
}: ToolsTableProps) => {
  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle>All Tools</CardTitle>
        <CardDescription>Complete overview of all research tools in the system</CardDescription>
        
        <TableFilters
          searchTerm={searchTerm}
          dateFilter={dateFilter}
          coordinatorFilter={coordinatorFilter}
          customDateRange={customDateRange}
          onSearchChange={onSearchChange}
          onDateFilterChange={onDateFilterChange}
          onCoordinatorFilterChange={onCoordinatorFilterChange}
          onCustomDateRangeChange={onCustomDateRangeChange}
        />
      </CardHeader>
      
      <CardContent>
        <TableContent
          currentTools={currentTools}
          sortOrder={sortOrder}
          stoppingToolId={stoppingToolId}
          onSortChange={onSortChange}
          onToolSelect={onToolSelect}
          onStopTool={onStopTool}
        />

        {totalPages > 1 && (
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={filteredTools.length}
            onPageChange={onPageChange}
          />
        )}
      </CardContent>
    </Card>
  );
};