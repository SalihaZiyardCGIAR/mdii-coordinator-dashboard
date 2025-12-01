import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Settings, CheckCircle, HelpCircle } from "lucide-react";

export const Troubleshooting: React.FC = () => {
  return (
    <>
      <div className="p-4 rounded-lg bg-gradient-to-r from-red-500/5 to-orange-500/5 border border-red-500/20">
        <p className="text-muted-foreground leading-relaxed">
          Encountering issues with the MDII Desktop App or evaluation process? This
          section provides solutions to common problems.
        </p>
      </div>

      <Tabs defaultValue="common-issues" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="common-issues" className="gap-2">
            <AlertCircle className="w-4 h-4" />
            Common Issues
          </TabsTrigger>
          <TabsTrigger value="app-problems" className="gap-2">
            <Settings className="w-4 h-4" />
            App Problems
          </TabsTrigger>
          <TabsTrigger value="evaluation-help" className="gap-2">
            <CheckCircle className="w-4 h-4" />
            Evaluation Help
          </TabsTrigger>
        </TabsList>

                        {/* Common Issues Tab */}
                        <TabsContent
                          value="common-issues"
                          className="space-y-4"
                        >
                          <div className="space-y-4">
                            <h4 className="font-semibold text-foreground">
                              Frequently Encountered Problems
                            </h4>

                            <div className="space-y-4">
                              <div className="p-4 rounded-lg border border-border bg-card">
                                <h5 className="font-medium text-foreground mb-2 flex items-center gap-2">
                                  <AlertCircle className="w-4 h-4 text-amber-600" />
                                  Tool Not Loading Properly
                                </h5>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                  <p>
                                    <strong>Symptoms:</strong> App crashes,
                                    blank screens, or frozen interface
                                  </p>
                                  <p>
                                    <strong>Solutions:</strong>
                                  </p>
                                  <ul className="ml-4 space-y-1">
                                    <li>• Restart the MDII Desktop App</li>
                                    <li>• Check your internet connection</li>
                                    <li>
                                      • Clear application cache and restart
                                    </li>
                                    <li>
                                      • Ensure you have sufficient system memory
                                      available
                                    </li>
                                  </ul>
                                </div>
                              </div>

                              <div className="p-4 rounded-lg border border-border bg-card">
                                <h5 className="font-medium text-foreground mb-2 flex items-center gap-2">
                                  <AlertCircle className="w-4 h-4 text-amber-600" />
                                  Survey Responses Not Saving
                                </h5>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                  <p>
                                    <strong>Symptoms:</strong> Progress lost
                                    when returning to surveys
                                  </p>
                                  <p>
                                    <strong>Solutions:</strong>
                                  </p>
                                  <ul className="ml-4 space-y-1">
                                    <li>
                                      • Check network connectivity during survey
                                      completion
                                    </li>
                                    <li>
                                      • Complete surveys in one session when
                                      possible
                                    </li>
                                    <li>
                                      • Use the "Save Progress" feature
                                      regularly
                                    </li>
                                    <li>
                                      • Avoid browser refresh during survey
                                      completion
                                    </li>
                                  </ul>
                                </div>
                              </div>

                              <div className="p-4 rounded-lg border border-border bg-card">
                                <h5 className="font-medium text-foreground mb-2 flex items-center gap-2">
                                  <AlertCircle className="w-4 h-4 text-amber-600" />
                                  Incorrect Tool Version Selected
                                </h5>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                  <p>
                                    <strong>Symptoms:</strong> Evaluation
                                    questions don't match your tool's maturity
                                    level
                                  </p>
                                  <p>
                                    <strong>Solutions:</strong>
                                  </p>
                                  <ul className="ml-4 space-y-1">
                                    <li>
                                      • Verify your tool profile in the database
                                      is accurate
                                    </li>
                                    <li>
                                      • Contact support if automatic detection
                                      seems incorrect
                                    </li>
                                    <li>
                                      • Review tool maturity criteria to confirm
                                      appropriate version
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        {/* App Problems Tab */}
                        <TabsContent value="app-problems" className="space-y-4">
                          <div className="space-y-4">
                            <h4 className="font-semibold text-foreground">
                              Desktop Application Issues
                            </h4>

                            <div className="space-y-4">
                              <div className="p-4 rounded-lg border border-border bg-card">
                                <h5 className="font-medium text-foreground mb-2">
                                  Installation Problems
                                </h5>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                  <ul className="space-y-1">
                                    <li>
                                      • Ensure your system meets minimum
                                      requirements
                                    </li>
                                    <li>
                                      • Run installer as administrator (Windows)
                                    </li>
                                    <li>
                                      • Check available disk space (minimum
                                      500MB required)
                                    </li>
                                    <li>
                                      • Temporarily disable antivirus during
                                      installation
                                    </li>
                                  </ul>
                                </div>
                              </div>

                              <div className="p-4 rounded-lg border border-border bg-card">
                                <h5 className="font-medium text-foreground mb-2">
                                  Performance Issues
                                </h5>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                  <ul className="space-y-1">
                                    <li>
                                      • Close unnecessary applications to free
                                      up memory
                                    </li>
                                    <li>
                                      • Check for app updates in the settings
                                      menu
                                    </li>
                                    <li>
                                      • Restart your computer if app becomes
                                      sluggish
                                    </li>
                                    <li>
                                      • Consider upgrading RAM if consistently
                                      slow
                                    </li>
                                  </ul>
                                </div>
                              </div>

                              <div className="p-4 rounded-lg border border-border bg-card">
                                <h5 className="font-medium text-foreground mb-2">
                                  Data Sync Issues
                                </h5>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                  <ul className="space-y-1">
                                    <li>
                                      • Verify internet connection stability
                                    </li>
                                    <li>
                                      • Check firewall settings aren't blocking
                                      the app
                                    </li>
                                    <li>
                                      • Try manual sync from the settings menu
                                    </li>
                                    <li>
                                      • Contact support if sync consistently
                                      fails
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        {/* Evaluation Help Tab */}
                        <TabsContent
                          value="evaluation-help"
                          className="space-y-4"
                        >
                          <div className="space-y-4">
                            <h4 className="font-semibold text-foreground">
                              Evaluation Process Support
                            </h4>

                            <div className="space-y-4">
                              <div className="p-4 rounded-lg border border-border bg-card">
                                <h5 className="font-medium text-foreground mb-2">
                                  Understanding Questions
                                </h5>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                  <ul className="space-y-1">
                                    <li>
                                      • Use the built-in help tooltips next to
                                      each question
                                    </li>
                                    <li>
                                      • Refer to the framework documentation for
                                      detailed definitions
                                    </li>
                                    <li>
                                      • Contact your evaluation coordinator for
                                      clarification
                                    </li>
                                    <li>
                                      • Mark questions for review and return
                                      later if needed
                                    </li>
                                  </ul>
                                </div>
                              </div>

                              <div className="p-4 rounded-lg border border-border bg-card">
                                <h5 className="font-medium text-foreground mb-2">
                                  Expert Panel Coordination
                                </h5>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                  <ul className="space-y-1">
                                    <li>
                                      • Ensure all experts have completed their
                                      individual evaluations
                                    </li>
                                    <li>
                                      • Schedule consensus meetings well in
                                      advance
                                    </li>
                                    <li>
                                      • Prepare discussion points for areas with
                                      high disagreement
                                    </li>
                                    <li>
                                      • Use the disagreement reports to focus
                                      discussions efficiently
                                    </li>
                                  </ul>
                                </div>
                              </div>

                              <div className="p-4 rounded-lg border border-border bg-card">
                                <h5 className="font-medium text-foreground mb-2">
                                  Report Generation Problems
                                </h5>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                  <ul className="space-y-1">
                                    <li>
                                      • Ensure all required sections are
                                      completed before generating reports
                                    </li>
                                    <li>
                                      • Check that expert consensus has been
                                      reached for all dimensions
                                    </li>
                                    <li>
                                      • Verify PDF export settings match your
                                      organization's requirements
                                    </li>
                                    <li>
                                      • Try regenerating reports if initial
                                      export appears incomplete
                                    </li>
                                  </ul>
                                </div>
                              </div>

                              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                                <h5 className="font-medium text-primary mb-2 flex items-center gap-2">
                                  <HelpCircle className="w-4 h-4" />
                                  Need Additional Help?
                                </h5>
                                <p className="text-sm text-muted-foreground mb-3">
                                  If you're still experiencing issues after
                                  trying these solutions:
                                </p>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  <li>
                                    • Document the specific error messages or
                                    behaviors
                                  </li>
                                  <li>
                                    • Note your system specifications and app
                                    version
                                  </li>
                                  <li>
                                    • Contact technical support with detailed
                                    information
                                  </li>
                                  <li>
                                    • Consider scheduling a screen-share session
                                    for complex issues
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
      </Tabs>
    </>
  );
};