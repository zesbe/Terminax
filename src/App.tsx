import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import {TerminalSession, TerminalOutput, FileItem} from './types';
import Terminal from './components/Terminal';
import TabManager from './components/TabManager';
import CustomKeyboard from './components/CustomKeyboard';
import FileBrowser from './components/FileBrowser';
import ShellModule from './utils/ShellNativeModule';

const App = () => {
  const [sessions, setSessions] = useState<TerminalSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [showFileBrowser, setShowFileBrowser] = useState(false);

  // Initialize first session on mount
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const currentDir = await ShellModule.getCurrentDirectory();
      const env = await ShellModule.getEnvironmentVariables();
      const shellInfo = await ShellModule.getShellInfo();

      const newSession = createNewSession(currentDir, env, shellInfo);
      setSessions([newSession]);
      setActiveSessionId(newSession.id);
    } catch (error) {
      console.error('Failed to initialize app:', error);
      // Fallback to default values
      const newSession = createNewSession('/data/data/com.termux/files/home', {
        USER: 'user',
        HOME: '/data/data/com.termux/files/home',
        HOSTNAME: 'android',
      });
      setSessions([newSession]);
      setActiveSessionId(newSession.id);
    }
  };

  const createNewSession = (
    currentDir: string,
    env: Record<string, string>,
    shellInfo?: {shell: string; isTermux: boolean; isSystemShell: boolean},
  ): TerminalSession => {
    const id = Date.now().toString();
    const outputs: TerminalOutput[] = [
      {
        id: `${id}-welcome`,
        text: 'Welcome to TermuxTerminal!',
        type: 'output',
        timestamp: Date.now(),
      },
    ];

    // Add shell info if available
    if (shellInfo) {
      const shellType = shellInfo.isTermux
        ? 'Termux Shell (Full Access)'
        : 'Android System Shell (Limited)';
      outputs.push({
        id: `${id}-shell`,
        text: `Using: ${shellType}`,
        type: 'output',
        timestamp: Date.now(),
      });
      if (shellInfo.isSystemShell) {
        outputs.push({
          id: `${id}-warning`,
          text: 'Note: Some commands (pkg, apt) are not available in system shell',
          type: 'output',
          timestamp: Date.now(),
        });
      }
    }

    outputs.push({
      id: `${id}-info`,
      text: 'Type your commands below...',
      type: 'output',
      timestamp: Date.now(),
    });

    return {
      id,
      name: `Session ${sessions.length + 1}`,
      outputs,
      currentDirectory: currentDir,
      environment: env,
    };
  };

  const getActiveSession = (): TerminalSession | undefined => {
    return sessions.find(s => s.id === activeSessionId);
  };

  const updateSession = (
    sessionId: string,
    updates: Partial<TerminalSession>,
  ) => {
    setSessions(prev =>
      prev.map(s => (s.id === sessionId ? {...s, ...updates} : s)),
    );
  };

  const handleExecuteCommand = async (command: string) => {
    const session = getActiveSession();
    if (!session) return;

    // Add command to outputs
    const commandOutput: TerminalOutput = {
      id: `${Date.now()}-cmd`,
      text: command,
      type: 'command',
      timestamp: Date.now(),
    };

    const updatedOutputs = [...session.outputs, commandOutput];
    updateSession(session.id, {outputs: updatedOutputs});

    try {
      // Execute command
      const result = await ShellModule.executeCommand(
        command,
        session.currentDirectory,
      );

      const newOutputs = [...updatedOutputs];

      // Add output
      if (result.output) {
        newOutputs.push({
          id: `${Date.now()}-out`,
          text: result.output.trim(),
          type: 'output',
          timestamp: Date.now(),
        });
      }

      // Add error
      if (result.error) {
        newOutputs.push({
          id: `${Date.now()}-err`,
          text: result.error.trim(),
          type: 'error',
          timestamp: Date.now(),
        });
      }

      // Check if command was cd
      if (command.trim().startsWith('cd ')) {
        const newDir = await ShellModule.getCurrentDirectory();
        updateSession(session.id, {
          outputs: newOutputs,
          currentDirectory: newDir,
        });
      } else {
        updateSession(session.id, {outputs: newOutputs});
      }
    } catch (error: any) {
      const errorOutput: TerminalOutput = {
        id: `${Date.now()}-err`,
        text: `Error: ${error.message}`,
        type: 'error',
        timestamp: Date.now(),
      };
      updateSession(session.id, {
        outputs: [...updatedOutputs, errorOutput],
      });
    }
  };

  const handleNewSession = async () => {
    try {
      const currentDir = await ShellModule.getCurrentDirectory();
      const env = await ShellModule.getEnvironmentVariables();
      const shellInfo = await ShellModule.getShellInfo();
      const newSession = createNewSession(currentDir, env, shellInfo);
      setSessions([...sessions, newSession]);
      setActiveSessionId(newSession.id);
    } catch (error) {
      console.error('Failed to create new session:', error);
    }
  };

  const handleCloseSession = (sessionId: string) => {
    if (sessions.length === 1) return; // Don't close last session

    const newSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(newSessions);

    if (sessionId === activeSessionId && newSessions.length > 0) {
      setActiveSessionId(newSessions[0].id);
    }
  };

  const handleGetFiles = async (path: string): Promise<FileItem[]> => {
    try {
      const files = await ShellModule.listFiles(path);
      return files;
    } catch (error) {
      console.error('Failed to list files:', error);
      return [];
    }
  };

  const handleSelectDirectory = (path: string) => {
    const session = getActiveSession();
    if (session) {
      updateSession(session.id, {currentDirectory: path});
      handleExecuteCommand(`cd ${path}`);
    }
  };

  const handleSelectFile = (path: string) => {
    const session = getActiveSession();
    if (session) {
      handleExecuteCommand(`cat ${path}`);
    }
  };

  const handleKeyPress = (key: string) => {
    // This would need to integrate with the Terminal component's input
    // For now, we'll handle special keys
    if (key === 'CTRL' || key === 'ALT') {
      // Toggle modifier key state (would need state management)
      return;
    }
    // Otherwise insert the character
    // This needs to be connected to Terminal's TextInput
  };

  const activeSession = getActiveSession();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e1e1e" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowFileBrowser(true)}>
          <Text style={styles.buttonText}>Files</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowKeyboard(!showKeyboard)}>
          <Text style={styles.buttonText}>
            {showKeyboard ? 'Hide Keys' : 'Show Keys'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Manager */}
      <TabManager
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewSession={handleNewSession}
        onCloseSession={handleCloseSession}
      />

      {/* Terminal */}
      {activeSession && (
        <Terminal
          session={activeSession}
          onExecuteCommand={handleExecuteCommand}
          onChangeDirectory={handleSelectDirectory}
        />
      )}

      {/* Custom Keyboard */}
      <CustomKeyboard visible={showKeyboard} onKeyPress={handleKeyPress} />

      {/* File Browser */}
      {activeSession && (
        <FileBrowser
          visible={showFileBrowser}
          currentPath={activeSession.currentDirectory}
          onClose={() => setShowFileBrowser(false)}
          onSelectFile={handleSelectFile}
          onSelectDirectory={handleSelectDirectory}
          onGetFiles={handleGetFiles}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  topBar: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    backgroundColor: '#4ecdc4',
    borderRadius: 5,
    marginRight: 10,
  },
  buttonText: {
    color: '#1e1e1e',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default App;
