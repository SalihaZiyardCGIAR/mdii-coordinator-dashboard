import React from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";


export const EvaluationWorkflow: React.FC = () => {
  const steps = [
    {
      step: 1,
      title: "Request Code",
      duration: "2-3 minutes (internet required)",
      color: "#F4E9FF",
      borderColor: "#F1E3FF",
      textColor: "text-purple-600",
      content: "Start by submitting an evaluation request.",
    },
    {
      step: 2,
      title: "Innovator Survey",
      duration: "immediate, 0 minutes",
      color: "#F1E3FF",
      borderColor: "#EEDCFF",
      textColor: "text-purple-700",
      content: "System sends innovators an email to complete survey.",
    },
    {
      step: 3,
      title: "Assign Experts",
      duration: "hours or days",
      color: "#EEDCFF",
      borderColor: "#EBD6FF",
      textColor: "text-purple-800",
      content: "Identify domain-specific evaluators.",
    },
    {
      step: 4,
      title: "Generate Expert PDFs",
      duration: "3-4 minutes (internet required)",
      color: "#EBD6FF",
      borderColor: "#E8D1FF",
      textColor: "text-purple-900",
      content: "Generate structured documents for experts.",
    },
    {
      step: 5,
      title: "End User Data Collection",
      duration: "days to weeks (no internet required)",
      color: "#E8D1FF",
      borderColor: "#E5D4FF",
      textColor: "text-purple-900",
      content: "Generate survey links for end users and beneficiaries.",
    },
    {
      step: 6,
      title: "Get MDII Report",
      duration: "4-5 minutes (internet required)",
      color: "#E5D4FF",
      borderColor: "#E5D4FF",
      textColor: "text-purple-950",
      content: "After receiving all evaluations, generate the final report.",
    },
  ];

  return (
    <>
      <p className="text-muted-foreground leading-relaxed">
       This section outlines the full journey of evaluating a
                        digital tool's inclusiveness using the MDII desktop
                        toolkit. Whether you're a field coordinator, evaluator,
                        or project lead, these are the steps you'll follow from
                        requesting your evaluation code to generating your final
                        report.
      </p>

      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
        <p className="text-sm font-medium text-primary mb-1">Timeline Information</p>
        <p className="text-sm text-muted-foreground">
          The duration of an MDII evaluation depends on how fast
                          you can make your respondents fill out their surveys.
                          As an evaluation coordinator, your work is easy and
                          almost instantaneous.
        </p>
      </div>

                      <div className="space-y-4">
                        {/* Step 1 */}
                        <Collapsible>
                          <CollapsibleTrigger asChild>
                            <div
                              className="p-4 rounded-lg cursor-pointer hover:bg-yellow-50 transition-colors"
                              style={{
                                backgroundColor: "#F4E9FF",
                                borderWidth: "2px",
                                borderColor: "#F1E3FF",
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                                    1
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-purple-600">
                                      Request Code
                                    </h4>
                                    <p className="text-sm text-purple-600">
                                      Duration: 2-3 minutes (internet required)
                                    </p>
                                  </div>
                                </div>
                                <ChevronDown className="w-4 h-4 text-purple-600" />
                              </div>
                            </div>
                          </CollapsibleTrigger>

                          <CollapsibleContent
                            className="px-6 pb-6 rounded-b-lg -mt-2"
                            style={{
                              backgroundColor: "#F4E9FF",
                              borderLeftWidth: "2px",
                              borderRightWidth: "2px",
                              borderBottomWidth: "2px",
                              borderColor: "#F1E3FF",
                            }}
                          >
                            <p className="text-sm text-purple-600 mb-4">
                              Start by submitting an evaluation request. You'll
                              receive a unique Tool ID via email that links your
                              tool to the correct maturity version and
                              evaluation materials. You need to already have the
                              names and email addresses of the innovators focal
                              points.
                            </p>

                            <Collapsible>
                              <CollapsibleTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mb-3 bg-white/60 border-indigo-300 hover:bg-indigo-100/50 text-indigo-700"
                                >
                                  <span className="text-xs">
                                    View Key Roles
                                  </span>
                                  <ChevronDown className="w-3 h-3 ml-1" />
                                </Button>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="space-y-3">
                                  <h5 className="font-medium text-purple-600">
                                    Key Roles:
                                  </h5>
                                  <div className="grid gap-3">
                                    <div className="p-3 bg-white/60 rounded border border-purple-200">
                                      <h6 className="font-medium text-sm text-purple-600">
                                        Project Leader
                                      </h6>
                                      <ul className="text-xs text-purple-600 mt-1 space-y-1">
                                        <li>
                                          • Overall strategic oversight of the
                                          tool or initiative
                                        </li>
                                        <li>
                                          • Ensures alignment with broader
                                          project goals
                                        </li>
                                      </ul>
                                    </div>
                                    <div className="p-3 bg-white/60 rounded border border-purple-200">
                                      <h6 className="font-medium text-sm text-purple-600">
                                        Project Manager
                                      </h6>
                                      <ul className="text-xs text-purple-600 mt-1 space-y-1">
                                        <li>
                                          • Oversees day-to-day implementation
                                        </li>
                                        <li>
                                          • Provides operational details like
                                          rollout stages, timelines
                                        </li>
                                      </ul>
                                    </div>
                                    <div className="p-3 bg-white/60 rounded border border-purple-200">
                                      <h6 className="font-medium text-sm text-purple-600">
                                        Technical Manager
                                      </h6>
                                      <ul className="text-xs text-purple-600 mt-1 space-y-1">
                                        <li>
                                          • Detailed knowledge of tool's
                                          architecture and data flows
                                        </li>
                                        <li>
                                          • Completes technical portions of the
                                          survey
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </CollapsibleContent>
                        </Collapsible>

                        {/* Step 2 */}
                        <Collapsible>
                          <CollapsibleTrigger asChild>
                            <div
                              className="p-4 rounded-lg cursor-pointer hover:bg-yellow-50 transition-colors"
                              style={{
                                backgroundColor: "#F1E3FF",
                                borderWidth: "2px",
                                borderColor: "#EEDCFF",
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                                    2
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-purple-700">
                                      Innovator Survey
                                    </h4>
                                    <p className="text-sm text-purple-700">
                                      Duration: immediate, 0 minutes
                                    </p>
                                  </div>
                                </div>
                                <ChevronDown className="w-4 h-4 text-purple-700" />
                              </div>
                            </div>
                          </CollapsibleTrigger>

                          <CollapsibleContent
                            className="px-6 pb-6 rounded-b-lg -mt-2"
                            style={{
                              backgroundColor: "#F1E3FF",
                              borderLeftWidth: "2px",
                              borderRightWidth: "2px",
                              borderBottomWidth: "2px",
                              borderColor: "#EEDCFF",
                            }}
                          >
                            <p className="text-sm text-purple-700">
                              Our system sends the innovators focal points an
                              email to complete a structured survey. This
                              provides essential background and operational
                              context about the tool being assessed. No action
                              is required here. You will be notified as soon as
                              the answers start coming.
                            </p>
                          </CollapsibleContent>
                        </Collapsible>

                        {/* Step 3 */}
                        <Collapsible>
                          <CollapsibleTrigger asChild>
                            <div
                              className="p-4 rounded-lg cursor-pointer hover:bg-yellow-50 transition-colors"
                              style={{
                                backgroundColor: "#EEDCFF",
                                borderWidth: "2px",
                                borderColor: "#EBD6FF",
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                                    3
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-purple-800">
                                      Assign Experts
                                    </h4>
                                    <p className="text-sm text-purple-800">
                                      Duration: hours or days (depends on expert
                                      availability)
                                    </p>
                                  </div>
                                </div>
                                <ChevronDown className="w-4 h-4 text-purple-800" />
                              </div>
                            </div>
                          </CollapsibleTrigger>

                          <CollapsibleContent
                            className="px-6 pb-6 rounded-b-lg -mt-2"
                            style={{
                              backgroundColor: "#EEDCFF",
                              borderLeftWidth: "2px",
                              borderRightWidth: "2px",
                              borderBottomWidth: "2px",
                              borderColor: "#EBD6FF",
                            }}
                          >
                            <p className="text-sm text-purple-800 mb-4">
                              Identify domain-specific evaluators that will
                              evaluate the innovators answers. These experts
                              provide specialized input that helps ensure a
                              well-rounded and credible assessment.
                            </p>

                            <Collapsible>
                              <CollapsibleTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mb-3 bg-white/60 border-purple-400 hover:bg-purple-250/50 text-purple-800"
                                >
                                  <span className="text-xs">
                                    View Required Expertise
                                  </span>
                                  <ChevronDown className="w-3 h-3 ml-1" />
                                </Button>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div className="p-3 bg-white/60 rounded border border-purple-400">
                                    <h6 className="font-medium text-sm text-purple-800 mb-2">
                                      Regular Version
                                    </h6>
                                    <ul className="text-xs text-purple-800 space-y-1">
                                      <li>
                                        • Gender Equality and Social Inclusion
                                        (GESI)
                                      </li>
                                      <li>
                                        • Information and Communication
                                        Technology (ICT)
                                      </li>
                                      <li>
                                        • Data Science and Analytics (Data)
                                      </li>
                                      <li>• Economics and Market Analysis</li>
                                      <li>• Human-Centered Design</li>
                                      <li>• Country-Specific Expertise</li>
                                    </ul>
                                  </div>
                                  <div className="p-3 bg-white/60 rounded border border-purple-400">
                                    <h6 className="font-medium text-sm text-purple-800 mb-2">
                                      Ex-Ante Version
                                    </h6>
                                    <ul className="text-xs text-purple-800 space-y-1">
                                      <li>
                                        • Gender Equality and Social Inclusion
                                        (GESI)
                                      </li>
                                      <li>
                                        • Information and Communication
                                        Technology (ICT)
                                      </li>
                                      <li>
                                        • Data Science and Analytics (Data)
                                      </li>
                                      <li>• Economics and Market Analysis</li>
                                      <li>• Country-Specific Expertise</li>
                                      <li className="italic">
                                        Note: Human-Centered Design not required
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </CollapsibleContent>
                        </Collapsible>

                        {/* Step 4 */}
                        <Collapsible>
                          <CollapsibleTrigger asChild>
                            <div
                              className="p-4 rounded-lg cursor-pointer hover:bg-yellow-50 transition-colors"
                              style={{
                                backgroundColor: "#EBD6FF",
                                borderWidth: "2px",
                                borderColor: "#E8D1FF",
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                                    4
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-purple-900">
                                      Generate Expert PDFs
                                    </h4>
                                    <p className="text-sm text-purple-900">
                                      Duration: 3-4 minutes (internet required)
                                    </p>
                                  </div>
                                </div>
                                <ChevronDown className="w-4 h-4 text-purple-900" />
                              </div>
                            </div>
                          </CollapsibleTrigger>

                          <CollapsibleContent
                            className="px-6 pb-6 rounded-b-lg -mt-2"
                            style={{
                              backgroundColor: "#EBD6FF",
                              borderLeftWidth: "2px",
                              borderRightWidth: "2px",
                              borderBottomWidth: "2px",
                              borderColor: "#E8D1FF",
                            }}
                          >
                            <p className="text-sm text-purple-900">
                              After collecting survey responses from the three
                              focal points, select{" "}
                              <strong>Get Experts PDF</strong> to generate
                              structured document (compilation) that extracts
                              and organizes relevant information from the focal
                              points' responses. This will generate an excel
                              file and store it on your computer alongside the
                              compilations. Send these to the experts you
                              identified in the previous step.
                            </p>
                          </CollapsibleContent>
                        </Collapsible>

                        {/* Step 5 */}
                        <Collapsible>
                          <CollapsibleTrigger asChild>
                            <div
                              className="p-4 rounded-lg cursor-pointer hover:bg-yellow-50 transition-colors"
                              style={{
                                backgroundColor: "#E8D1FF",
                                borderWidth: "2px",
                                borderColor: "#E5D4FF",
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                                    5
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-purple-900">
                                      End User Data Collection
                                    </h4>
                                    <p className="text-sm text-purple-900">
                                      Duration: days to weeks (no internet
                                      required)
                                    </p>
                                  </div>
                                </div>
                                <ChevronDown className="w-4 h-4 text-purple-900" />
                              </div>
                            </div>
                          </CollapsibleTrigger>

                          <CollapsibleContent
                            className="px-6 pb-6 rounded-b-lg -mt-2"
                            style={{
                              backgroundColor: "#E8D1FF",
                              borderLeftWidth: "2px",
                              borderRightWidth: "2px",
                              borderBottomWidth: "2px",
                              borderColor: "#E5D4FF",
                            }}
                          >
                            <p className="text-sm text-purple-900 mb-3">
                              Generate unique survey links for End Users and
                              Downstream Beneficiaries by going to{" "}
                              <strong>Get Data Collection Link</strong>. You can
                              send links via email, run workshops, or collect
                              data in the field.
                            </p>

                            <Collapsible>
                              <CollapsibleTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mb-3 bg-white/60 border-purple-200 hover:bg-purple-100/50 text-purple-600"
                                >
                                  <span className="text-xs">
                                    Important Note
                                  </span>
                                  <ChevronDown className="w-3 h-3 ml-1" />
                                </Button>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="p-3 bg-white/60 rounded border border-purple-500">
                                  <p className="text-xs font-medium text-purple-900">
                                    Important Note:
                                  </p>
                                  <p className="text-xs text-purple-900">
                                    Our survey platform (Kobo Toolbox) allows
                                    offline collection using the KoboCollect
                                    App.
                                  </p>
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </CollapsibleContent>
                        </Collapsible>

                        {/* Step 6 */}
                        <Collapsible>
                          <CollapsibleTrigger asChild>
                            <div
                              className="p-4 rounded-lg cursor-pointer hover:bg-yellow-50 transition-colors"
                              style={{
                                backgroundColor: "#E5D4FF",
                                borderWidth: "2px",
                                borderColor: "#E5D4FF",
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                                    6
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-purple-950">
                                      Get MDII Report
                                    </h4>
                                    <p className="text-sm text-purple-950">
                                      Duration: 4-5 minutes (internet required)
                                    </p>
                                  </div>
                                </div>
                                <ChevronDown className="w-4 h-4 text-purple-950" />
                              </div>
                            </div>
                          </CollapsibleTrigger>

                          <CollapsibleContent
                            className="px-6 pb-6 rounded-b-lg -mt-2"
                            style={{
                              backgroundColor: "#E5D4FF",
                              borderLeftWidth: "2px",
                              borderRightWidth: "2px",
                              borderBottomWidth: "2px",
                              borderColor: "#E5D4FF",
                            }}
                          >
                            <p className="text-sm text-purple-950 mb-3">
                              After receiving all evaluations from users,
                              downstream beneficiaries (optional) and experts,
                              go to
                              <strong>Get MDII Report</strong>. Insert your tool
                              ID and wait for magic to happen. The excel file
                              generated in step 4 will be updated with the
                              evaluation data.
                            </p>

                            <Collapsible>
                              <CollapsibleTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mb-3 bg-white/60 border-purple-500 hover:bg-purple-350/50 text-purple-950"
                                >
                                  <span className="text-xs">Final Steps</span>
                                  <ChevronDown className="w-3 h-3 ml-1" />
                                </Button>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="p-3 bg-white/60 rounded border border-purple-500">
                                  <p className="text-xs font-medium text-purple-950 mb-1">
                                    Final Steps:
                                  </p>
                                  <p className="text-xs text-purple-950">
                                    Open the excel file and find your tool
                                    assessment in the MDII Score and MDII
                                    Recommendations tabs. Print each as PDFs -
                                    you've completed an MDII evaluation!
                                    Congratulations for supporting digital
                                    inclusiveness!
                                  </p>
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
    </>
  );
};
