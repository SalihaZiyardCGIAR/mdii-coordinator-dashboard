import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/ui/Layout";
import { TableOfContents } from "./components/TableOfContents";
import { SectionWrapper } from "./components/SectionWrapper";
import { WhatIsMDII } from "./components/WhatIsMDII";
import { EvaluationFramework } from "./components/EvaluationFramework";
import { MDIIComponents } from "./components/MDIIComponents";
import { MDIIEcosystem } from "./components/MDIIEcosystem";
import { UserTypes } from "./components/UserTypes";
import { ExpertManagement } from "./components/ExpertManagement";
import { EvaluationWorkflow } from "./components/EvaluationWorkflow";
import { Outputs } from "./components/Outputs";
import { Troubleshooting } from "./components/Troubleshooting";
import { AdditionalSupport } from "./components/AdditionalSupport";
import { FurtherReading } from "./components/FurtherReading";
import { Acknowledgments } from "./components/Acknowledgments";
import { useSections } from "./components/useSections";
import {
  Lightbulb,
  Shield,
  Settings,
  Globe,
  Users,
  UserCheck,
  BarChart3,
  FileText,
  HelpCircle,
  BookOpen,
} from "lucide-react";

const AdminUserGuide = () => {
  const [activeSection, setActiveSection] = useState<string | null>("what-is-mdii");
  const sections = useSections();

  const toggleSection = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  useEffect(() => {
    const id = window.location.hash?.replace("#", "");
    if (id) {
      setActiveSection(id);
    }
  }, []);

  return (
    <Layout>
      <div className="mdii-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Admin User Guide</h1>
                  <p className="text-gray-600">Discover what makes MDII unique</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Table of Contents Sidebar */}
            <TableOfContents
              sections={sections}
              activeSection={activeSection}
              onSectionClick={toggleSection}
            />

            {/* Main Content */}
            <div className="flex-1">
              {/* Section 1: What is MDII? */}
              <SectionWrapper
                id="what-is-mdii"
                title="What is MDII?"
                icon={<Lightbulb className="w-5 h-5 text-primary/70" />}
                isActive={activeSection === "what-is-mdii"}
                onToggle={() => toggleSection("what-is-mdii")}
              >
                <WhatIsMDII />
              </SectionWrapper>

              {/* Section 2: Evaluation Framework */}
              <SectionWrapper
                id="evaluation-framework"
                title="Evaluation Framework"
                icon={<Shield className="w-5 h-5 text-primary/70" />}
                isActive={activeSection === "evaluation-framework"}
                onToggle={() => toggleSection("evaluation-framework")}
              >
                <EvaluationFramework />
              </SectionWrapper>

              {/* Section 3: MDII Components */}
              <SectionWrapper
                id="how-mdii-works"
                title="MDII Components"
                icon={<Settings className="w-5 h-5 text-primary/70" />}
                isActive={activeSection === "how-mdii-works"}
                onToggle={() => toggleSection("how-mdii-works")}
              >
                <MDIIComponents />
              </SectionWrapper>

              {/* Section 4: MDII Ecosystem */}
              <SectionWrapper
                id="mdii-ecosystem"
                title="MDII Ecosystem"
                icon={<Globe className="w-5 h-5 text-primary/70" />}
                isActive={activeSection === "mdii-ecosystem"}
                onToggle={() => toggleSection("mdii-ecosystem")}
              >
                <MDIIEcosystem />
              </SectionWrapper>

              {/* Section 5: User Types */}
              <SectionWrapper
                id="user-types"
                title="User Types"
                icon={<Users className="w-5 h-5 text-primary/70" />}
                isActive={activeSection === "user-types"}
                onToggle={() => toggleSection("user-types")}
              >
                <UserTypes />
              </SectionWrapper>

              {/* Section 6: Expert Management */}
              <SectionWrapper
                id="expert-management"
                title="Expert Management"
                icon={<UserCheck className="w-5 h-5 text-primary/70" />}
                isActive={activeSection === "expert-management"}
                onToggle={() => toggleSection("expert-management")}
              >
                <ExpertManagement />
              </SectionWrapper>

              {/* Section 7: Evaluation Workflow */}
              <SectionWrapper
                id="evaluation-process"
                title="Evaluation Workflow"
                icon={<BarChart3 className="w-5 h-5 text-primary/70" />}
                isActive={activeSection === "evaluation-process"}
                onToggle={() => toggleSection("evaluation-process")}
              >
                <EvaluationWorkflow />
              </SectionWrapper>

              {/* Section 8: Outputs */}
              <SectionWrapper
                id="outputs"
                title="Outputs"
                icon={<FileText className="w-5 h-5 text-primary/70" />}
                isActive={activeSection === "outputs"}
                onToggle={() => toggleSection("outputs")}
              >
                <Outputs />
              </SectionWrapper>

              {/* Section 9: Troubleshooting */}
              <SectionWrapper
                id="troubleshooting"
                title="Troubleshooting"
                icon={<HelpCircle className="w-5 h-5 text-primary/70" />}
                isActive={activeSection === "troubleshooting"}
                onToggle={() => toggleSection("troubleshooting")}
              >
                <Troubleshooting />
              </SectionWrapper>

              {/* Section 10: Additional Support */}
              <SectionWrapper
                id="additional-support"
                title="Additional Support"
                icon={<HelpCircle className="w-5 h-5 text-primary/70" />}
                isActive={activeSection === "additional-support"}
                onToggle={() => toggleSection("additional-support")}
              >
                <AdditionalSupport />
              </SectionWrapper>

              {/* Section 11: Further Reading */}
              <SectionWrapper
                id="further-reading"
                title="Further Reading"
                icon={<BookOpen className="w-5 h-5 text-primary/70" />}
                isActive={activeSection === "further-reading"}
                onToggle={() => toggleSection("further-reading")}
              >
                <FurtherReading />
              </SectionWrapper>

              {/* Section 12: Acknowledgments */}
              <SectionWrapper
                id="acknowledgments"
                title="Acknowledgments & Development Team"
                icon={<Users className="w-5 h-5 text-primary/70" />}
                isActive={activeSection === "acknowledgments"}
                onToggle={() => toggleSection("acknowledgments")}
              >
                <Acknowledgments />
              </SectionWrapper>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AdminUserGuide;