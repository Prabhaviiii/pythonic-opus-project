import { Folder, Plus, Search, Grid3x3, List, Trash2 } from 'lucide-react';
import { Folder as FolderType } from '@/types/note';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface SidebarProps {
  folders: FolderType[];
  selectedFolderId: string;
  onFolderSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onCreateNote: () => void;
  onCreateFolder: () => void;
  onDeleteFolder: (id: string) => void;
  noteCounts: Record<string, number>;
}

export function Sidebar({
  folders,
  selectedFolderId,
  onFolderSelect,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onCreateNote,
  onCreateFolder,
  onDeleteFolder,
  noteCounts,
}: SidebarProps) {
  return (
    <div className="w-[var(--sidebar-width)] bg-sidebar border-r border-sidebar-border h-screen flex flex-col">
      {/* Search Bar */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-background border-input"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 flex gap-2">
        <Button
          onClick={onCreateNote}
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-1" />
          New Note
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onViewModeChange(viewMode === 'grid' ? 'list' : 'grid')}
        >
          {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3x3 className="h-4 w-4" />}
        </Button>
      </div>

      {/* Folders List */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors group",
                selectedFolderId === folder.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/50"
              )}
              onClick={() => onFolderSelect(folder.id)}
            >
              <div className="flex items-center gap-2 flex-1">
                <span className="text-lg">{folder.icon || '📁'}</span>
                <span className="font-medium text-sm">{folder.name}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {noteCounts[folder.id] || 0}
                </span>
              </div>
              {!['all', 'personal', 'work', 'ideas'].includes(folder.id) && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFolder(folder.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Add Folder Button */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={onCreateFolder}
        >
          <Folder className="h-4 w-4 mr-2" />
          New Folder
        </Button>
      </div>
    </div>
  );
}