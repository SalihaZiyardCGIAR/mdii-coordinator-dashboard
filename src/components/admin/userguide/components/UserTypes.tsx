import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export const UserTypes: React.FC = () => {
  return (
    <>
      <p className="text-muted-foreground leading-relaxed">
        Different types of users contribute to an MDII evaluation:
      </p>

      <Tabs defaultValue="innovators" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="innovators" className="text-xs">
            Innovators
          </TabsTrigger>
          <TabsTrigger value="experts" className="text-xs">
            Domain Experts
          </TabsTrigger>
          <TabsTrigger value="end-users" className="text-xs">
            End Users
          </TabsTrigger>
          <TabsTrigger value="beneficiaries" className="text-xs">
            Beneficiaries
          </TabsTrigger>
        </TabsList>

        <TabsContent value="innovators" className="mt-6">
                          <div className="p-6 rounded-lg bg-gray-50 border border-gray-200">
                            <div className="flex items-center gap-3 mb-4">
                              <Badge className="text-xs rounded-full px-2 py-0.5 font-medium bg-red-600 text-white">
                                Mandatory
                              </Badge>
                              <h4 className="font-semibold text-foreground">
                                Innovators (Type 1)
                              </h4>
                            </div>
                            <div className="space-y-4">
                              <p className="text-sm text-muted-foreground">
                                The people or teams who developed the digital
                                tool
                              </p>
                              <div className="p-3 rounded-lg bg-muted/20 border border-muted-foreground/10">
                                <p className="text-xs text-muted-foreground">
                                  Provide essential context about the tool's
                                  design, goals, and implementation approach.
                                </p>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="experts" className="mt-6">
                          <div className="p-6 rounded-lg bg-gray-50 border border-gray-200">
                            <div className="flex items-center gap-3 mb-4">
                              <Badge className="text-xs rounded-full px-2 py-0.5 font-medium bg-red-600 text-white">
                                Mandatory
                              </Badge>
                              <h4 className="font-semibold text-foreground">
                                Domain Experts (Type 2)
                              </h4>
                            </div>
                            <div className="space-y-4">
                              <p className="text-sm text-muted-foreground">
                                Technical or thematic specialists who review the
                                tool based on specific dimensions
                              </p>
                              <div className="p-3 rounded-lg bg-muted/20 border border-muted-foreground/10">
                                <p className="text-xs text-muted-foreground">
                                  Offer independent professional assessment
                                  across GESI, ICT, Data, Economics, and other
                                  critical areas.
                                </p>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="end-users" className="mt-6">
                          <div className="p-6 rounded-lg bg-gray-50 border border-gray-200">
                            <div className="flex items-center gap-3 mb-4">
                              <Badge className="text-xs rounded-full px-2 py-0.5 font-medium bg-red-600 text-white">
                                Mandatory
                              </Badge>
                              <h4 className="font-semibold text-foreground">
                                End Users (Type 3)
                              </h4>
                            </div>
                            <div className="space-y-4">
                              <p className="text-sm text-muted-foreground">
                                Individuals who interact directly with the tool.
                                Can be farmers, extension agents, or
                                governmental individuals.
                              </p>
                              <div className="p-3 rounded-lg bg-muted/20 border border-muted-foreground/10">
                                <p className="text-xs text-muted-foreground">
                                  Provide real-world usage feedback on
                                  usability, trust, and accessibility from
                                  direct experience.
                                </p>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="beneficiaries" className="mt-6">
                          <div className="p-6 rounded-lg bg-gray-50 border border-gray-200">
                            <div className="flex items-center gap-3 mb-4">
                              <Badge className="text-xs rounded-full px-2 py-0.5 font-medium bg-muted text-foreground">
                                Optional
                              </Badge>
                              <h4 className="font-semibold text-foreground">
                                Downstream Beneficiaries (Type 4)
                              </h4>
                            </div>
                            <div className="space-y-4">
                              <p className="text-sm text-muted-foreground">
                                People impacted by the tool's use or decisions,
                                even if they don't interact with it directly
                              </p>
                              <div className="p-3 rounded-lg bg-muted/20 border border-muted-foreground/10">
                                <p className="text-xs text-muted-foreground">
                                  Share perspectives on indirect impacts and
                                  broader consequences of the tool's deployment.
                                </p>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
      </Tabs>
      <div className="p-3 rounded-lg bg-primary/10">
                        <p className="text-xs text-muted-foreground">
                          <strong>Sample Size:</strong> No minimum required —
                          more responses provide better results
                        </p>
                      </div>
    </>
  );
};