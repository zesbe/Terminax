import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {TerminalOutput, TerminalSession} from '../types';

interface TerminalProps {
  session: TerminalSession;
  onExecuteCommand: (command: string) => void;
  onChangeDirectory: (path: string) => void;
}

const Terminal: React.FC<TerminalProps> = ({
  session,
  onExecuteCommand,
  onChangeDirectory,
}) => {
  const [currentCommand, setCurrentCommand] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new output is added
    scrollViewRef.current?.scrollToEnd({animated: true});
  }, [session.outputs]);

  const handleSubmitCommand = () => {
    if (currentCommand.trim()) {
      onExecuteCommand(currentCommand);
      setCurrentCommand('');
    }
  };

  const handleInsertText = (text: string) => {
    setCurrentCommand(prev => prev + text);
  };

  const getPrompt = () => {
    const user = session.environment.USER || 'user';
    const hostname = session.environment.HOSTNAME || 'termux';
    const cwd = session.currentDirectory.replace(
      session.environment.HOME || '/data/data/com.termux/files/home',
      '~',
    );
    return `${user}@${hostname}:${cwd}$ `;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.outputContainer}
        onTouchEnd={() => inputRef.current?.focus()}>
        {session.outputs.map(output => (
          <View key={output.id} style={styles.outputLine}>
            {output.type === 'command' && (
              <Text style={styles.promptText}>{getPrompt()}</Text>
            )}
            <Text
              style={[
                styles.outputText,
                output.type === 'error' && styles.errorText,
                output.type === 'command' && styles.commandText,
              ]}>
              {output.text}
            </Text>
          </View>
        ))}
        <View style={styles.inputLine}>
          <Text style={styles.promptText}>{getPrompt()}</Text>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={currentCommand}
            onChangeText={setCurrentCommand}
            onSubmitEditing={handleSubmitCommand}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
            multiline={false}
            returnKeyType="done"
            placeholder=""
            placeholderTextColor="#666"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  outputContainer: {
    flex: 1,
    padding: 10,
  },
  outputLine: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 2,
  },
  inputLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  promptText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#00ff00',
    marginRight: 5,
  },
  outputText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#ffffff',
    flex: 1,
  },
  commandText: {
    color: '#ffffff',
  },
  errorText: {
    color: '#ff6b6b',
  },
  input: {
    flex: 1,
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#ffffff',
    padding: 0,
    margin: 0,
  },
});

export default Terminal;
