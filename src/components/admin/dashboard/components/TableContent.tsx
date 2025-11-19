import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, ChevronsUpDown, Users, ExternalLink } from "lucide-react";

interface TableContentProps {
  currentTools: any[];
  sortOrder: "asc" | "desc" | "none";
  stoppingToolId: string | null;
  onSortChange: () => void;
  onToolSelect?: (toolId: string) => void;
  onStopTool: (toolId: string) => void;
}

export const TableContent = ({
  currentTools,
  sortOrder,
  stoppingToolId,
  onSortChange,
  onToolSelect,
  onStopTool,
}: TableContentProps) => {
  const getStatusBadge = (status: string) => {
    const variants: any = {
      stopped: "secondary",
      active: "outline",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const handleAssignCoordinators = () => {
    window.open("https://ee.kobotoolbox.org/x/BjUB2L85", "_blank");
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left p-3 font-semibold text-sm">Tool ID</th>
            <th className="text-left p-3 font-semibold text-sm">Tool Name</th>
            <th
              className="text-left p-3 font-semibold text-sm cursor-pointer select-none hover:bg-muted/50 transition-colors"
              onClick={onSortChange}
            >
              <div className="flex items-center gap-1">
                Coordinator
                {sortOrder === "asc" && <ChevronUp className="w-4 h-4" />}
                {sortOrder === "desc" && <ChevronDown className="w-4 h-4" />}
                {sortOrder === "none" && <ChevronsUpDown className="w-4 h-4 opacity-40" />}
              </div>
            </th>
            <th className="text-left p-3 font-semibold text-sm">Submitted Date</th>
            <th className="text-left p-3 font-semibold text-sm">Maturity</th>
            <th className="text-left p-3 font-semibold text-sm">Status</th>
            <th className="text-center p-3 font-semibold text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentTools.map((tool) => (
            <tr key={tool.id} className="border-b border-border hover:bg-muted/50 transition-colors">
              <td className="p-3 font-mono text-sm">{tool.id}</td>
              <td className="p-3 font-medium">{tool.name}</td>
              <td className="p-3 text-sm">
                {tool.coordinator === "Unassigned" || tool.coordinator === "mdii@cgiar.org" ? (
                  <Button
                    onClick={handleAssignCoordinators}
                    className="bg-gradient-to-r from-forest to-primary hover:from-forest/90 hover:to-primary/90 text-sm"
                    size="sm"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Assign
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  tool.coordinator
                )}
              </td>
              <td className="p-3 text-sm">{tool.dateSubmitted || "N/A"}</td>
              <td className="p-3">
                <Badge variant={tool.maturityLevel === "advanced" ? "default" : "secondary"}>
                  {tool.maturityLevel || "N/A"}
                </Badge>
              </td>
              <td className="p-3">{getStatusBadge(tool.status)}</td>
              <td className="p-3 text-center">
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => onToolSelect?.(tool.id)}
                  className="text-primary hover:text-primary/80"
                >
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {currentTools.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No tools found matching your filters.
        </div>
      )}
    </div>
  );
};