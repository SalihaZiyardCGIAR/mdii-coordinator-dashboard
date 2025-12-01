import React from "react";

export const WhatIsMDII: React.FC = () => {
  return (
    <>
      <p className="text-muted-foreground leading-relaxed">
        The Multidimensional Digital Inclusiveness Index (MDII) is a scientific
        framework designed to assess and improve the inclusiveness of digital
        tools in agrisystems, with a particular focus on low- and middle-income
        countries (LMICs). It provides a structured, evidence-based approach to
        evaluating whether digital innovations are accessible, usable, and
        equitable.
      </p>

      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
        <h4 className="font-semibold text-primary mb-2">Fundamental Question</h4>
        <p className="text-sm text-muted-foreground font-medium">
          Are digital tools working for everyone — or just for the digitally
          connected few?
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          In agricultural development, new digital tools are launched every year.
          But many still struggle to serve those most in need, like women, youth,
          rural communities, or people with limited access to technology.
        </p>

        <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
          <h4 className="font-semibold text-purple-900 mb-3">
            Digital inclusiveness goes beyond devices or internet availability
          </h4>
          <div className="space-y-2">
            {[
              "Whether people can understand and trust the tool",
              "Whether the design reflects their needs and context",
              "Whether benefits and risks are fairly distributed",
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                <span className="text-sm text-purple-800">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-muted-foreground leading-relaxed">
        MDII helps developers, researchers, and decision-makers assess these
        issues with structured tools and offers clear, actionable guidance on how
        to improve adoption, trust, and equity.
      </p>

      <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
        <h4 className="font-semibold text-foreground mb-2">
          Core Innovation
        </h4>
        <p className="text-sm text-muted-foreground">
          Its core innovation lies in quantifying digital
          inclusiveness and helping teams move beyond
          assumptions or high-level checklists. MDII offers
          guidance that is grounded, contextual, and focused on
          empowering users.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">MDII helps answer:</h4>
          <ul className="space-y-2">
            {[
              "Is this tool inclusive for users with low access or connectivity?",
              "Where are the gaps in usability, trust, and local alignment?",
              "How can we improve adoption through better design choices?",
              "Are benefits and risks distributed fairly across different user groups?",
            ].map((question, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{question}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Use MDII to:</h4>
          <ul className="space-y-2">
            {[
              "Generate evidence-based recommendations",
              "Evaluate tools online or offline",
              "Compare across teams, tools, and regions",
              "Align with gender and inclusion goals",
            ].map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">
          Applicable tools include:
        </h4>
        <div className="space-y-2">
          <div className="text-sm text-gray-700">
            • Farm advisories, government decision support
            platforms, digital-enabled sensors, etc.
          </div>
          <div className="text-sm text-gray-700">
            • Deployed or in development
          </div>
        </div>
      </div>
    </>
  );
};
