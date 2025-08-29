export interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  color?: 'yellow' | 'pink' | 'blue' | 'green';
}

export interface Folder {
  id: string;
  name: string;
  icon?: string;
  createdAt: string;
}