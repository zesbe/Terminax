// Terminal Types
export interface TerminalOutput {
  id: string;
  text: string;
  type: 'command' | 'output' | 'error';
  timestamp: number;
}

export interface TerminalSession {
  id: string;
  name: string;
  outputs: TerminalOutput[];
  currentDirectory: string;
  environment: Record<string, string>;
}

// File Browser Types
export interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size: number;
  permissions: string;
  modifiedAt: number;
}

// Keyboard Types
export interface KeyboardKey {
  label: string;
  value: string;
  width?: number;
  type?: 'special' | 'normal';
}

export interface KeyboardRow {
  keys: KeyboardKey[];
}

// App State Types
export interface AppState {
  sessions: TerminalSession[];
  activeSessionId: string;
  showFileBrowser: boolean;
  showCustomKeyboard: boolean;
  fontSize: number;
  theme: 'dark' | 'light';
}
