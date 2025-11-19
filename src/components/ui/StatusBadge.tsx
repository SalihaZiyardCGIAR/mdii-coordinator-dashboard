import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: "active" | "stopped" | string;
  variant?: "default" | "outline";
}

export const StatusBadge = ({ status, variant = "default" }: StatusBadgeProps) => {
  switch (status) {
    case "stopped":
      return <Badge variant="secondary">Stopped</Badge>;
    case "active":
      return (
        <Badge className="bg-success/20 text-[#2A4779] border-success/30">
          Active
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};