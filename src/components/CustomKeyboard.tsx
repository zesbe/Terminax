import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';

interface CustomKeyboardProps {
  onKeyPress: (key: string) => void;
  onQuickCommand?: (command: string) => void;
  visible: boolean;
}

const CustomKeyboard: React.FC<CustomKeyboardProps> = ({
  onKeyPress,
  onQuickCommand,
  visible,
}) => {
  if (!visible) return null;

  const quickCommands = [
    {label: 'ls', cmd: 'ls -la', color: '#4ecdc4'},
    {label: 'pwd', cmd: 'pwd', color: '#4ecdc4'},
    {label: 'clear', cmd: 'clear', color: '#ff6b6b'},
    {label: 'help', cmd: 'help', color: '#95e1d3'},
    {label: 'ping', cmd: 'ping -c 4 1.1.1.1', color: '#ffd93d'},
    {label: 'ps', cmd: 'ps', color: '#aa96da'},
  ];

  const specialKeys = [
    {label: 'ESC', value: '\x1B', color: '#ff6b6b'},
    {label: 'TAB', value: '\t', color: '#4ecdc4'},
    {label: 'CTRL', value: 'CTRL', color: '#95e1d3'},
    {label: 'ALT', value: 'ALT', color: '#f38181'},
    {label: 'UP', value: '\x1B[A', color: '#aa96da'},
    {label: 'DOWN', value: '\x1B[B', color: '#aa96da'},
    {label: 'LEFT', value: '\x1B[D', color: '#aa96da'},
    {label: 'RIGHT', value: '\x1B[C', color: '#aa96da'},
    {label: '/', value: '/', color: '#ffd93d'},
    {label: '-', value: '-', color: '#ffd93d'},
    {label: '|', value: '|', color: '#ffd93d'},
    {label: '>', value: '>', color: '#ffd93d'},
    {label: '<', value: '<', color: '#ffd93d'},
    {label: '&', value: '&', color: '#ffd93d'},
    {label: '~', value: '~', color: '#ffd93d'},
    {label: '$', value: '$', color: '#ffd93d'},
  ];

  const functionKeys = [
    {label: 'F1', value: '\x1BOP', color: '#6c5ce7'},
    {label: 'F2', value: '\x1BOQ', color: '#6c5ce7'},
    {label: 'F3', value: '\x1BOR', color: '#6c5ce7'},
    {label: 'F4', value: '\x1BOS', color: '#6c5ce7'},
    {label: 'F5', value: '\x1B[15~', color: '#6c5ce7'},
    {label: 'F6', value: '\x1B[17~', color: '#6c5ce7'},
    {label: 'F7', value: '\x1B[18~', color: '#6c5ce7'},
    {label: 'F8', value: '\x1B[19~', color: '#6c5ce7'},
  ];

  const renderKey = (
    label: string,
    value: string,
    color: string = '#444',
  ) => (
    <TouchableOpacity
      key={label}
      style={[styles.key, {backgroundColor: color}]}
      onPress={() => onKeyPress(value)}>
      <Text style={styles.keyText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.keyboardContainer}>
          {/* Quick Commands Row */}
          {onQuickCommand && (
            <View style={styles.row}>
              {quickCommands.map(cmd => (
                <TouchableOpacity
                  key={cmd.label}
                  style={[styles.key, {backgroundColor: cmd.color}]}
                  onPress={() => onQuickCommand(cmd.cmd)}>
                  <Text style={styles.keyText}>{cmd.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Special Keys Row */}
          <View style={styles.row}>
            {specialKeys.slice(0, 8).map(key => renderKey(key.label, key.value, key.color))}
          </View>

          {/* Symbol Keys Row */}
          <View style={styles.row}>
            {specialKeys.slice(8).map(key => renderKey(key.label, key.value, key.color))}
          </View>

          {/* Function Keys Row */}
          <View style={styles.row}>
            {functionKeys.map(key => renderKey(key.label, key.value, key.color))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2a2a2a',
    borderTopWidth: 1,
    borderTopColor: '#444',
    maxHeight: 150,
  },
  keyboardContainer: {
    padding: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  key: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 5,
    borderRadius: 5,
    minWidth: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default CustomKeyboard;
