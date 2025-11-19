import { useState } from "react";
import { useData } from "@/context/DataContext";
import { useToast } from "@/hooks/use-toast";

const useToolActions = () => {
  const { allTools, setTools } = useData();
  const { toast } = useToast();
  const [stoppingToolId, setStoppingToolId] = useState<string | null>(null);

  const handleStopTool = async (toolId: string) => {
    setStoppingToolId(toolId);
    const tool = allTools.find((t) => t.id === toolId);
    if (!tool) return;

    const currentDateTime = new Date();
    const formattedDateTime = currentDateTime.toLocaleString();
    const isoDateTime = currentDateTime.toISOString();

    try {
      const calculationMethod = tool.maturityLevel === "advanced" 
        ? "MDII Regular Version" 
        : "MDII Exante Version";
      
      const csvApiUrl = `${import.meta.env.VITE_AZURE_FUNCTION_BASE}/api/score_kobo_tool?code=${import.meta.env.VITE_AZURE_FUNCTION_KEY}&tool_id=${tool.id}&calculation_method=${encodeURIComponent(calculationMethod)}&column_names=column_names`;
      
      const img = new Image();
      img.src = csvApiUrl;

      await new Promise(resolve => setTimeout(resolve, 1000));

      const apiUrl = `/api/score-tool?tool_id=${tool.id}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Failed to trigger tool stop: ${response.statusText}`);
      }

      setTools((prev) =>
        prev.map((t) => (t.id === tool.id ? { ...t, status: "stopped" } : t))
      );

      toast({
        title: "Tool Stopped",
        description: `${tool.name} evaluation closed at ${formattedDateTime}. Email with report will be sent shortly.`,
      });

      setTimeout(async () => {
        try {
          const flowUrl = "https://default6afa0e00fa1440b78a2e22a7f8c357.d5.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/080a15cb2b9b4387ac23f1a7978a8bbb/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=XlWqhTpqNuxZJkvKeCoWziBX5Vhgtix8zdUq0IF8Npw";

          const pdfReportLink = `https://mdii-score-tool-gveza9gtabfbbxh8.eastus2-01.azurewebsites.net/api/report_pdf_generation?tool_id=${tool.id}`;

          const payload = {
            tool_id: tool.id,
            tool_name: tool.name,
            tool_maturity: tool.maturityLevel || "unknown",
            stopped_at: formattedDateTime,
            stopped_at_iso: isoDateTime,
            timestamp: currentDateTime.getTime(),
            pdf_report_link: pdfReportLink,
          };

          const flowResponse = await fetch(flowUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (!flowResponse.ok) {
            throw new Error(`Failed to trigger email flow: ${flowResponse.statusText}`);
          }

          toast({
            title: "Email Triggered",
            description: `Email for tool ${tool.id} has been sent with score report link attached.`,
          });
        } catch (flowErr: any) {
          console.error("Error triggering Power Automate:", flowErr);
          toast({
            title: "Error",
            description: `Failed to trigger email: ${flowErr.message}`,
            variant: "destructive",
          });
        }
      }, 6000);
    } catch (err: any) {
      console.error("Error stopping tool:", err);
      toast({
        title: "Error",
        description: err.message.includes("Failed to fetch") || err.message.includes("CORS")
          ? "Unable to connect to the server. Please try again later or contact support."
          : `Failed to stop tool: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setStoppingToolId(null);
    }
  };

  return {
    handleStopTool,
    stoppingToolId,
  };
};

export default useToolActions;