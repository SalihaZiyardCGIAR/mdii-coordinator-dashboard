import React from "react";
import {
  Lightbulb,
  Shield,
  Settings,
  Globe,
  Users,
  UserCheck,
  BarChart3,
  FileText,
  HelpCircle,
  BookOpen,
} from "lucide-react";

export const useSections = () => {
  return [
    {
      id: "what-is-mdii",
      title: "1. What is MDII?",
      icon: <Lightbulb className="w-5 h-5 text-primary/70" />,
      color: "bg-primary/5",
    },
    {
      id: "evaluation-framework",
      title: "2. Evaluation Framework",
      icon: <Shield className="w-5 h-5 text-primary/70" />,
      color: "bg-primary/5",
    },
    {
      id: "how-mdii-works",
      title: "3. MDII Components",
      icon: <Settings className="w-5 h-5 text-primary/70" />,
      color: "bg-primary/5",
    },
    {
      id: "mdii-ecosystem",
      title: "4. MDII Ecosystem",
      icon: <Globe className="w-5 h-5 text-primary/70" />,
      color: "bg-primary/5",
    },
    {
      id: "user-types",
      title: "5. User Types",
      icon: <Users className="w-5 h-5 text-primary/70" />,
      color: "bg-primary/5",
    },
    {
      id: "expert-management",
      title: "6. Expert Management",
      icon: <UserCheck className="w-5 h-5 text-primary/70" />,
      color: "bg-primary/5",
    },
    {
      id: "evaluation-process",
      title: "7. Evaluation Workflow",
      icon: <BarChart3 className="w-5 h-5 text-primary/70" />,
      color: "bg-primary/5",
    },
    {
      id: "outputs",
      title: "8. Outputs",
      icon: <FileText className="w-5 h-5 text-primary/70" />,
      color: "bg-primary/5",
    },
    {
      id: "troubleshooting",
      title: "9. Troubleshooting",
      icon: <HelpCircle className="w-5 h-5 text-primary/70" />,
      color: "bg-primary/5",
    },
    {
      id: "additional-support",
      title: "10. Additional Support",
      icon: <HelpCircle className="w-5 h-5 text-primary/70" />,
      color: "bg-primary/5",
    },
    {
      id: "further-reading",
      title: "11. Further Reading",
      icon: <BookOpen className="w-5 h-5 text-primary/70" />,
      color: "bg-primary/5",
    },
    {
      id: "acknowledgments",
      title: "12. Acknowledgments & Development Team",
      icon: <Users className="w-5 h-5 text-primary/70" />,
      color: "bg-primary/5",
    },
  ];
};