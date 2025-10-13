import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Target, ArrowRight, Scale, Globe } from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-forest-light via-background to-earth-blue-light">
      {/* Header */}
      <header className="border-b border-border/20 bg-card/30 backdrop-blur-sm flex-shrink-0">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-forest to-primary rounded-lg flex items-center justify-center">
                <Scale className="w-6 h-6 text-primary-foreground" />
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
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Multidimensional Digital Inclusiveness Index
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Comprehensive dashboard for CGIAR coordinators to assess, monitor, and enhance the social inclusiveness of digital innovations in agriculture across key dimensions like Infrastructure Accessibility, Long-term Loss, Collaborative Innovation, and more for equitable impact in food, land, and water systems.
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-gradient-to-r from-forest to-primary hover:from-forest/90 hover:to-primary/90 gap-2">
              Login to Coordinator Panel
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-forest to-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle>MDII Dashboard Overview</CardTitle>
              <CardDescription>
                Real-time MDII scores, inclusivity metrics, and summaries of digital tools and evaluations
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
              <div className="w-12 h-12 bg-gradient-to-br from-success to-warning rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle>Inclusivity Monitoring</CardTitle>
              <CardDescription>
                Track progress across MDII dimensions to bridge gender, urban-rural, and socioeconomic divides
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle>Global Impact Assessment</CardTitle>
              <CardDescription>
                Measure social inclusiveness of digital tools in agricultural systems worldwide
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