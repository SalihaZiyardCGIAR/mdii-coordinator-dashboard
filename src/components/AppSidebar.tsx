import { BarChart3, Search, LogOut, MessageSquare, BookOpen, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AppSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isAdmin?: boolean;
}

const menuItems = [
  {
    id: "overview",
    title: "Dashboard Overview",
    icon: BarChart3,
  },
  {
    id: "tool-details",
    title: "Tool Details",
    icon: Search,
  },
  {
    id: "feedback",
    title: "Feedback & Support",
    icon: MessageSquare,
  },
  {
    id: "user-guide",
    title: "User Guide",
    icon: BookOpen,
  },
];

export function AppSidebar({ currentView, onViewChange, isAdmin }: AppSidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("coordinatorEmail");
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  return (
    <Sidebar className="border-r border-border bg-card/50 backdrop-blur-sm">
      <SidebarHeader className="border-b border-border p-6">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 ${isAdmin ? 'bg-gradient-to-br from-forest to-primary' : 'bg-gradient-to-br from-forest to-primary'} rounded-lg flex items-center justify-center`}>
            {isAdmin ? <Shield className="w-4 h-4 text-primary-foreground" /> : <BarChart3 className="w-4 h-4 text-primary-foreground" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-foreground">
                {isAdmin ? "Admin Portal" : "Coordinator Portal"}
              </h2>
              {isAdmin && (
                <Badge variant="default" className="text-xs">
                  Admin
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">MDII Tools</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onViewChange(item.id)}
                    isActive={currentView === item.id}
                    className="w-full justify-start"
                  >
                    <item.icon className="w-4 h-4" />
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4">
          <Button onClick={handleLogout} variant="outline" className="w-full justify-start gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}