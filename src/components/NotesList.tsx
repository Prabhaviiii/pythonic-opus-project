import { Note } from '@/types/note';
import { NoteCard } from './NoteCard';
import { cn } from '@/lib/utils';

interface NotesListProps {
  notes: Note[];
  selectedNoteId: string | null;
  viewMode: 'grid' | 'list';
  onNoteSelect: (note: Note) => void;
  onDeleteNote: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export function NotesList({
  notes,
  selectedNoteId,
  viewMode,
  onNoteSelect,
  onDeleteNote,
  onTogglePin,
}: NotesListProps) {
  if (notes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="text-lg font-medium mb-2">No notes yet</p>
          <p className="text-sm">Create your first note to get started</p>
        </div>
      </div>
    );
  }

  const pinnedNotes = notes.filter(n => n.isPinned);
  const unpinnedNotes = notes.filter(n => !n.isPinned);

  return (
    <div className={cn(
      "flex-1 overflow-auto",
      viewMode === 'grid' ? "p-6" : "py-2"
    )}>
      {pinnedNotes.length > 0 && (
        <>
          {viewMode === 'grid' && (
            <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
              Pinned
            </h2>
          )}
          <div className={cn(
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8"
              : "space-y-0"
          )}>
            {pinnedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                isSelected={selectedNoteId === note.id}
                viewMode={viewMode}
                onClick={() => onNoteSelect(note)}
                onDelete={() => onDeleteNote(note.id)}
                onTogglePin={() => onTogglePin(note.id)}
              />
            ))}
          </div>
        </>
      )}

      {unpinnedNotes.length > 0 && (
        <>
          {viewMode === 'grid' && pinnedNotes.length > 0 && (
            <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
              Notes
            </h2>
          )}
          <div className={cn(
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "space-y-0"
          )}>
            {unpinnedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                isSelected={selectedNoteId === note.id}
                viewMode={viewMode}
                onClick={() => onNoteSelect(note)}
                onDelete={() => onDeleteNote(note.id)}
                onTogglePin={() => onTogglePin(note.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}