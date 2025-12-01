import React from "react";

export const Acknowledgments: React.FC = () => {
  return (
    <>
      <div className="space-y-6">
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-semibold text-foreground mb-4">
                            Development Team
                          </h4>
                          <p className="text-muted-foreground leading-relaxed mb-4">
                            The MDII framework and desktop application were
                            developed through collaborative effort by
                            researchers and practitioners dedicated to advancing
                            digital inclusiveness in agricultural systems.
                          </p>

                          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                            <h5 className="font-medium text-foreground mb-2">
                              Core Development Team
                            </h5>
                            <p className="text-sm text-muted-foreground">
                              Led by the International Water Management
                              Institute (IWMI) in collaboration with various
                              research institutions and development
                              organizations worldwide.
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-foreground mb-4">
                            Acknowledgments
                          </h4>
                          <div className="space-y-4">
                            <p className="text-muted-foreground leading-relaxed">
                              We extend our gratitude to the numerous experts,
                              practitioners, and communities who contributed
                              their insights and feedback during the development
                              and testing phases of this framework.
                            </p>

                            <div className="p-4 rounded-lg bg-muted/20 border border-muted-foreground/20">
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                Special thanks to the domain experts, end-users,
                                and innovators who participated in pilot
                                evaluations and provided valuable input that
                                shaped the current version of the MDII desktop
                                application.
                              </p>
                            </div>

                            <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                              <h5 className="font-medium text-foreground mb-2">
                                Funding & Support
                              </h5>
                              <p className="text-sm text-muted-foreground">
                                This work was supported by various funding
                                organizations committed to promoting inclusive
                                digital transformation in agriculture and
                                development.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
      </div>
    </>
  );
};