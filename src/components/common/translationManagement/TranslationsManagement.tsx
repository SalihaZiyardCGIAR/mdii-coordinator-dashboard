import { useState } from "react";
import { Languages, Send, Loader2, CheckCircle, Mail, User, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LANGUAGES } from "@/lib/constants";

export const TranslationsManagement = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    translatorName: "",
    translatorEmail: "",
    language: "",
    mdiiVersion: "",
  });
  const [sending, setSending] = useState(false);
  const [recentTranslations, setRecentTranslations] = useState<any[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.translatorName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter the translator's name.",
        variant: "destructive",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.translatorEmail.trim() || !emailRegex.test(formData.translatorEmail)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.language) {
      toast({
        title: "Validation Error",
        description: "Please select a language.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.mdiiVersion) {
      toast({
        title: "Validation Error",
        description: "Please select an MDII version.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSendEmail = async () => {
    if (!validateForm()) return;

    setSending(true);

    try {
      const flowUrl = `${import.meta.env.VITE_POWER_AUTOMATE_FLOW_URL_SEND_EMAIL_TO_TRANSLATOR}`;


      const payload = {
        translator_name: formData.translatorName,
        translator_email: formData.translatorEmail,
        language: formData.language,
        mdii_version: formData.mdiiVersion,
        requested_at: new Date().toISOString(),
        requested_by: localStorage.getItem("coordinatorEmail") || "admin",
      };

      const response = await fetch(flowUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to send email: ${response.statusText}`);
      }

      // Add to recent translations
      const newTranslation = {
        id: Date.now().toString(),
        ...formData,
        sentAt: new Date().toLocaleString(),
      };
      setRecentTranslations(prev => [newTranslation, ...prev].slice(0, 5));

      toast({
        title: "Email Sent Successfully",
        description: `Translation request sent to ${formData.translatorEmail}`,
      });

      // Reset form
      setFormData({
        translatorName: "",
        translatorEmail: "",
        language: "",
        mdiiVersion: "",
      });
    } catch (error: any) {
      console.error("Error sending email:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Translations Management</h1>
            <p className="text-muted-foreground mt-1">Request translations for MDII Surveys</p>
          </div>
        </div>
      </div>

      {/* Translation Request Form */}
      <Card className="shadow-lg">
        <CardHeader className="border-b bg-muted/50">
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            New Translation Request
          </CardTitle>
          <CardDescription>
            Fill in the details below to send a translation request to a translator
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Translator Name */}
            <div className="space-y-2">
              <Label htmlFor="translatorName" className="text-base font-medium">
                Translator Name *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="translatorName"
                  placeholder="Enter translator's full name"
                  value={formData.translatorName}
                  onChange={(e) => handleInputChange("translatorName", e.target.value)}
                  className="pl-9 h-11"
                />
              </div>
            </div>

            {/* Translator Email */}
            <div className="space-y-2">
              <Label htmlFor="translatorEmail" className="text-base font-medium">
                Translator Email *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="translatorEmail"
                  type="email"
                  placeholder="translator@example.com"
                  value={formData.translatorEmail}
                  onChange={(e) => handleInputChange("translatorEmail", e.target.value)}
                  className="pl-9 h-11"
                />
              </div>
            </div>

            {/* Language Selection */}
            <div className="space-y-2">
              <Label htmlFor="language" className="text-base font-medium">
                Target Language *
              </Label>
              <Select
                value={formData.language}
                onValueChange={(value) => handleInputChange("language", value)}
              >
                <SelectTrigger id="language" className="h-11">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Select target language" />
                  </div>
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* MDII Version */}
            <div className="space-y-2">
              <Label htmlFor="mdiiVersion" className="text-base font-medium">
                MDII Version *
              </Label>
              <Select
                value={formData.mdiiVersion}
                onValueChange={(value) => handleInputChange("mdiiVersion", value)}
              >
                <SelectTrigger id="mdiiVersion" className="h-11">
                  <SelectValue placeholder="Select MDII version" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular Version (Advanced Stage)</SelectItem>
                  <SelectItem value="exante">Exante Version (Early Stage)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Info Alert */}
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900">
              <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-300">
                An email will be sent to the translator with the translation request details and relevant MDII documentation.
              </AlertDescription>
            </Alert>

            {/* Submit Button */}
            <Button
              onClick={handleSendEmail}
              disabled={sending}
              className="w-full h-11"
              size="lg"
            >
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending Request...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Translation Request
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};