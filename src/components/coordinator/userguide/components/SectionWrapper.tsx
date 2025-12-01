import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SectionWrapperProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  isActive: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  id,
  title,
  icon,
  isActive,
  onToggle,
  children,
}) => {
  return (
    <Card id={id} className={`glassmorphism ${isActive ? "" : "hidden"}`}>
      <Collapsible open={isActive} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-4 cursor-pointer hover:bg-yellow-50 transition-colors rounded-t-lg">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/5">{icon}</div>
                {title}
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-6">{children}</CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
