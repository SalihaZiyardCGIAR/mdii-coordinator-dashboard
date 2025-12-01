import React from "react";

export const AdditionalSupport: React.FC = () => {
  return (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 rounded-lg border border-border bg-card">
          <h4 className="font-semibold text-foreground mb-2">Technical Support</h4>
          <p className="text-sm text-muted-foreground mb-4">
            For technical issues or system-related questions
          </p>
          <div className="p-3 rounded-lg bg-muted/20 border">
            <a
              href="mailto:mdii@cgiar.org"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              mdii@cgiar.org
            </a>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-border bg-card">
          <h4 className="font-semibold text-foreground mb-2">
            Methodology Questions
          </h4>
          <p className="text-sm text-muted-foreground mb-4">
            For evaluation methodology and process guidance
          </p>
          <div className="p-3 rounded-lg bg-muted/20 border">
            <a
              href="mailto:mdii@cgiar.org"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              mdii@cgiar.org
            </a>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
        <p className="text-sm text-muted-foreground">
          <strong>Response Time:</strong> We typically respond to support requests within 1-2 business days. For urgent technical issues, please indicate "URGENT" in your subject line.
        </p>
      </div>
    </>
  );
};
