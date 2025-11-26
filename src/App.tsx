import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import {TerminalSession, TerminalOutput, FileItem} from './types';
import Terminal from './components/Terminal';
import TabManager from './components/TabManager';
import CustomKeyboard from './components/CustomKeyboard';
import FileBrowser from './components/FileBrowser';
import ShellModule from './utils/ShellNativeModule';

const shellEventEmitter = new NativeEventEmitter(NativeModules.ShellModule);

const App = () => {
  const [sessions, setSessions] = useState<TerminalSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [showFileBrowser, setShowFileBrowser] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [currentCommandId, setCurrentCommandId] = useState<string>('');

  // Initialize first session on mount
  useEffect(() => {
    initializeApp();
  }, []);

  // Setup event listeners for streaming output
  useEffect(() => {
    const outputListener = shellEventEmitter.addListener(
      'onCommandOutput',
      (event: {commandId: string; type: string; data: string}) => {
        const session = getActiveSession();
        if (!session || event.commandId !== currentCommandId) return;

        const newOutput: TerminalOutput = {
          id: `${Date.now()}-${Math.random()}`,
          text: event.data,
          type: event.type === 'error' ? 'error' : 'output',
          timestamp: Date.now(),
        };

        updateSession(session.id, {
          outputs: [...session.outputs, newOutput],
        });
      },
    );

    const completeListener = shellEventEmitter.addListener(
      'onCommandComplete',
      (event: {commandId: string; exitCode: number}) => {
        setCurrentCommandId('');
      },
    );

    const errorListener = shellEventEmitter.addListener(
      'onCommandError',
      (event: {commandId: string; error: string}) => {
        const session = getActiveSession();
        if (!session || event.commandId !== currentCommandId) return;

        const errorOutput: TerminalOutput = {
          id: `${Date.now()}-err`,
          text: `Error: ${event.error}`,
          type: 'error',
          timestamp: Date.now(),
        };

        updateSession(session.id, {
          outputs: [...session.outputs, errorOutput],
        });
        setCurrentCommandId('');
      },
    );

    return () => {
      outputListener.remove();
      completeListener.remove();
      errorListener.remove();
    };
  }, [currentCommandId, activeSessionId]);

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
        text: `Shell: ${shellType}`,
        type: 'output',
        timestamp: Date.now(),
      });
      outputs.push({
        id: `${id}-shell-path`,
        text: `Binary: ${shellInfo.shell}`,
        type: 'output',
        timestamp: Date.now(),
      });
      outputs.push({
        id: `${id}-working-dir`,
        text: `Working Dir: ${shellInfo.workingDir}`,
        type: 'output',
        timestamp: Date.now(),
      });
      if (shellInfo.isSystemShell) {
        outputs.push({
          id: `${id}-warning`,
          text: 'Note: Termux commands (pkg, apt) not available. Try: ls, pwd, echo, ps',
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

  const handleBuiltinCommand = (
    session: TerminalSession,
    command: string,
  ): boolean => {
    const cmd = command.trim().toLowerCase();
    const updatedOutputs = [...session.outputs];

    // CLEAR command
    if (cmd === 'clear' || cmd === 'cls') {
      updateSession(session.id, {outputs: []});
      return true;
    }

    // HELP command
    if (cmd === 'help') {
      const helpText = [
        'Built-in Commands:',
        '  clear, cls    - Clear terminal screen',
        '  help          - Show this help',
        '  history       - Show command history',
        '  exit          - Close current session',
        '',
        'Common Commands:',
        '  ls            - List files',
        '  pwd           - Print working directory',
        '  cd <dir>      - Change directory',
        '  echo <text>   - Print text',
        '  cat <file>    - Display file contents',
        '  ping <host>   - Ping network host',
        '  ps            - Show processes',
        '  uname -a      - System information',
      ];
      helpText.forEach(line => {
        updatedOutputs.push({
          id: `${Date.now()}-${Math.random()}`,
          text: line,
          type: 'output',
          timestamp: Date.now(),
        });
      });
      updateSession(session.id, {outputs: updatedOutputs});
      return true;
    }

    // HISTORY command
    if (cmd === 'history') {
      commandHistory.forEach((histCmd, index) => {
        updatedOutputs.push({
          id: `${Date.now()}-${index}`,
          text: `${index + 1}  ${histCmd}`,
          type: 'output',
          timestamp: Date.now(),
        });
      });
      updateSession(session.id, {outputs: updatedOutputs});
      return true;
    }

    // EXIT command
    if (cmd === 'exit') {
      if (sessions.length > 1) {
        handleCloseSession(session.id);
      } else {
        updatedOutputs.push({
          id: `${Date.now()}-exit`,
          text: 'Cannot exit last session',
          type: 'error',
          timestamp: Date.now(),
        });
        updateSession(session.id, {outputs: updatedOutputs});
      }
      return true;
    }

    return false;
  };

  const handleExecuteCommand = async (command: string) => {
    const session = getActiveSession();
    if (!session) return;

    const trimmedCommand = command.trim();
    if (!trimmedCommand) return;

    // Add to command history
    setCommandHistory(prev => [...prev, trimmedCommand]);

    // Add command to outputs
    const commandOutput: TerminalOutput = {
      id: `${Date.now()}-cmd`,
      text: trimmedCommand,
      type: 'command',
      timestamp: Date.now(),
    };

    const updatedOutputs = [...session.outputs, commandOutput];
    updateSession(session.id, {outputs: updatedOutputs});

    // Check for built-in commands
    if (handleBuiltinCommand(session, trimmedCommand)) {
      return;
    }

    try {
      // Use streaming execution for better real-time output
      const commandId = `${session.id}-${Date.now()}`;
      setCurrentCommandId(commandId);

      await ShellModule.executeCommandStreaming(
        trimmedCommand,
        session.currentDirectory,
        commandId,
      );

      // Handle directory change
      if (trimmedCommand.startsWith('cd ')) {
        try {
          const newDir = await ShellModule.getCurrentDirectory();
          const currentSession = sessions.find(s => s.id === session.id);
          if (currentSession) {
            updateSession(session.id, {currentDirectory: newDir});
          }
        } catch (e) {
          // Ignore
        }
      }
    } catch (error: any) {
      const errorOutput: TerminalOutput = {
        id: `${Date.now()}-err`,
        text: `Error: ${error.message}`,
        type: 'error',
        timestamp: Date.now(),
      };
      const currentSession = sessions.find(s => s.id === session.id);
      if (currentSession) {
        updateSession(session.id, {
          outputs: [...currentSession.outputs, errorOutput],
        });
      }
      setCurrentCommandId('');
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
      <CustomKeyboard
        visible={showKeyboard}
        onKeyPress={handleKeyPress}
        onQuickCommand={handleExecuteCommand}
      />

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
