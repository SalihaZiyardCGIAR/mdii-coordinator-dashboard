import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Lightbulb, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const MDIIEcosystem: React.FC = () => {
    return (
        <>
            <p className="text-muted-foreground leading-relaxed">
                MDII is more than this desktop app. It's a <strong>modular ecosystem</strong>{" "}
                of tools tailored to different needs and connectivity environments.
            </p>

            <Tabs defaultValue="full-assessment" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="full-assessment" className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Full Assessment
                    </TabsTrigger>
                    <TabsTrigger value="ai-rapid" className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        AI-Rapid
                    </TabsTrigger>
                    <TabsTrigger value="dashboard" className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Dashboard
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="full-assessment" className="mt-6">
                    <div className="p-6 rounded-lg bg-blue-50 border-2 border-blue-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-blue-600/10">
                                <Globe className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-blue-800">Full Assessment</h4>
                                <Badge variant="outline" className="text-xs text-blue-600">
                                    Fully Online
                                </Badge>
                            </div>
                        </div>
                        <ul className="space-y-2 text-sm text-blue-800">
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                                <span>
                                    A detailed, survey-based version of MDII,
                                    designed for use entirely through the MDII web
                                    application
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                                <span>
                                    Includes automated flows to collect responses,
                                    calculate scores, and generate reports and
                                    recommendations
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                                <span>
                                    Suitable for projects with reliable internet
                                    access, where users can stay connected
                                    throughout the process
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                                <span>
                                    May not be ideal in low-connectivity
                                    environments, as it depends on online
                                    infrastructure to function
                                </span>
                            </li>
                        </ul>
                    </div>
                </TabsContent>

                <TabsContent value="ai-rapid" className="mt-6">
                    <div className="p-6 rounded-lg bg-green-50 border-2 border-green-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-green-600/10">
                                <Lightbulb className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-green-800">AI-Rapid Assessment</h4>
                                <Badge variant="outline" className="text-xs text-green-600">
                                    Fully Online
                                </Badge>
                            </div>
                        </div>
                        <ul className="space-y-2 text-sm text-green-800">
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                                <span>A fast, AI-powered assessment tool</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                                <span>
                                    Offers immediate feedback based on limited
                                    inputs
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                                <span>
                                    Perfect for early-stage prototypes or fast
                                    reviews
                                </span>
                            </li>
                        </ul>
                    </div>
                </TabsContent>

                <TabsContent value="dashboard" className="mt-6">
                    <div className="p-6 rounded-lg bg-purple-50 border-2 border-purple-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-purple-600/10">
                                <BarChart3 className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-purple-800">MDII Dashboard</h4>
                                <Badge variant="outline" className="text-xs text-purple-600">
                                    Fully Online
                                </Badge>
                            </div>
                        </div>
                        <ul className="space-y-2 text-sm text-purple-800">
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                                <span>
                                    A centralized space to explore your results
                                    once reports are generated
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                                <span>
                                    Enables tool comparison, performance tracking,
                                    and access to aggregated insights
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                                <span>
                                    Useful for coordinators, decision-makers, and
                                    funders looking at multiple tools or countries
                                </span>
                            </li>
                        </ul>
                    </div>
                </TabsContent>
            </Tabs>
        </>
    );
};