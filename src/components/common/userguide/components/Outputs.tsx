import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, FileText, Lightbulb, ChevronDown, HelpCircle, AlertCircle, ArrowDown, CheckCircle } from "lucide-react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@radix-ui/react-collapsible";
import { Separator } from "@radix-ui/react-separator";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const Outputs: React.FC = () => {
  return (
    <>
      <div className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20">
        <p className="text-muted-foreground leading-relaxed">
                          Once you complete your evaluation, the MDII Desktop
                          App provides both a final score and a set of
                          actionable recommendations. But how do you make sense
                          of these outputs? This section guides you through
                          interpreting results, identifying patterns, and
                          planning next steps for improvement.
        </p>
      </div>

      <Tabs defaultValue="score-tiers" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="score-tiers" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Score Tiers
          </TabsTrigger>
          <TabsTrigger value="interpreting" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Interpreting Results
          </TabsTrigger>
          <TabsTrigger value="outputs" className="gap-2">
            <FileText className="w-4 h-4" />
            What You'll Receive
          </TabsTrigger>
        </TabsList>

        <TabsContent value="score-tiers" className="space-y-4">
          <div className="p-4 rounded-lg border border-border bg-card">
            <h4 className="font-semibold mb-4 text-foreground">
              Overall MDII Score Tiers
            </h4>
            <div className="space-y-2">
              {[
                {
                  range: "90–100%",
                  label: "Exceeding Expectations",
                  color: "bg-green-100 text-green-800 border-green-200",
                },
                {
                  range: "70–89%",
                  label: "Meeting Expectations",
                  color: "bg-blue-100 text-blue-800 border-blue-200",
                },
                {
                  range: "50–69%",
                  label: "Approaching Expectations",
                  color: "bg-yellow-100 text-yellow-800 border-yellow-200",
                },
                {
                  range: "25–49%",
                  label: "Below Expectations",
                  color: "bg-orange-100 text-orange-800 border-orange-200",
                },
                {
                  range: "0–24%",
                  label: "Significantly Below Expectations",
                  color: "bg-red-100 text-red-800 border-red-200",
                },
              ].map((tier, index) => (
                <div
                  key={index}
                  className={`p-3 rounded border text-sm ${tier.color}`}
                >
                  <span className="font-medium">{tier.range}:</span> {tier.label}
                </div>
              ))}
            </div>
                                        {/* Score Tiers FAQ */}
                            <Separator className="my-4" />
                            <div className="space-y-3">
                              <h5 className="font-medium text-sm text-foreground">
                                Frequently Asked Questions
                              </h5>

                              <Collapsible>
                                <CollapsibleTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-between text-left p-2 h-auto"
                                  >
                                    <span className="text-sm flex items-center gap-2">
                                      <HelpCircle className="w-4 h-4" />
                                      What if my score is low?
                                    </span>
                                    <ChevronDown className="w-4 h-4" />
                                  </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="px-2 pt-2">
                                  <p className="text-sm text-muted-foreground">
                                    A low score is an opportunity, not a
                                    failure. Focus on the Recommendation Brief
                                    to identify quick wins and high-impact
                                    improvements. Many tools start with lower
                                    scores and improve significantly through
                                    iterative enhancements.
                                  </p>
                                </CollapsibleContent>
                              </Collapsible>

                              <Collapsible>
                                <CollapsibleTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-between text-left p-2 h-auto"
                                  >
                                    <span className="text-sm flex items-center gap-2">
                                      <HelpCircle className="w-4 h-4" />
                                      How are tiers calculated?
                                    </span>
                                    <ChevronDown className="w-4 h-4" />
                                  </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="px-2 pt-2">
                                  <p className="text-sm text-muted-foreground">
                                    Tiers are based on weighted averages across
                                    seven dimensions, incorporating input from
                                    innovators, domain experts, end-users, and
                                    downstream beneficiaries. Each user type
                                    contributes different perspectives to create
                                    a comprehensive inclusiveness score.
                                  </p>
                                </CollapsibleContent>
                              </Collapsible>
                            </div>
          </div>
          
        </TabsContent>

                        {/* Interpreting Results Tab */}
                        <TabsContent value="interpreting" className="space-y-4">
                          <div className="p-4 rounded-lg bg-muted/30 border border-muted-foreground/20">
                            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                              <Lightbulb className="w-5 h-5 text-primary" />
                              MDII Is Not a Judgment Tool — It's a Feedforward
                              System
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              The MDII evaluation was designed to shift the
                              mindset away from static scoring and toward
                              informed improvement. It's not just about how
                              inclusive your tool is today — it's about how it
                              can become more inclusive tomorrow.
                            </p>
                          </div>

                          {/* Guided Steps */}
                          <div className="space-y-4">
                            <h5 className="font-semibold text-foreground">
                              How to Read Your Report: Step-by-Step Guide
                            </h5>

                            <div className="space-y-3">
                              {[
                                {
                                  step: 1,
                                  title: "Start with Your Tier",
                                  description:
                                    "The overall percentage and tier help situate the tool — but it's just the beginning. Don't fixate on the number, focus on the why behind each score.",
                                  color:
                                    "bg-blue-50 border-blue-200 text-blue-800",
                                },
                                {
                                  step: 2,
                                  title: "Dive into Each Dimension",
                                  description:
                                    "Examine each of the seven dimensions. Where is the tool already aligned with inclusion goals? Where are the blind spots (e.g., data risks, downstream access, training gaps)?",
                                  color:
                                    "bg-green-50 border-green-200 text-green-800",
                                },
                                {
                                  step: 3,
                                  title: "Compare by User Type",
                                  description:
                                    "Different respondents offer distinct perspectives. If scores diverge across innovators, experts, and end-users — that's a signal, not a problem.",
                                  color:
                                    "bg-purple-50 border-purple-200 text-purple-800",
                                },
                                {
                                  step: 4,
                                  title: "Use Your Recommendation Brief",
                                  description:
                                    "Each tool receives tailored, evidence-based suggestions. These prioritize low-effort, high-impact improvements and guide internal discussions.",
                                  color:
                                    "bg-orange-50 border-orange-200 text-orange-800",
                                },
                              ].map((item, index) => (
                                <div
                                  key={index}
                                  className={`p-4 rounded-lg border ${item.color}`}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center font-bold text-sm">
                                      {item.step}
                                    </div>
                                    <div>
                                      <h6 className="font-medium text-sm mb-1">
                                        {item.title}
                                      </h6>
                                      <p className="text-sm opacity-80">
                                        {item.description}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/30">
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-secondary" />
                              <strong>Pro Tip:</strong> MDII evaluations can be
                              repeated after modifications to track improvements
                              over time.
                            </p>
                          </div>

                          {/* Common Scenarios & Next Steps */}
                          <div className="space-y-4 mt-6">
                            <h4 className="font-semibold text-foreground">
                              Common Scenarios & Next Steps
                            </h4>
                            <div className="grid md:grid-cols-3 gap-4">
                              <Card className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-sm flex items-center gap-2">
                                    <ArrowDown className="w-4 h-4 text-orange-600" />
                                    "Our score was 43%"
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  <p className="text-sm text-muted-foreground mb-3">
                                    You're in the "Below Expectations" tier, but
                                    this is your starting point for improvement.
                                  </p>
                                  <div className="space-y-2">
                                    <p className="text-xs font-medium">
                                      Next Steps:
                                    </p>
                                    <ul className="text-xs text-muted-foreground space-y-1">
                                      <li>
                                        • Focus on Recommendation Brief quick
                                        wins
                                      </li>
                                      <li>
                                        • Identify 2-3 dimensions with lowest
                                        scores
                                      </li>
                                      <li>
                                        • Plan iterative improvements over 3-6
                                        months
                                      </li>
                                    </ul>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-sm flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-purple-600" />
                                    "Views Conflict"
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  <p className="text-sm text-muted-foreground mb-3">
                                    Innovators rate high but end-users score
                                    low? This reveals important gaps in
                                    perception vs. reality.
                                  </p>
                                  <div className="space-y-2">
                                    <p className="text-xs font-medium">
                                      Why It Matters:
                                    </p>
                                    <ul className="text-xs text-muted-foreground space-y-1">
                                      <li>
                                        • Shows disconnect between design intent
                                        and user experience
                                      </li>
                                      <li>
                                        • Highlights need for user-centered
                                        improvements
                                      </li>
                                      <li>
                                        • Indicates areas for stakeholder
                                        alignment
                                      </li>
                                    </ul>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-sm flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                    "We Improved!"
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  <p className="text-sm text-muted-foreground mb-3">
                                    From 43% to 67% in 3 months by following the
                                    Recommendation Brief systematically.
                                  </p>
                                  <div className="space-y-2">
                                    <p className="text-xs font-medium">
                                      Success Strategy:
                                    </p>
                                    <ul className="text-xs text-muted-foreground space-y-1">
                                      <li>• Implemented quick wins first</li>
                                      <li>
                                        • Focused on user training and support
                                      </li>
                                      <li>• Re-evaluated to track progress</li>
                                    </ul>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="outputs" className="space-y-4">
                          <p className="text-muted-foreground">
                            After running your evaluation, the MDII Desktop App
                            will generate two key outputs:
                          </p>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-card border border-border">
                              <h5 className="font-semibold text-sm mb-3 text-foreground flex items-center gap-2">
                                <FileText className="w-4 h-4 text-secondary" />
                                1. Score Report (PDF)
                              </h5>
                              <p className="text-sm text-muted-foreground mb-3">
                                This file provides the overall result, presented
                                as:
                              </p>
                              <ul className="space-y-1 text-sm text-muted-foreground mb-3">
                                <li>• A percentage score (0–100%)</li>
                                <li>
                                  • A tier label (as shown in Score Tiers)
                                </li>
                                <li>• A breakdown across each dimension</li>
                                <li>
                                  • A visual spider/radar chart showing
                                  strengths and gaps
                                </li>
                                <li>
                                  • Tables summarizing results by user type and
                                  version
                                </li>
                              </ul>
                              <div className="p-2 rounded bg-secondary/20 border border-secondary/30">
                                <p className="text-xs font-medium text-secondary-foreground">
                                  Use this score report as a snapshot of where
                                  the tool stands today.
                                </p>
                              </div>
                            </div>

                            <div className="p-4 rounded-lg bg-card border border-border">
                              <h5 className="font-semibold text-sm mb-3 text-foreground flex items-center gap-2">
                                <Lightbulb className="w-4 h-4 text-accent" />
                                2. Recommendation Brief (PDF)
                              </h5>
                              <p className="text-sm text-muted-foreground mb-3">
                                This second file provides:
                              </p>
                              <ul className="space-y-1 text-sm text-muted-foreground mb-3">
                                <li>
                                  • Targeted suggestions for each MDII dimension
                                </li>
                                <li>
                                  • Practical actions framed as "Possible
                                  actions to reach the next tier"
                                </li>
                                <li>
                                  • A tier legend showing where the tool
                                  currently sits per dimension
                                </li>
                                <li>
                                  • Highlighted quick wins — low-effort changes
                                  with high inclusiveness value
                                </li>
                              </ul>
                              <div className="p-2 rounded bg-accent/20 border border-accent/30">
                                <p className="text-xs font-medium text-foreground">
                                  Use this brief as a planning and discussion
                                  tool with your team or partners.
                                </p>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
      </Tabs>
    </>
  );
};
