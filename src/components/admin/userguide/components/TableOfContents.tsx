import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
}

interface TableOfContentsProps {
  sections: Section[];
  activeSection: string | null;
  onSectionClick: (sectionId: string) => void;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  sections,
  activeSection,
  onSectionClick,
}) => {
  return (
    <div className="w-64 flex-shrink-0 h-fit">
      <Card className="glassmorphism sticky top-20">
        <CardHeader>
          <CardTitle className="text-sm">Table of Contents</CardTitle>
        </CardHeader>
        <CardContent>
          <nav className="space-y-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSectionClick(section.id);
                }}
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors group outline-none focus:outline-none ${
                  activeSection === section.id
                    ? "bg-yellow-100"
                    : "hover:bg-yellow-50"
                }`}
              >
                <div className={`p-1.5 rounded-md ${section.color}`}>
                  {section.icon}
                </div>
                <span
                  className={`text-sm font-medium ${
                    activeSection === section.id
                      ? "text-primary font-semibold"
                      : "text-foreground group-hover:text-primary"
                  }`}
                >
                  {section.title}
                </span>
              </a>
            ))}
          </nav>
        </CardContent>
      </Card>
    </div>
  );
};
