import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const MDIIComponents: React.FC = () => {
    return (
        <>
            <p className="text-muted-foreground leading-relaxed">
                The MDII has several important elements that you should be familiar with.
                Below is a high-level overview of the components in the system, from data
                collection to output generation.
            </p>

            <Tabs defaultValue="maturity" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="maturity" className="text-xs hover:bg-yellow-50">
                        Tool Maturity
                    </TabsTrigger>
                    <TabsTrigger value="surveys" className="text-xs hover:bg-yellow-50">
                        Surveys
                    </TabsTrigger>
                    <TabsTrigger value="compilations" className="text-xs hover:bg-yellow-50">
                        Compilations
                    </TabsTrigger>
                    <TabsTrigger value="excel" className="text-xs hover:bg-yellow-50">
                        Automations
                    </TabsTrigger>
                    <TabsTrigger value="outputs" className="text-xs hover:bg-yellow-50">
                        Outputs
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="maturity" className="mt-6">
                    <div className="p-6 rounded-lg bg-gray-50 border border-gray-200">
                        <h4 className="font-semibold text-foreground mb-4">Tool Maturity</h4>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            MDII supports two evaluation tracks, depending on the development
                            stage of the tool that is being assessed:
                        </p>

                        <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                                    <h4 className="font-semibold text-green-900 mb-3">
                                        Regular Version
                                    </h4>
                                    <div className="text-xs text-green-600 space-y-1">
                                        <div>
                                            <strong>
                                                For tools that are already deployed, piloted, or tested
                                            </strong>
                                        </div>
                                        <div>• Assesses actual user experience and impact</div>
                                        <div>
                                            • Enables real-time feedback and iterative improvement
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                                    <h4 className="font-semibold text-blue-900 mb-3">
                                        Ex-Ante Version
                                    </h4>
                                    <div className="text-xs text-blue-600 space-y-1">
                                        <div>
                                            <strong>
                                                For tools in early stages: idea, research, or prototyping
                                            </strong>
                                        </div>
                                        <div>
                                            • Designed for when there are few or no active users yet
                                        </div>
                                        <div>
                                            • Helps teams embed inclusiveness early, before costly
                                            redesigns are needed
                                        </div>
                                        <div>
                                            • Generates feedback based on intentions, assumptions, and plans
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </TabsContent>

                <div className="p-4 mt-5 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        The MDII evaluation flow is designed to{" "}
                        <strong>
                            automatically detect the tool's maturity
                            level
                        </strong>{" "}
                        once it's loaded into the system and selects
                        the appropriate version of the Index for
                        scoring and reporting; the system adapts based
                        on the tool profile already stored in our
                        database.
                    </p>
                </div>

                <TabsContent value="surveys" className="mt-6">
                    <div className="p-6 rounded-lg bg-gray-50 border border-gray-200">
                        <h4 className="font-semibold text-foreground mb-4">Surveys</h4>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            MDII utilizes targeted surveys to gather comprehensive data from
                            different stakeholder groups.
                        </p>

                        <div className="space-y-3">
                            {[
                                {
                                    name: "Innovators (Type 1)",
                                    desc: "Survey for tool developers and creators",
                                },
                                {
                                    name: "Domain Experts (Type 2)",
                                    desc: "Survey for subject matter specialists",
                                },
                                {
                                    name: "End Users (Type 3)",
                                    desc: "Survey for direct tool users",
                                },
                                {
                                    name: "Downstream Beneficiaries (Type 4 — optional)",
                                    desc: "Survey for indirect beneficiaries of the tool",
                                },
                            ].map((survey, index) => (
                                <div
                                    key={index}
                                    className="p-3 rounded-lg bg-muted/30 border border-muted-foreground/20"
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-2 h-2 rounded-full bg-purple-600" />
                                        <span className="font-medium text-sm text-foreground">
                                            {survey.name}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground ml-4">
                                        {survey.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="compilations" className="mt-6">
                    <div className="p-6 rounded-lg bg-gray-50 border border-gray-200">
                        <h4 className="font-semibold text-foreground mb-4">Compilations</h4>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Once the innovator surveys are completed, the system generates PDF
                            compilations for each expert domain.
                        </p>
                    </div>
                </TabsContent>

                <TabsContent value="excel" className="mt-6">
                    <div className="p-6 rounded-lg bg-gray-50 border border-gray-200">
                        <h4 className="font-semibold text-foreground mb-4">Automations</h4>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            The MDII evaluation workflow is designed to be as efficient and
                            low-intervention as possible.
                        </p>
                    </div>
                </TabsContent>

                <TabsContent value="outputs" className="mt-6">
                    <div className="p-6 rounded-lg bg-gray-50 border border-gray-200">
                        <h4 className="font-semibold text-foreground mb-4">Outputs</h4>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            After reviewing the Excel workbook, users generate two key outputs.
                        </p>
                    </div>
                </TabsContent>
            </Tabs>
        </>
    );
};