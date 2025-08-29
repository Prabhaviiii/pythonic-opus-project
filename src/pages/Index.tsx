import { useState, useMemo } from 'react';
import { useNotes } from '@/hooks/useNotes';
import { Sidebar } from '@/components/Sidebar';
import { NotesList } from '@/components/NotesList';
import { NoteEditor } from '@/components/NoteEditor';
import { Note } from '@/types/note';

const Index = () => {
  const {
    notes,
    folders,
    selectedFolderId,
    setSelectedFolderId,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    createFolder,
    deleteFolder,
  } = useNotes();

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  // Calculate note counts for each folder
  const noteCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    folders.forEach(folder => {
      if (folder.id === 'all') {
        counts[folder.id] = notes.length;
      } else {
        counts[folder.id] = notes.filter(n => n.folderId === folder.id).length;
      }
    });
    return counts;
  }, [notes, folders]);

  const handleCreateNote = () => {
    const newNote = createNote(selectedFolderId === 'all' ? 'personal' : selectedFolderId);
    setSelectedNote(newNote);
    setShowEditor(true);
  };

  const handleNoteSelect = (note: Note) => {
    setSelectedNote(note);
    setShowEditor(true);
  };

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    if (selectedNote?.id === id) {
      setSelectedNote(null);
      setShowEditor(false);
    }
  };

  const handleCreateFolder = () => {
    const name = prompt('Enter folder name:');
    if (name) {
      const icon = prompt('Enter an emoji for the folder:', '📁');
      createFolder(name, icon || '📁');
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        folders={folders}
        selectedFolderId={selectedFolderId}
        onFolderSelect={setSelectedFolderId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onCreateNote={handleCreateNote}
        onCreateFolder={handleCreateFolder}
        onDeleteFolder={deleteFolder}
        noteCounts={noteCounts}
      />
      
      <div className="flex-1 flex">
        {!showEditor ? (
          <NotesList
            notes={notes}
            selectedNoteId={selectedNote?.id || null}
            viewMode={viewMode}
            onNoteSelect={handleNoteSelect}
            onDeleteNote={handleDeleteNote}
            onTogglePin={togglePin}
          />
        ) : (
          <NoteEditor
            note={selectedNote}
            onUpdate={updateNote}
            onClose={() => setShowEditor(false)}
            onTogglePin={togglePin}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
