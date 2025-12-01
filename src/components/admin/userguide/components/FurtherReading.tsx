import React from "react";

export const FurtherReading: React.FC = () => {
  return (
    <>
<div className="p-6 rounded-lg bg-yellow-50 border border-yellow-200">
                        <h3 className="text-xl font-semibold text-foreground mb-4">
                          Discover more about MDII
                        </h3>

                        <div className="mb-6">
                          <p className="text-sm text-muted-foreground mb-2">
                            Website:
                          </p>
                          <a
                            href="https://mdii.iwmi.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 font-medium underline"
                          >
                            mdii.iwmi.org
                          </a>
                        </div>

                        <div>
                          <h4 className="text-lg font-medium text-foreground mb-4">
                            Resources
                          </h4>

                          <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-white border border-gray-200">
                              <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                                A multi-dimensional framework for responsible
                                and socially inclusive digital innovation in
                                food, water, and land systems
                              </p>
                              <p className="text-xs text-muted-foreground mb-2">
                                Opola, F., Langan, S., Arulingam, I., Schumann,
                                C., Singaraju, N., Joshi, D., Ghosh, S. (2025).
                              </p>
                              <a
                                href="https://hdl.handle.net/10568/174461"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80 text-sm underline"
                              >
                                https://hdl.handle.net/10568/174461
                              </a>
                            </div>

                            <div className="p-4 rounded-lg bg-white border border-gray-200">
                              <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                                Development of the conceptual framework (version
                                2.0) of the Multidimensional Digital
                                Inclusiveness Index
                              </p>
                              <p className="text-xs text-muted-foreground mb-2">
                                Martins, C. I., Opola, F., Jacobs-Mata, I.,
                                Garcia Andarcia, M., Nortje, K., Joshi, D.,
                                Singaraju, N., Muller, A., Christen, R.,
                                Malhotra, A. (2023).
                              </p>
                              <a
                                href="https://hdl.handle.net/10568/138705"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80 text-sm underline"
                              >
                                https://hdl.handle.net/10568/138705
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
    </>
  );
};
