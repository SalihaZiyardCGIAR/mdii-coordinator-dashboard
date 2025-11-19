import { FileText, Plus, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ToolNote } from "@/types/types"

interface ToolNotesPanelProps {
  selectedToolForNotes: string | null
  tools: any[]
  toolNotes: ToolNote[]
  onClose: () => void
  onAddNote: () => void
  onDeleteNote: (noteId: string) => void
}

export const ToolNotesPanel = ({
  selectedToolForNotes,
  tools,
  toolNotes,
  onClose,
  onAddNote,
  onDeleteNote,
}: ToolNotesPanelProps) => {
  if (!selectedToolForNotes) return null

  const selectedToolData = tools.find(t => t.id === selectedToolForNotes)
  const selectedToolNotes = toolNotes
    .filter(note => note.toolId === selectedToolForNotes)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-semibold text-foreground">Tool Notes</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {selectedToolData?.name} ({selectedToolForNotes})
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={onAddNote}>
              <Plus className="h-4 w-4 mr-1" />
              Add Note
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {selectedToolNotes.length > 0 ? (
            <div className="space-y-3">
              {selectedToolNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 rounded-lg border border-border bg-background hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <p className="text-sm text-foreground whitespace-pre-wrap">{note.content}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteNote(note.id)}
                      className="flex-shrink-0 h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      Created: {new Date(note.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground mb-1">No notes yet</p>
              <p className="text-xs text-muted-foreground">Click "Add Note" to create your first note</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}