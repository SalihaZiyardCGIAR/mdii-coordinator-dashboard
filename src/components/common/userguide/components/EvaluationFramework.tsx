import React from "react";
import { HelpCircle } from "lucide-react";

export const EvaluationFramework: React.FC = () => {
  return (
    <>
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground">Methodology</h4>
        <p className="text-muted-foreground leading-relaxed">
          MDII is a structured evaluation framework that
          recognizes the importance of inclusivity at all stages
          of innovation development.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          The framework consists of 90 indicators, which inform
          27 subdimensions of seven dimensions, covering three
          megagroups: Innovation usage, Social consequences, and
          Stakeholder relationships.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          The solution is given a score using a five-tier system
          for inclusivity across each dimension and
          subdimension. This makes it simple to identify points
          of strength and areas for improvement.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Based on this data, domain expertise and input from
          stakeholders, the evaluation team provides
          recommendations and actionable insights for
          improvement.
        </p>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-foreground">Framework Structure</h4>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              title: "7 Dimensions",
              desc: "Core areas covering all aspects of digital tool inclusiveness",
            },
            {
              title: "27 Subdimensions",
              desc: "Focused areas within each major dimension for targeted assessment",
            },
            {
              title: "90 Indicators",
              desc: "Detailed metrics that capture specific aspects of digital inclusiveness",
            },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-orange-50 border border-orange-200">
              <h5 className="font-medium text-sm text-orange-900 mb-2">
                {item.title}
              </h5>
              <p className="text-xs text-orange-800">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-foreground">Explore the Framework</h4>
        <p className="text-muted-foreground leading-relaxed">
          Click the sunburst image below to explore what's inside the MDII Index.
        </p>

        <div className="mt-6 rounded-lg border overflow-hidden">
          <iframe
            title="MDII Sunburst"
            src="/MDII-sunburst_offline-manual.html"
            className="w-full"
            style={{ height: 520, border: "0" }}
          />
        </div>

        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm text-primary">
              Interactive Framework Explorer
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            The interactive sunburst visualization will be available in the full
            MDII platform, allowing you to explore the complete framework structure
            and understand how indicators map to subdimensions and dimensions.
          </p>
        </div>
      </div>
    </>
  );
};