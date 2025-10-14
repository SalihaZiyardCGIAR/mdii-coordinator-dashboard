import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Globe,
  Users,
  BarChart3,
  Shield,
  Lightbulb,
  FileText,
  ChevronDown,
  ChevronUp,
  Settings,
  UserCheck,
  TrendingUp,
  ArrowDown,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Layout from "@/components/ui/Layout";
const UserGuide = () => {
  // State for which section is currently visible (only one at a time)
const [activeSection, setActiveSection] = useState<string | null>("what-is-mdii");
  // State for nested collapsibles within sections
  const [nestedExpanded, setNestedExpanded] = useState<Record<string, boolean>>(
    {
      expertRoles: false,
      selectionCriteria: false,
    }
  );

// Toggle function - shows only the selected section, hides others
const toggleSection = (sectionId: string) => {
  setActiveSection(sectionId);
};
  // Set initial active section based on URL hash
  useEffect(() => {
    const id = window.location.hash?.replace("#", "");
    if (id) {
      setActiveSection(id);
    }
  }, []);
  const sections = [
    {
      id: "what-is-mdii",
      title: "1. What is MDII?",
      icon: <Lightbulb className="w-5 h-5 text-primary/70" />,
      color: "bg-primary/5",
    },
    {
      id: "evaluation-framework",
      title: "2. Evaluation Framework",
      icon: <Shield className="w-5 h-5 text-primary/70" />,
      color: "bg-primary/5",
    },
    {
      id: "how-mdii-works",
      title: "3. MDII Components",
      icon: <Settings className="w-5 h-5 text-primary/70" />,
      color: "bg-primary/5",
    },
    {
      id: "mdii-ecosystem",
      title: "4. MDII Ecosystem",
      icon: <Globe className="w-5 h-5 text-primary/70" />,
      color: "bg-primary/5",
    },
    {
      id: "user-types",
      title: "5. User Types",
      icon: <Users className="w-5 h-5 text-primary/70" />,
      color: "bg-primary/5",
    },
    {
      id: "expert-management",
      title: "6. Expert Management",
      icon: <UserCheck className="w-5 h-5 text-primary/70" />,
      color: "bg-primary/5",
    },
    {
      id: "evaluation-process",
      title: "7. Evaluation Workflow",
      icon: <BarChart3 className="w-5 h-5 text-primary/70" />,
      color: "bg-primary/5",
    },
    {
      id: "outputs",
      title: "8. Outputs",
      icon: <FileText className="w-5 h-5 text-primary/70" />,
      color: "bg-primary/5",
    },
    {
      id: "troubleshooting",
      title: "9. Troubleshooting",
      icon: <HelpCircle className="w-5 h-5 text-primary/70" />,
      color: "bg-primary/5",
    },
    {
      id: "additional-support",
      title: "10. Additional Support",
      icon: <HelpCircle className="w-5 h-5 text-primary/70" />,
      color: "bg-primary/5",
    },
    {
      id: "further-reading",
      title: "11. Further Reading",
      icon: <BookOpen className="w-5 h-5 text-primary/70" />,
      color: "bg-primary/5",
    },
    {
      id: "acknowledgments",
      title: "12. Acknowledgments & Development Team",
      icon: <Users className="w-5 h-5 text-primary/70" />,
      color: "bg-primary/5",
    },
  ];
  return (
    <Layout>
      <div className="mdii-container">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-3xl font-semibold text-foreground">
                    Discover what makes MDII unique
                  </h1>
                  <p className="text-gray-600">User Guide for MDII Coordinator Panel</p>

                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Table of Contents Sidebar */}
            <div className="w-64 flex-shrink-0 h-fit">
                <Card className="glassmorphism sticky top-20">
                <CardHeader>
                  <CardTitle className="text-sm">Table of Contents</CardTitle>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-2">
                    {sections.map((section) => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        onClick={(e) => {
                            e.preventDefault();
                            toggleSection(section.id);
                        }}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-yellow-50 transition-colors group outline-none focus:outline-none"
                        >
                        <div className={`p-1.5 rounded-md ${section.color}`}>
                          {section.icon}
                        </div>
                        <span className="text-sm font-medium text-foreground group-hover:text-primary">
                          {section.title}
                        </span>
                      </a>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Guidance Card - Prompt to use TOC */}
              {/* <Card className="glassmorphism border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100">
                <CardContent className="py-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
                        <ArrowRight className="w-7 h-7 text-white" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-purple-900 mb-2">
                        Ready to explore?
                      </h3>
                      <p className="text-purple-700 text-sm">
                        Click on any section in the{" "}
                        <strong>Table of Contents</strong> to view detailed
                        information. Only one section will be displayed at a
                        time for easy reading.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card> */}

              {/* Section 1: What is MDII? */}
              <Card
                id="what-is-mdii"
                className={`glassmorphism  ${
                  activeSection === "what-is-mdii" ? "" : "hidden"
                }`}
              >
                <Collapsible
                  open={activeSection === "what-is-mdii"}
                  onOpenChange={() => toggleSection("what-is-mdii")}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="pb-4 cursor-pointer hover:bg-yellow-50 transition-colors rounded-t-lg">
                      <CardTitle className="flex items-center justify-between text-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/5">
                            <Lightbulb className="w-5 h-5 text-primary/70" />
                          </div>
                          What is MDII?
                        </div>
                        {activeSection === "what-is-mdii" ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="space-y-6 animate-accordion-down">
                      <p className="text-muted-foreground leading-relaxed">
                        The Multidimensional Digital Inclusiveness Index (MDII)
                        is a scientific framework designed to assess and improve
                        the inclusiveness of digital tools in agrisystems, with
                        a particular focus on low- and middle-income countries
                        (LMICs). It provides a structured, evidence-based
                        approach to evaluating whether digital innovations are
                        accessible, usable, and equitable.
                      </p>

                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <h4 className="font-semibold text-primary mb-2">
                          Fundamental Question
                        </h4>
                        <p className="text-sm text-muted-foreground font-medium">
                          Are digital tools working for everyone — or just for
                          the digitally connected few?
                        </p>
                      </div>

                      <div className="space-y-4">
                        <p className="text-muted-foreground leading-relaxed">
                          In agricultural development, new digital tools are
                          launched every year. But many still struggle to serve
                          those most in need, like women, youth, rural
                          communities, or people with limited access to
                          technology.
                        </p>

                        <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                          <h4 className="font-semibold text-purple-900 mb-3">
                            Digital inclusiveness goes beyond devices or
                            internet availability
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                              <span className="text-sm text-purple-800">
                                Whether people can understand and trust the tool
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                              <span className="text-sm text-purple-800">
                                Whether the design reflects their needs and
                                context
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                              <span className="text-sm text-purple-800">
                                Whether benefits and risks are fairly
                                distributed
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-muted-foreground leading-relaxed">
                        MDII helps developers, researchers, and decision-makers
                        assess these issues with structured tools and offers
                        clear, actionable guidance on how to improve adoption,
                        trust, and equity.
                      </p>

                      <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                        <h4 className="font-semibold text-accent-foreground mb-2">
                          Core Innovation
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Its core innovation lies in quantifying digital
                          inclusiveness and helping teams move beyond
                          assumptions or high-level checklists. MDII offers
                          guidance that is grounded, contextual, and focused on
                          empowering users.
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-foreground">
                            MDII helps answer:
                          </h4>
                          <ul className="space-y-2">
                            {[
                              "Is this tool inclusive for users with low access or connectivity?",
                              "Where are the gaps in usability, trust, and local alignment?",
                              "How can we improve adoption through better design choices?",
                              "Are benefits and risks distributed fairly across different user groups?",
                            ].map((question, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                <span className="text-sm text-muted-foreground">
                                  {question}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-semibold text-foreground">
                            Use MDII to:
                          </h4>
                          <ul className="space-y-2">
                            {[
                              "Generate evidence-based recommendations",
                              "Evaluate tools online or offline",
                              "Compare across teams, tools, and regions",
                              "Align with gender and inclusion goals",
                            ].map((feature, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                                <span className="text-sm text-muted-foreground">
                                  {feature}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Applicable tools include:
                        </h4>
                        <div className="space-y-2">
                          <div className="text-sm text-gray-700">
                            • Farm advisories, government decision support
                            platforms, digital-enabled sensors, etc.
                          </div>
                          <div className="text-sm text-gray-700">
                            • Deployed or in development
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Section 2: Evaluation Framework */}
              <Card
                id="evaluation-framework"
                className={`glassmorphism ${
                  activeSection === "evaluation-framework" ? "" : "hidden"
                }`}
              >
                <Collapsible
                  open={activeSection === "evaluation-framework"}
                  onOpenChange={() => toggleSection("evaluation-framework")}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="pb-4 cursor-pointer hover:bg-yellow-50 transition-colors rounded-t-lg">
                      <CardTitle className="flex items-center justify-between text-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/5">
                            <Shield className="w-5 h-5 text-primary/70" />
                          </div>
                          Evaluation Framework
                        </div>
                        {activeSection === "evaluation-framework" ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="space-y-6 animate-accordion-down">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">
                          Methodology
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">
                          MDII is a structured evaluation framework that
                          recognizes the importance of inclusivity at all stages
                          of innovation development.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                          The framework consists of 90 indicators, which inform
                          27 subdimensions of seven dimensions, covering three
                          megagroups: Innovation usage, Social consequences, and
                          Stakeholder relationships.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                          The solution is given a score using a five-tier system
                          for inclusivity across each dimension and
                          subdimension. This makes it simple to identify points
                          of strength and areas for improvement.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                          Based on this data, domain expertise and input from
                          stakeholders, the evaluation team provides
                          recommendations and actionable insights for
                          improvement.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">
                          Framework Structure
                        </h4>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                            <h5 className="font-medium text-sm text-orange-900 mb-2">
                              7 Dimensions
                            </h5>
                            <p className="text-xs text-orange-800">
                              Core areas covering all aspects of digital tool
                              inclusiveness
                            </p>
                          </div>
                          <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                            <h5 className="font-medium text-sm text-orange-900 mb-2">
                              27 Subdimensions
                            </h5>
                            <p className="text-xs text-orange-800">
                              Focused areas within each major dimension for
                              targeted assessment
                            </p>
                          </div>
                          <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                            <h5 className="font-medium text-sm text-orange-900 mb-2">
                              90 Indicators
                            </h5>
                            <p className="text-xs text-orange-800">
                              Detailed metrics that capture specific aspects of
                              digital inclusiveness
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">
                          Explore the Framework
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">
                          Click the sunburst image below to explore what's
                          inside the MDII Index.
                        </p>
                        <p className="text-sm text-muted-foreground">
                          To see detailed descriptions, open the dropdown menus
                          by clicking the black triangles.
                        </p>

                        {/* Sunburst Chart (iframe from public/, runs its own scripts/styles) */}
                        <div className="mt-6 rounded-lg border overflow-hidden">
                          <iframe
                            title="MDII Sunburst"
                            src="/MDII-sunburst_offline-manual.html"
                            className="w-full"
                            style={{
                              height: 520,
                              border: "0",
                            }}
                          />
                        </div>

                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                          <div className="flex items-center gap-2 mb-2">
                            <HelpCircle className="w-4 h-4 text-primary" />
                            <span className="font-medium text-sm text-primary">
                              Interactive Framework Explorer
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            The interactive sunburst visualization will be
                            available in the full MDII platform, allowing you to
                            explore the complete framework structure and
                            understand how indicators map to subdimensions and
                            dimensions.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Section 3: MDII Components */}
              <Card
                id="how-mdii-works"
                className={`glassmorphism ${
                  activeSection === "how-mdii-works" ? "" : "hidden"
                }`}
              >
                <Collapsible
                  open={activeSection === "how-mdii-works"}
                  onOpenChange={() => toggleSection("how-mdii-works")}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="pb-4 cursor-pointer hover:bg-yellow-50 transition-colors rounded-t-lg">
                      <CardTitle className="flex items-center justify-between text-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/5">
                            <Settings className="w-5 h-5 text-primary/70" />
                          </div>
                          MDII Components
                        </div>
                        {activeSection === "how-mdii-works" ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="space-y-6 animate-accordion-down">
                      <p className="text-muted-foreground leading-relaxed">
                        The MDII has several important elements that you should
                        be familiar with. Below is a high-level overview of the
                        components in the system, from data collection to output
                        generation.
                      </p>

                      <Tabs defaultValue="maturity" className="w-full">
                        <TabsList className="grid w-full grid-cols-5">
                          <TabsTrigger
                            value="maturity"
                            className="text-xs hover:bg-yellow-50 hover:text-foreground transition-colors"
                          >
                            Tool Maturity
                          </TabsTrigger>
                          <TabsTrigger
                            value="surveys"
                            className="text-xs hover:bg-yellow-50 hover:text-foreground transition-colors"
                          >
                            Surveys
                          </TabsTrigger>
                          <TabsTrigger
                            value="compilations"
                            className="text-xs hover:bg-yellow-50 hover:text-foreground transition-colors"
                          >
                            Compilations
                          </TabsTrigger>
                          <TabsTrigger
                            value="excel"
                            className="text-xs hover:bg-yellow-50 hover:text-foreground transition-colors"
                          >
                            Automations
                          </TabsTrigger>
                          <TabsTrigger
                            value="outputs"
                            className="text-xs hover:bg-yellow-50 hover:text-foreground transition-colors"
                          >
                            Outputs
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="maturity" className="mt-6">
                          <div className="p-6 rounded-lg bg-gray-50 border border-gray-200">
                            <h4 className="font-semibold text-foreground mb-4">
                              Tool Maturity
                            </h4>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                              MDII supports two evaluation tracks, depending on
                              the development stage of the tool that is being
                              assessed:
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
                                        For tools that are already deployed,
                                        piloted, or tested
                                      </strong>
                                    </div>
                                    <div>
                                      • Assesses actual user experience and
                                      impact
                                    </div>
                                    <div>
                                      • Enables real-time feedback and iterative
                                      improvement
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
                                        For tools in early stages: idea,
                                        research, or prototyping
                                      </strong>
                                    </div>
                                    <div>
                                      • Designed for when there are few or no
                                      active users yet
                                    </div>
                                    <div>
                                      • Helps teams embed inclusiveness early,
                                      before costly redesigns are needed
                                    </div>
                                    <div>
                                      • Generates feedback based on intentions,
                                      assumptions, and plans
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
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
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="surveys" className="mt-6">
                          <div className="p-6 rounded-lg bg-gray-50 border border-gray-200">
                            <h4 className="font-semibold text-foreground mb-4">
                              Surveys
                            </h4>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                              MDII utilizes targeted surveys to gather
                              comprehensive data from different stakeholder
                              groups. These surveys collect both qualitative and
                              quantitative insights to assess how digital tools
                              perform across inclusiveness criteria.
                            </p>

                            <div className="space-y-4">
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

                              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  Each type receives a tailored set of questions
                                  aligned with MDII's dimensions. The surveys
                                  are designed to be lightweight and can be
                                  completed online or offline (via KoboToolbox
                                  or using printable versions).
                                </p>
                                <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                                  These surveys gather both qualitative and
                                  quantitative data to assess how the digital
                                  tool performs across inclusiveness criteria —
                                  such as accessibility, usability, relevance,
                                  and equity.
                                </p>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="compilations" className="mt-6">
                          <div className="p-6 rounded-lg bg-gray-50 border border-gray-200">
                            <h4 className="font-semibold text-foreground mb-4">
                              Compilations
                            </h4>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                              Once the innovator surveys are completed, the
                              system generates PDF compilations for each expert
                              domain. These documents summarize relevant answers
                              provided by the tool developers and serve as input
                              material for domain experts.
                            </p>

                            <div className="space-y-4">
                              <div className="p-4 rounded-lg bg-muted/20 border border-muted-foreground/20">
                                <h5 className="font-semibold text-sm mb-3 text-foreground">
                                  Each compilation includes:
                                </h5>
                                <div className="space-y-2">
                                  {[
                                    "General information about the tool",
                                    "Domain-specific excerpts aligned to the expert's area",
                                    "Contextual notes to guide scoring",
                                  ].map((item, index) => (
                                    <div
                                      key={index}
                                      className="flex items-start gap-2"
                                    >
                                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                      <p className="text-sm text-muted-foreground">
                                        {item}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  The expert uses this compilation as a
                                  reference to complete their evaluation
                                  independently, helping ensure that the scoring
                                  reflects both internal knowledge and external
                                  assessment.
                                </p>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="excel" className="mt-6">
                          <div className="p-6 rounded-lg bg-gray-50 border border-gray-200">
                            <h4 className="font-semibold text-foreground mb-4">
                              Automations
                            </h4>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                              The MDII evaluation workflow is designed to be as
                              efficient and low-intervention as possible.
                              Automated processes identify data, perform
                              calculations, send notifications, and manage the
                              overall evaluation flow to reduce manual effort
                              throughout the process.
                            </p>

                            <div className="space-y-4">
                              <div className="p-4 rounded-lg bg-muted/20 border border-muted-foreground/20">
                                <h5 className="font-semibold text-sm mb-3 text-foreground">
                                  The automations enable:
                                </h5>
                                <div className="space-y-2">
                                  {[
                                    "Email notifications to evaluators and coordinators at key workflow stages",
                                    "Automatic calculation of the overall MDII score (0–100%)",
                                    "Breakdown of results across the seven MDII dimensions",
                                    "Automated mapping of recommendations per dimension",
                                    "Centralized management of submissions and evaluation progress tracking",
                                  ].map((item, index) => (
                                    <div
                                      key={index}
                                      className="flex items-start gap-2"
                                    >
                                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                      <p className="text-sm text-muted-foreground">
                                        {item}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  Additionally, we have developed dedicated
                                  tracking panels for coordinators,
                                  administrators, and innovators to monitor the
                                  status of ongoing MDII evaluations in real
                                  time.{" "}
                                  <p>
                                    It provides access to progress updates,
                                    submission summaries, and evaluation
                                    timelines, helping each role manage their
                                    respective responsibilities efficiently. You
                                    can use it to track evaluation progress,
                                    confirm data submissions, and coordinate
                                    next steps across teams or partner
                                    institutions.
                                  </p>
                                  <p> </p>
                                  <p>
                                    <b>
                                      Important: Access requires registration
                                      and an active CGIAR account. First-time
                                      users must register before accessing their
                                      designated panel.
                                    </b>
                                  </p>
                                </p>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="outputs" className="mt-6">
                          <div className="p-6 rounded-lg bg-gray-50 border border-gray-200">
                            <h4 className="font-semibold text-foreground mb-4">
                              Outputs
                            </h4>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                              After reviewing the Excel workbook, users generate
                              two key outputs by exporting the relevant tabs as
                              PDFs.
                            </p>

                            <div className="space-y-4">
                              <div className="space-y-4">
                                <div className="p-4 rounded-lg bg-muted/30 border border-muted-foreground/20">
                                  <h5 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                                    Score Report (PDF)
                                  </h5>
                                  <p className="text-sm text-muted-foreground">
                                    Summarizes the final MDII score, tier label,
                                    visual charts, and a dimension-level
                                    breakdown of inclusiveness performance.
                                  </p>
                                </div>

                                <div className="p-4 rounded-lg bg-muted/30 border border-muted-foreground/20">
                                  <h5 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-600" />
                                    Recommendation Brief (PDF)
                                  </h5>
                                  <p className="text-sm text-muted-foreground">
                                    Lists practical, evidence-based actions to
                                    improve the tool. These suggestions are
                                    framed as "steps to reach the next tier" and
                                    are organized by MDII dimension.
                                  </p>
                                </div>
                              </div>

                              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  These files are designed to support internal
                                  planning, external discussions, and roadmap
                                  decisions — giving teams a concrete snapshot
                                  of where they stand and where to go next.
                                </p>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Section 4: MDII Ecosystem */}
              <Card
                id="mdii-ecosystem"
                className={`glassmorphism ${
                  activeSection === "mdii-ecosystem" ? "" : "hidden"
                }`}
              >
                <Collapsible
                  open={activeSection === "mdii-ecosystem"}
                  onOpenChange={() => toggleSection("mdii-ecosystem")}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="pb-4 cursor-pointer hover:bg-yellow-50 transition-colors rounded-t-lg">
                      <CardTitle className="flex items-center justify-between text-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/5">
                            <Globe className="w-5 h-5 text-primary/70" />
                          </div>
                          MDII Ecosystem
                        </div>
                        {activeSection === "mdii-ecosystem" ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="space-y-6 animate-accordion-down">
                      <p className="text-muted-foreground leading-relaxed">
                        MDII is more than this desktop app. It's a{" "}
                        <strong>modular ecosystem</strong> of tools tailored to
                        different needs and connectivity environments.
                      </p>

                      <p className="text-muted-foreground leading-relaxed">
                        Besides this offline-friendly desktop app, there are 3
                        additional tools:
                      </p>

                      <Tabs defaultValue="full-assessment" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger
                            value="full-assessment"
                            className="flex items-center gap-2 hover:bg-yellow-50"
                          >
                            <Globe className="w-4 h-4" />
                            Full Assessment
                          </TabsTrigger>
                          <TabsTrigger
                            value="ai-rapid"
                            className="flex items-center gap-2 hover:bg-yellow-50"
                          >
                            <Lightbulb className="w-4 h-4" />
                            AI-Rapid Assessment
                          </TabsTrigger>
                          <TabsTrigger
                            value="dashboard"
                            className="flex items-center gap-2 hover:bg-yellow-50"
                          >
                            <BarChart3 className="w-4 h-4" />
                            MDII Dashboard
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="full-assessment" className="mt-6">
                          <div className="p-6 rounded-lg bg-blue-50 border-2 border-blue-200">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 rounded-lg bg-blue-600/10">
                                <Globe className="w-6 h-6 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-blue-800">
                                  Full Assessment
                                </h4>
                                <Badge
                                  variant="outline"
                                  className="text-xs text-blue-600 bg-blue-50"
                                >
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
                                <h4 className="font-semibold text-green-800">
                                  AI-Rapid Assessment
                                </h4>
                                <Badge
                                  variant="outline"
                                  className="text-xs text-green-600 bg-green-50"
                                >
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
                                <h4 className="font-semibold text-purple-800">
                                  MDII Dashboard
                                </h4>
                                <Badge
                                  variant="outline"
                                  className="text-xs text-purple-600 bg-purple-50"
                                >
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
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Section 5: Internet Needs */}
              <Card
                id="internet-usage"
                className={`glassmorphism ${
                  activeSection === "internet-usage" ? "" : "hidden"
                }`}
              >
                <Collapsible
                  open={activeSection === "internet-usage"}
                  onOpenChange={() => toggleSection("internet-usage")}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="pb-4 cursor-pointer hover:bg-yellow-50 transition-colors rounded-t-lg">
                      <CardTitle className="flex items-center justify-between text-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/5">
                            <Globe className="w-5 h-5 text-primary/70" />
                          </div>
                          Internet Needs
                        </div>
                        {activeSection === "internet-usage" ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="space-y-4 animate-accordion-down">
                      <div className="p-4 rounded-lg border border-border bg-card">
                        <h4 className="font-semibold text-sm mb-3 text-foreground">
                          Connection Required For:
                        </h4>
                        <ul className="space-y-2">
                          {[
                            "Data fetching during compilation and score generation",
                            "Opening KoboToolbox form URL for the first time (caching for offline use)",
                          ].map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <Shield className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm font-medium mb-1">
                          Offline Form Guide
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                          For more information on how to use KoboToolbox in
                          offline settings, please consult:
                        </p>
                        <a
                          href="https://support.kobotoolbox.org/data_through_webforms.html?highlight=offline"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:text-primary/80 underline"
                        >
                          KoboToolbox Offline Documentation
                        </a>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Section 6: User Types */}
              <Card
                id="user-types"
                className={`glassmorphism ${
                  activeSection === "user-types" ? "" : "hidden"
                }`}
              >
                <Collapsible
                  open={activeSection === "user-types"}
                  onOpenChange={() => toggleSection("user-types")}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="pb-4 cursor-pointer hover:bg-yellow-50 transition-colors rounded-t-lg">
                      <CardTitle className="flex items-center justify-between text-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/5">
                            <Users className="w-5 h-5 text-primary/70" />
                          </div>
                          User Types
                        </div>
                        {activeSection === "user-types" ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="space-y-4 animate-accordion-down">
                      <p className="text-muted-foreground leading-relaxed">
                        Different types of users contribute to an MDII
                        evaluation:
                      </p>

                      <Tabs defaultValue="innovators" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger
                            value="innovators"
                            className="text-xs hover:bg-yellow-50 hover:text-foreground transition-colors"
                          >
                            Innovators
                          </TabsTrigger>
                          <TabsTrigger
                            value="experts"
                            className="text-xs hover:bg-yellow-50 hover:text-foreground transition-colors"
                          >
                            Domain Experts
                          </TabsTrigger>
                          <TabsTrigger
                            value="end-users"
                            className="text-xs hover:bg-yellow-50 hover:text-foreground transition-colors"
                          >
                            End Users
                          </TabsTrigger>
                          <TabsTrigger
                            value="beneficiaries"
                            className="text-xs hover:bg-yellow-50 hover:text-foreground transition-colors"
                          >
                            Downstream Beneficiaries
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
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Section 7: Expert Management */}
              <Card
                id="expert-management"
                className={`glassmorphism ${
                  activeSection === "expert-management" ? "" : "hidden"
                }`}
              >
                <Collapsible
                  open={activeSection === "expert-management"}
                  onOpenChange={() => toggleSection("expert-management")}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="pb-4 cursor-pointer hover:bg-yellow-50 transition-colors rounded-t-lg">
                      <CardTitle className="flex items-center justify-between text-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/5">
                            <UserCheck className="w-5 h-5 text-primary/70" />
                          </div>
                          Expert Management
                        </div>
                        {activeSection === "expert-management" ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="space-y-6 animate-accordion-down">
                      <p className="text-muted-foreground leading-relaxed">
                        Managing domain experts and their contributions to the
                        MDII evaluation.
                      </p>

                      <Tabs defaultValue="role" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger
                            value="role"
                            className="text-xs hover:bg-yellow-50 hover:text-foreground transition-colors"
                          >
                            Expert Roles
                          </TabsTrigger>
                          <TabsTrigger
                            value="criteria"
                            className="text-xs hover:bg-yellow-50 hover:text-foreground transition-colors"
                          >
                            Selection Criteria
                          </TabsTrigger>
                          <TabsTrigger
                            value="process"
                            className="text-xs hover:bg-yellow-50 hover:text-foreground transition-colors"
                          >
                            Selection Process
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="role" className="mt-6">
                          <div className="p-6 rounded-lg bg-gray-50 border border-gray-200">
                            <h4 className="font-semibold text-foreground mb-4">
                              Role of Domain Experts
                            </h4>
                            <div className="space-y-4">
                              <p className="text-muted-foreground leading-relaxed">
                                Domain experts provide an independent
                                perspective on how inclusive a digital tool is
                                across critical dimensions like GESI, ICT, Data,
                                Economics, and more. They{" "}
                                <strong>
                                  do not represent tool developers or project
                                  teams
                                </strong>
                                . Their role is to apply their subject-matter
                                knowledge to interpret and assess the
                                information provided by innovators.
                              </p>
                              <p className="text-muted-foreground leading-relaxed">
                                Each MDII evaluation should include at least one
                                expert per relevant domain, depending on the
                                version being used (Regular or Ex-Ante). These
                                experts help validate the inclusiveness of the
                                tool from different disciplinary angles.
                              </p>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="criteria" className="mt-6">
                          <div className="p-6 rounded-lg bg-gray-50 border border-gray-200">
                            <h4 className="font-semibold text-foreground mb-4">
                              Selection Criteria
                            </h4>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                              Domain experts can be internal or external to the
                              organization conducting the evaluation, but they
                              must meet two key criteria:
                            </p>

                            <div className="space-y-4">
                              <div className="p-4 rounded-lg bg-muted/30 border border-muted-foreground/20">
                                <h5 className="font-semibold text-sm mb-3 text-foreground">
                                  1. Subject-matter Relevance
                                </h5>
                                <p className="text-sm text-muted-foreground mb-3">
                                  The individual should have recognized
                                  expertise in one of the required domains:
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                  {[
                                    "Gender Equality and Social Inclusion",
                                    "Information and Communication Technologies",
                                    "Data",
                                    "Economics",
                                    "Human-Centered Design (Regular Version only)",
                                    "Country Expert",
                                  ].map((domain, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-2 text-sm text-muted-foreground"
                                    >
                                      <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                      {domain}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="p-4 rounded-lg bg-muted/30 border border-muted-foreground/20">
                                <h5 className="font-semibold text-sm mb-2 text-foreground">
                                  2. Independence from the Tool
                                </h5>
                                <p className="text-sm text-muted-foreground">
                                  Experts must not have been involved in the
                                  development, design, implementation, or
                                  promotion of the tool under evaluation. Their
                                  perspective should be impartial and based on
                                  professional knowledge of the domain.
                                </p>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="process" className="mt-6">
                          <div className="p-6 rounded-lg bg-gray-50 border border-gray-200">
                            <h4 className="font-semibold text-foreground mb-4">
                              How to Identify and Select Experts
                            </h4>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                              The person coordinating the evaluation should take
                              the following steps:
                            </p>

                            <div className="space-y-2 mb-6">
                              {[
                                "Start with your institution or program team - look for subject-matter expertise without direct tool involvement",
                                "Expand to trusted networks - partner institutions, universities, domain-specific networks",
                                "Verify eligibility - ensure both domain relevance and independence criteria are met",
                                "Send clear invitation - explain purpose, contribution, time commitment (30-60 minutes), and importance of independence",
                              ].map((step, index) => (
                                <div
                                  key={index}
                                  className="p-3 rounded-lg bg-muted/20 border border-muted-foreground/10"
                                >
                                  <span className="font-medium text-sm text-foreground">
                                    {index + 1}.{" "}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    {step}
                                  </span>
                                </div>
                              ))}
                            </div>

                            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                              <h4 className="font-semibold text-sm mb-2 text-primary">
                                Coordination Tips
                              </h4>
                              <ul className="space-y-1">
                                {[
                                  "Aim for diversity across the expert pool—gender, geography, and institutional backgrounds",
                                  "Experts can be identified at any stage, but surveys should only be shared after innovator inputs are complete",
                                  "Keep track of which domains have been assigned and who is responsible for each",
                                ].map((tip, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-2 text-sm text-muted-foreground"
                                  >
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Section 8: Evaluation Workflow */}
              <Card
                id="evaluation-process"
                className={`glassmorphism ${
                  activeSection === "evaluation-process" ? "" : "hidden"
                }`}
              >
                <Collapsible
                  open={activeSection === "evaluation-process"}
                  onOpenChange={() => toggleSection("evaluation-process")}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="pb-4 cursor-pointer hover:bg-yellow-50 transition-colors rounded-t-lg">
                      <CardTitle className="flex items-center justify-between text-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/5">
                            <BarChart3 className="w-5 h-5 text-primary/70" />
                          </div>
                          Evaluation Workflow
                        </div>
                        {activeSection === "evaluation-process" ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="space-y-6 animate-accordion-down">
                      <p className="text-muted-foreground leading-relaxed">
                        This section outlines the full journey of evaluating a
                        digital tool's inclusiveness using the MDII desktop
                        toolkit. Whether you're a field coordinator, evaluator,
                        or project lead, these are the steps you'll follow from
                        requesting your evaluation code to generating your final
                        report.
                      </p>

                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <p className="text-sm font-medium text-primary mb-1">
                          Timeline Information
                        </p>
                        <p className="text-sm text-muted-foreground">
                          The duration of an MDII evaluation depends on how fast
                          you can make your respondents fill out their surveys.
                          As an evaluation coordinator, your work is easy and
                          almost instantaneous.
                        </p>
                      </div>

                      {/* Colorful Workflow Steps with Collapsible Details */}
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
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Section 9: Outputs */}
              <Card
                id="outputs"
                className={`glassmorphism ${
                  activeSection === "outputs" ? "" : "hidden"
                }`}
              >
                <Collapsible
                  open={activeSection === "outputs"}
                  onOpenChange={() => toggleSection("outputs")}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="pb-4 cursor-pointer hover:bg-yellow-50 transition-colors rounded-t-lg">
                      <CardTitle className="flex items-center justify-between text-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/5">
                            <FileText className="w-5 h-5 text-primary/70" />
                          </div>
                          Expected Outputs
                        </div>
                        {activeSection === "outputs" ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="space-y-6 animate-accordion-down">
                      {/* Onboarding Context */}
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
                          <TabsTrigger
                            value="score-tiers"
                            className="gap-2 hover:bg-yellow-50"
                          >
                            <BarChart3 className="w-4 h-4" />
                            Score Tiers
                          </TabsTrigger>
                          <TabsTrigger
                            value="interpreting"
                            className="gap-2 hover:bg-yellow-50"
                          >
                            <TrendingUp className="w-4 h-4" />
                            Interpreting Results
                          </TabsTrigger>
                          <TabsTrigger
                            value="outputs"
                            className="gap-2 hover:bg-yellow-50"
                          >
                            <FileText className="w-4 h-4" />
                            What You'll Receive
                          </TabsTrigger>
                        </TabsList>

                        {/* Score Tiers Tab */}
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
                                  color:
                                    "bg-green-100 text-green-800 border-green-200",
                                },
                                {
                                  range: "70–89%",
                                  label: "Meeting Expectations",
                                  color:
                                    "bg-blue-100 text-blue-800 border-blue-200",
                                },
                                {
                                  range: "50–69%",
                                  label: "Approaching Expectations",
                                  color:
                                    "bg-yellow-100 text-yellow-800 border-yellow-200",
                                },
                                {
                                  range: "25–49%",
                                  label: "Below Expectations",
                                  color:
                                    "bg-orange-100 text-orange-800 border-orange-200",
                                },
                                {
                                  range: "0–24%",
                                  label: "Significantly Below Expectations",
                                  color:
                                    "bg-red-100 text-red-800 border-red-200",
                                },
                              ].map((tier, index) => (
                                <div
                                  key={index}
                                  className={`p-3 rounded border text-sm ${tier.color}`}
                                >
                                  <span className="font-medium">
                                    {tier.range}:
                                  </span>{" "}
                                  {tier.label}
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

                        {/* Outputs Tab */}
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
                                <p className="text-xs font-medium text-accent-foreground">
                                  Use this brief as a planning and discussion
                                  tool with your team or partners.
                                </p>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Section 10: Troubleshooting */}
              <Card
                id="troubleshooting"
                className={`glassmorphism ${
                  activeSection === "troubleshooting" ? "" : "hidden"
                }`}
              >
                <Collapsible
                  open={activeSection === "troubleshooting"}
                  onOpenChange={() => toggleSection("troubleshooting")}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="pb-4 cursor-pointer hover:bg-yellow-50 transition-colors rounded-t-lg">
                      <CardTitle className="flex items-center justify-between text-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/5">
                            <HelpCircle className="w-5 h-5 text-primary/70" />
                          </div>
                          Troubleshooting
                        </div>
                        {activeSection === "troubleshooting" ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="space-y-6 animate-accordion-down">
                      {/* Onboarding Context */}
                      <div className="p-4 rounded-lg bg-gradient-to-r from-red-500/5 to-orange-500/5 border border-red-500/20">
                        <p className="text-muted-foreground leading-relaxed">
                          Encountering issues with the MDII Desktop App or
                          evaluation process? This section provides solutions to
                          common problems, step-by-step troubleshooting guides,
                          and tips to ensure a smooth evaluation experience.
                        </p>
                      </div>

                      <Tabs defaultValue="common-issues" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger
                            value="common-issues"
                            className="gap-2 hover:bg-yellow-50"
                          >
                            <AlertCircle className="w-4 h-4" />
                            Common Issues
                          </TabsTrigger>
                          <TabsTrigger
                            value="app-problems"
                            className="gap-2 hover:bg-yellow-50"
                          >
                            <Settings className="w-4 h-4" />
                            App Problems
                          </TabsTrigger>
                          <TabsTrigger
                            value="evaluation-help"
                            className="gap-2 hover:bg-yellow-50"
                          >
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
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Section 11: Additional Support */}
              <Card
                id="additional-support"
                className={`glassmorphism ${
                  activeSection === "additional-support" ? "" : "hidden"
                }`}
              >
                <Collapsible
                  open={activeSection === "additional-support"}
                  onOpenChange={() => toggleSection("additional-support")}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="pb-4 cursor-pointer hover:bg-yellow-50 transition-colors rounded-t-lg">
                      <CardTitle className="flex items-center justify-between text-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/5">
                            <HelpCircle className="w-5 h-5 text-primary/70" />
                          </div>
                          Additional Support
                        </div>
                        {activeSection === "additional-support" ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="space-y-6 animate-accordion-down">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Technical Support */}
                        <div className="p-4 rounded-lg border border-border bg-card">
                          <h4 className="font-semibold text-foreground mb-2">
                            Technical Support
                          </h4>
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

                        {/* Methodology Questions */}
                        <div className="p-4 rounded-lg border border-border bg-card">
                          <h4 className="font-semibold text-foreground mb-2">
                            Methodology Questions
                          </h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            For evaluation methodology and process guidance
                          </p>
                          <div className="p-3 rounded-lg bg-muted/20 border">
                            <a
                              href="mailto:mdii@mdii.org"
                              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                              mdii@cgiar.org
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <p className="text-sm text-muted-foreground text-center">
                          <strong>Response Time:</strong> We typically respond
                          to support requests within 1-2 business days. For
                          urgent technical issues, please indicate "URGENT" in
                          your subject line.
                        </p>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Section 12: Further Reading */}
              <Card
                id="further-reading"
                className={`glassmorphism ${
                  activeSection === "further-reading" ? "" : "hidden"
                }`}
              >
                <Collapsible
                  open={activeSection === "further-reading"}
                  onOpenChange={() => toggleSection("further-reading")}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="pb-4 cursor-pointer hover:bg-yellow-50 transition-colors rounded-t-lg">
                      <CardTitle className="flex items-center justify-between text-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/5">
                            <BookOpen className="w-5 h-5 text-primary/70" />
                          </div>
                          Further Reading
                        </div>
                        {activeSection === "further-reading" ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="space-y-6 animate-accordion-down">
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
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Section 13: Acknowledgments & Development Team */}
              <Card
                id="acknowledgments"
                className={`glassmorphism ${
                  activeSection === "acknowledgments" ? "" : "hidden"
                }`}
              >
                <Collapsible
                  open={activeSection === "acknowledgments"}
                  onOpenChange={() => toggleSection("acknowledgments")}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="pb-4 cursor-pointer hover:bg-yellow-50 transition-colors rounded-t-lg">
                      <CardTitle className="flex items-center justify-between text-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/5">
                            <Users className="w-5 h-5 text-primary/70" />
                          </div>
                          Acknowledgments & Development Team
                        </div>
                        {activeSection === "acknowledgments" ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="space-y-6 animate-accordion-down">
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
                              <h5 className="font-medium text-accent-foreground mb-2">
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
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};
export default UserGuide;
