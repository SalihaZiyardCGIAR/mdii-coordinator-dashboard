import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Target, ArrowRight, Scale, Globe, SearchIcon, ListChecks, Earth } from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-forest-light via-background to-earth-blue-light">
      {/* Header */}
      <header className="border-b border-border/20 bg-card/30 backdrop-blur-sm flex-shrink-0">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Earth  className="w-6 h-6 text-primary-foreground " />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">MDII Tool Portal</h1>
                <p className="text-sm text-muted-foreground">MDII Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16 flex-1">
        <div className="text-center max-w-4xl mx-auto mb-16 mt-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Hi, welcome 👋
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            This is the Multidimensional Digital Inclusiveness Index internal portal for admins and coordinators to manage evaluations, monitor tool scores, and support digital inclusiveness strategies. 
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-gradient-to-r from-forest to-primary hover:from-forest/90 hover:to-primary/90 gap-2">
              Login
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle>Evaluation Panel Overview</CardTitle>
              <CardDescription>
                Monitor MDII scores and data for submitted tools across all phases.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* <Card className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-earth-blue to-info rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle>Digital Tool Assessment</CardTitle>
              <CardDescription>
                Evaluate innovations for inclusiveness, review stakeholder inputs, and manage assessment processes
              </CardDescription>
            </CardHeader>
          </Card> */}

          <Card className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <SearchIcon className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle>Assigned Tools</CardTitle>
              <CardDescription>
                View and manage all assigned tools. Track maturity, status, evaluation progress, and next steps.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <ListChecks className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle>Evaluation Status Tracker</CardTitle>
              <CardDescription>
                Monitor completion rates across tools. See where inputs are missing and coordinate follow-up.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/20 bg-card/30 backdrop-blur-sm mt-auto flex-shrink-0">
        <div className="container mx-auto px-6 py-8 text-center">
          <p className="text-muted-foreground">
            © 2025 CGIAR MDII Project. Platform for assessing and enhancing digital inclusiveness in agricultural innovation.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;