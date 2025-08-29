import { Pin, Trash2 } from 'lucide-react';
import { Note } from '@/types/note';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface NoteCardProps {
  note: Note;
  isSelected: boolean;
  viewMode: 'grid' | 'list';
  onClick: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
}

export function NoteCard({
  note,
  isSelected,
  viewMode,
  onClick,
  onDelete,
  onTogglePin,
}: NoteCardProps) {
  const noteColors = {
    yellow: 'bg-note-yellow-light',
    pink: 'bg-note-pink',
    blue: 'bg-note-blue',
    green: 'bg-note-green',
  };

  const bgColor = note.color ? noteColors[note.color] : 'bg-card';

  if (viewMode === 'list') {
    return (
      <div
        className={cn(
          "flex items-center px-4 py-3 cursor-pointer transition-all border-b border-border hover:bg-accent/50",
          isSelected && "bg-accent",
          bgColor
        )}
        onClick={onClick}
      >
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{note.title || 'Untitled'}</h3>
          <p className="text-xs text-muted-foreground truncate">{note.content || 'No content'}</p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          {note.isPinned && <Pin className="h-3 w-3 text-primary fill-primary" />}
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative group rounded-xl p-4 cursor-pointer transition-all h-48",
        "shadow-sm hover:shadow-md",
        isSelected && "ring-2 ring-primary shadow-glow",
        bgColor
      )}
      onClick={onClick}
    >
      {/* Pin Icon */}
      {note.isPinned && (
        <Pin className="absolute top-2 right-2 h-4 w-4 text-primary fill-primary" />
      )}

      {/* Actions */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        {!note.isPinned && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin();
            }}
          >
            <Pin className="h-3 w-3" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      {/* Content */}
      <div className="h-full flex flex-col">
        <h3 className="font-semibold text-base mb-2 line-clamp-2">
          {note.title || 'Untitled'}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-4 flex-1">
          {note.content || 'No content'}
        </p>
        <span className="text-xs text-muted-foreground mt-2">
          {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}