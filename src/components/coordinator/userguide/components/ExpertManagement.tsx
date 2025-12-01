import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ExpertManagement: React.FC = () => {
  return (
    <>
      <p className="text-muted-foreground leading-relaxed">
        Managing domain experts and their contributions to the MDII evaluation.
      </p>

      <Tabs defaultValue="role" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="role" className="text-xs">
            Expert Roles
          </TabsTrigger>
          <TabsTrigger value="criteria" className="text-xs">
            Selection Criteria
          </TabsTrigger>
          <TabsTrigger value="process" className="text-xs">
            Selection Process
          </TabsTrigger>
        </TabsList>

        <TabsContent value="role" className="mt-6">
          <div className="p-6 rounded-lg bg-gray-50 border border-gray-200">
            <h4 className="font-semibold text-foreground mb-4">
              Role of Domain Experts
            </h4>
            <div className="space-y-4">
                              <p className="text-muted-foreground leading-relaxed">
                                Domain experts provide an independent
                                perspective on how inclusive a digital tool is
                                across critical dimensions like GESI, ICT, Data,
                                Economics, and more. They{" "}
                                <strong>
                                  do not represent tool developers or project
                                  teams
                                </strong>
                                . Their role is to apply their subject-matter
                                knowledge to interpret and assess the
                                information provided by innovators.
                              </p>
                              <p className="text-muted-foreground leading-relaxed">
                                Each MDII evaluation should include at least one
                                expert per relevant domain, depending on the
                                version being used (Regular or Ex-Ante). These
                                experts help validate the inclusiveness of the
                                tool from different disciplinary angles.
                              </p>
                            </div>
          </div>
        </TabsContent>

        <TabsContent value="criteria" className="mt-6">
          <div className="p-6 rounded-lg bg-gray-50 border border-gray-200">
            <h4 className="font-semibold text-foreground mb-4">
                              Selection Criteria
                            </h4>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                              Domain experts can be internal or external to the
                              organization conducting the evaluation, but they
                              must meet two key criteria:
                            </p>

                            <div className="space-y-4">
                              <div className="p-4 rounded-lg bg-muted/30 border border-muted-foreground/20">
                                <h5 className="font-semibold text-sm mb-3 text-foreground">
                                  1. Subject-matter Relevance
                                </h5>
                                <p className="text-sm text-muted-foreground mb-3">
                                  The individual should have recognized
                                  expertise in one of the required domains:
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                  {[
                                    "Gender Equality and Social Inclusion",
                                    "Information and Communication Technologies",
                                    "Data",
                                    "Economics",
                                    "Human-Centered Design (Regular Version only)",
                                    "Country Expert",
                                  ].map((domain, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-2 text-sm text-muted-foreground"
                                    >
                                      <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                      {domain}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="p-4 rounded-lg bg-muted/30 border border-muted-foreground/20">
                                <h5 className="font-semibold text-sm mb-2 text-foreground">
                                  2. Independence from the Tool
                                </h5>
                                <p className="text-sm text-muted-foreground">
                                  Experts must not have been involved in the
                                  development, design, implementation, or
                                  promotion of the tool under evaluation. Their
                                  perspective should be impartial and based on
                                  professional knowledge of the domain.
                                </p>
                              </div>
                            </div>
          </div>
        </TabsContent>

        <TabsContent value="process" className="mt-6">
          <div className="p-6 rounded-lg bg-gray-50 border border-gray-200">
            <p className="text-muted-foreground leading-relaxed mb-4">
                              The person coordinating the evaluation should take
                              the following steps:
                            </p>

                            <div className="space-y-2 mb-6">
                              {[
                                "Start with your institution or program team - look for subject-matter expertise without direct tool involvement",
                                "Expand to trusted networks - partner institutions, universities, domain-specific networks",
                                "Verify eligibility - ensure both domain relevance and independence criteria are met",
                                "Send clear invitation - explain purpose, contribution, time commitment (30-60 minutes), and importance of independence",
                              ].map((step, index) => (
                                <div
                                  key={index}
                                  className="p-3 rounded-lg bg-muted/20 border border-muted-foreground/10"
                                >
                                  <span className="font-medium text-sm text-foreground">
                                    {index + 1}.{" "}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    {step}
                                  </span>
                                </div>
                              ))}
                            </div>

                            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                              <h4 className="font-semibold text-sm mb-2 text-primary">
                                Coordination Tips
                              </h4>
                              <ul className="space-y-1">
                                {[
                                  "Aim for diversity across the expert pool—gender, geography, and institutional backgrounds",
                                  "Experts can be identified at any stage, but surveys should only be shared after innovator inputs are complete",
                                  "Keep track of which domains have been assigned and who is responsible for each",
                                ].map((tip, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-2 text-sm text-muted-foreground"
                                  >
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};
