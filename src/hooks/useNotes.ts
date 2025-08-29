import { useState, useEffect } from 'react';
import { Note, Folder } from '@/types/note';

const STORAGE_KEY = 'apple-notes-clone';

const defaultFolders: Folder[] = [
  { id: 'all', name: 'All Notes', icon: '📝', createdAt: new Date().toISOString() },
  { id: 'personal', name: 'Personal', icon: '👤', createdAt: new Date().toISOString() },
  { id: 'work', name: 'Work', icon: '💼', createdAt: new Date().toISOString() },
  { id: 'ideas', name: 'Ideas', icon: '💡', createdAt: new Date().toISOString() },
];

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>(defaultFolders);
  const [selectedFolderId, setSelectedFolderId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      setNotes(data.notes || []);
      setFolders(data.folders || defaultFolders);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ notes, folders }));
  }, [notes, folders]);

  const createNote = (folderId: string = 'all') => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      folderId,
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes([newNote, ...notes]);
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, ...updates, updatedAt: new Date().toISOString() }
        : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const togglePin = (id: string) => {
    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, isPinned: !note.isPinned }
        : note
    ));
  };

  const createFolder = (name: string, icon: string = '📁') => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name,
      icon,
      createdAt: new Date().toISOString(),
    };
    setFolders([...folders, newFolder]);
    return newFolder;
  };

  const deleteFolder = (id: string) => {
    // Move all notes from this folder to 'all'
    setNotes(notes.map(note => 
      note.folderId === id 
        ? { ...note, folderId: 'all' }
        : note
    ));
    setFolders(folders.filter(folder => folder.id !== id));
    if (selectedFolderId === id) {
      setSelectedFolderId('all');
    }
  };

  const getFilteredNotes = () => {
    return notes
      .filter(note => {
        const matchesFolder = selectedFolderId === 'all' || note.folderId === selectedFolderId;
        const matchesSearch = searchQuery === '' || 
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFolder && matchesSearch;
      })
      .sort((a, b) => {
        // Pinned notes first
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        // Then by date
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  };

  return {
    notes: getFilteredNotes(),
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
  };
}