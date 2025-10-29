import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { KOBO_CONFIG } from "@/config/koboConfig";
import { getApiUrl } from "@/config/apiConfig";
import { DataContext } from "@/context/DataContext";
import { Scale } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader } from "@/components/Loader";

const ADMIN_EMAIL = "mdii@cgiar.org";

const Login = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"coordinator" | "admin">("coordinator");
  const navigate = useNavigate();
  const { toast } = useToast();
  const dataContext = useContext(DataContext);

  if (!dataContext) {
    throw new Error("Login must be used within a DataProvider");
  }

  const { setData } = dataContext;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

      if (activeTab === "admin" && !isAdmin) {
        toast({
          title: "Access Denied",
          description: "Invalid admin credentials.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (activeTab === "coordinator" && isAdmin) {
        toast({
          title: "Wrong Login Type",
          description: "Please use the admin login tab.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const mainRes = await fetch(getApiUrl(`assets/${KOBO_CONFIG.MAIN_FORM_ID}/data.json`, "mainForm"));
      if (!mainRes.ok) {
        throw new Error(`Failed to fetch main form: ${mainRes.status} ${mainRes.statusText}`);
      }
      const mainData = await mainRes.json();
      const mainSubs = mainData.results || [];

      const changeRes = await fetch(getApiUrl(`assets/${KOBO_CONFIG.change_coordinator}/data.json`, "changeCoordinator"));
      if (!changeRes.ok) {
        throw new Error(`Failed to fetch change form: ${changeRes.status} ${changeRes.statusText}`);
      }
      const changeData = await changeRes.json();
      const changeSubs = changeData.results || [];

      const evalSubs = { advanced3: [], early3: [], advanced4: [], early4: [] };
      const formMap = {
        advanced3: { id: KOBO_CONFIG.USERTYPE3_FORMS.advance_stage, label: "advanced3" },
        early3: { id: KOBO_CONFIG.USERTYPE3_FORMS.early_stage, label: "early3" },
        advanced4: { id: KOBO_CONFIG.USERTYPE4_FORMS.advance_stage, label: "advanced4" },
        early4: { id: KOBO_CONFIG.USERTYPE4_FORMS.early_stage, label: "early4" },
      };

      for (const key in formMap) {
        const { id: fid, label } = formMap[key as keyof typeof formMap];
        const res = await fetch(getApiUrl(`assets/${fid}/data.json`, label));
        if (!res.ok) throw new Error(`Failed to fetch form ${key}`);
        const data = await res.json();
        evalSubs[key as keyof typeof evalSubs] = data.results || [];
      }

      changeSubs.sort((a, b) => 
        new Date(a._submission_time).getTime() - new Date(b._submission_time).getTime()
      );

      if (!isAdmin) {
        const currentCoord: Record<string, string> = {};
        mainSubs.forEach((sub: any) => {
          if (sub.coordinator_email) {
            currentCoord[sub[KOBO_CONFIG.TOOL_ID_FIELD]] = sub.coordinator_email;
          }
        });
        changeSubs.forEach((ch: any) => {
          const toolId = ch.tool_id;
          const newEmail = ch.Email_of_the_Coordinator;
          if (toolId && newEmail) {
            currentCoord[toolId] = newEmail;
          }
        });

        const coordinators = new Set(Object.values(currentCoord));
        if (!coordinators.has(email)) {
          toast({
            title: "Access Denied",
            description: "Email not registered as a coordinator.",
            variant: "destructive",
          });
          return;
        }
      }

      localStorage.setItem("coordinatorEmail", email);
      localStorage.setItem("isAdmin", isAdmin.toString());
      setData({ mainSubs, changeSubs, evalSubs, coordinatorEmail: email, isAdmin });

      toast({
        title: "Login Successful",
        description: isAdmin ? "Welcome Admin!" : "Redirecting to dashboard...",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to connect to server or fetch data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-forest-light via-background to-earth-blue-light p-4">
      <Card className="w-full max-w-md shadow-[var(--shadow-elevated)]">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-[200px] h-[150px] flex items-center justify-center">
            <img
              src="/mdii_logo.svg"
              alt="MDII Logo"
              className="w-[180px] h-[120px] object-contain"
            />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">MDII Portal</CardTitle>
            <CardDescription className="text-muted-foreground">
              Welcome to your dedicated portal. Login to Continue.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "coordinator" | "admin")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="coordinator">Coordinator</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
            
            <TabsContent value="coordinator">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email-coord" className="text-sm font-medium text-foreground">
                    Email Address
                  </label>
                  <Input
                    id="email-coord"
                    type="email"
                    placeholder="coordinator@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-forest to-primary hover:from-forest/90 hover:to-primary/90 text-primary-foreground relative"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2 w-full h-full absolute top-0 left-0">
                      <Loader variant="white" size={20} color="white" />
                      <span className="text-white">Logging in...</span>
                    </div>
                  ) : (
                    "Coordinator Dashboard"
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="admin">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email-admin" className="text-sm font-medium text-foreground">
                    Admin Email
                  </label>
                  <Input
                    id="email-admin"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-forest to-primary hover:from-forest/90 hover:to-primary/90 text-primary-foreground relative"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2 w-full h-full absolute top-0 left-0">
                      <Loader variant="white" size={20} color="white" />
                      <span className="text-white">Logging in...</span>
                    </div>
                  ) : (
                    "Admin Dashboard"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;