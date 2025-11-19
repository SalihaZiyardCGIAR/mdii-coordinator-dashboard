import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AddNoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  toolData: any | null
  toolId: string | null
  onSave: (content: string) => void
}

export const AddNoteDialog = ({
  open,
  onOpenChange,
  toolData,
  toolId,
  onSave,
}: AddNoteDialogProps) => {
  const [newNoteContent, setNewNoteContent] = useState("")

  const handleSave = () => {
    onSave(newNoteContent)
    setNewNoteContent("")
  }

  const handleCancel = () => {
    onOpenChange(false)
    setNewNoteContent("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
          <DialogDescription>
            {toolData?.name} ({toolId})
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block text-foreground">Note Content</label>
            <Textarea
              placeholder="Enter your note here..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}