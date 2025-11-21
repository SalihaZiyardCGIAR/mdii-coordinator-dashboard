import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AddTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate: Date | null
  tools: any[]
  syncing: boolean
  onSave: (toolId: string, note: string) => void
}

export const AddTaskDialog = ({
  open,
  onOpenChange,
  selectedDate,
  tools,
  syncing,
  onSave,
}: AddTaskDialogProps) => {
  const [selectedToolId, setSelectedToolId] = useState("")
  const [taskNote, setTaskNote] = useState("")
  const [toolSearchQuery, setToolSearchQuery] = useState("")
  const [showToolDropdown, setShowToolDropdown] = useState(false)

  const filteredTools = useMemo(() => {
    return tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(toolSearchQuery.toLowerCase()) ||
        tool.id.toLowerCase().includes(toolSearchQuery.toLowerCase())
    )
  }, [tools, toolSearchQuery])

  const handleSave = () => {
    onSave(selectedToolId, taskNote)
    setSelectedToolId("")
    setTaskNote("")
    setToolSearchQuery("")
  }

  const handleCancel = () => {
    onOpenChange(false)
    setToolSearchQuery("")
    setSelectedToolId("")
    setTaskNote("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
          <DialogDescription>
            {selectedDate?.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block text-foreground">Tool</label>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tools..."
                  value={toolSearchQuery}
                  onChange={(e) => {
                    setToolSearchQuery(e.target.value)
                    setShowToolDropdown(true)
                  }}
                  onFocus={() => setShowToolDropdown(true)}
                  className="pl-9"
                />
              </div>
              {showToolDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded shadow-lg z-10 max-h-48 overflow-y-auto">
                  {filteredTools.length > 0 ? (
                    filteredTools.map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => {
                          setSelectedToolId(tool.id)
                          setToolSearchQuery(tool.name)
                          setShowToolDropdown(false)
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-sidebar-accent transition-colors border-b border-border last:border-b-0"
                      >
                        <div className="font-medium text-foreground">{tool.name}</div>
                        <div className="text-xs text-muted-foreground">{tool.id}</div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-muted-foreground text-center">No tools found</div>
                  )}
                </div>
              )}
            </div>
            {selectedToolId && (
              <div className="mt-2 p-2 bg-primary/5 rounded border border-primary/20">
                <p className="text-sm text-foreground">
                  Selected: <span className="font-semibold">{tools.find((t) => t.id === selectedToolId)?.name}</span>
                </p>
              </div>
            )}
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block text-foreground">Note</label>
            <Input placeholder="Task details..." value={taskNote} onChange={(e) => setTaskNote(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={syncing}>
            {syncing ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}