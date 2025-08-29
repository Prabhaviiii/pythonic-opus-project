import { useState, useEffect } from 'react';
import { Note } from '@/types/note';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Pin, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface NoteEditorProps {
  note: Note | null;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onClose: () => void;
  onTogglePin: (id: string) => void;
}

export function NoteEditor({ note, onUpdate, onClose, onTogglePin }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <p>Select a note to edit or create a new one</p>
      </div>
    );
  }

  const colors: Array<{ name: Note['color']; className: string }> = [
    { name: undefined, className: 'bg-card' },
    { name: 'yellow', className: 'bg-note-yellow-light' },
    { name: 'pink', className: 'bg-note-pink' },
    { name: 'blue', className: 'bg-note-blue' },
    { name: 'green', className: 'bg-note-green' },
  ];

  const handleTitleChange = (value: string) => {
    setTitle(value);
    onUpdate(note.id, { title: value });
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    onUpdate(note.id, { content: value });
  };

  const noteColors = {
    yellow: 'bg-note-yellow-light',
    pink: 'bg-note-pink',
    blue: 'bg-note-blue',
    green: 'bg-note-green',
  };

  const bgColor = note.color ? noteColors[note.color] : 'bg-background';

  return (
    <div className={cn("flex-1 flex flex-col h-screen", bgColor)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onTogglePin(note.id)}
          >
            <Pin className={cn("h-4 w-4", note.isPinned && "fill-primary text-primary")} />
          </Button>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowColorPicker(!showColorPicker)}
            >
              <Palette className="h-4 w-4" />
            </Button>
            {showColorPicker && (
              <div className="absolute top-full mt-1 left-0 bg-card border border-border rounded-lg p-2 flex gap-1 shadow-lg z-10">
                {colors.map((color) => (
                  <button
                    key={color.name || 'default'}
                    className={cn(
                      "w-8 h-8 rounded-full border-2",
                      color.className,
                      note.color === color.name && "border-primary",
                      note.color !== color.name && "border-border"
                    )}
                    onClick={() => {
                      onUpdate(note.id, { color: color.name });
                      setShowColorPicker(false);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          <span className="text-xs text-muted-foreground ml-2">
            {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        <Input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Note Title"
          className="text-2xl font-bold border-none bg-transparent px-0 focus-visible:ring-0 mb-4"
        />
        <Textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Start typing your note..."
          className="flex-1 resize-none border-none bg-transparent px-0 focus-visible:ring-0 text-base"
        />
        <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
          <span>{content.length} characters</span>
          <span>Created {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}</span>
        </div>
      </div>
    </div>
  );
}