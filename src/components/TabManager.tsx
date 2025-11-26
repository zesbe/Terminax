import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {TerminalSession} from '../types';

interface TabManagerProps {
  sessions: TerminalSession[];
  activeSessionId: string;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
  onCloseSession: (sessionId: string) => void;
}

const TabManager: React.FC<TabManagerProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onCloseSession,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
        {sessions.map((session, index) => (
          <View
            key={session.id}
            style={[
              styles.tab,
              session.id === activeSessionId && styles.activeTab,
            ]}>
            <TouchableOpacity
              style={styles.tabContent}
              onPress={() => onSelectSession(session.id)}>
              <Text
                style={[
                  styles.tabText,
                  session.id === activeSessionId && styles.activeTabText,
                ]}>
                {session.name || `Session ${index + 1}`}
              </Text>
            </TouchableOpacity>
            {sessions.length > 1 && (
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => onCloseSession(session.id)}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {/* New Tab Button */}
        <TouchableOpacity style={styles.newTabButton} onPress={onNewSession}>
          <Text style={styles.newTabButtonText}>+</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2a2a2a',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  tabScroll: {
    flexGrow: 0,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderTopWidth: 2,
    borderTopColor: 'transparent',
    paddingHorizontal: 3,
    marginRight: 1,
  },
  activeTab: {
    backgroundColor: '#2a2a2a',
    borderTopColor: '#4ecdc4',
  },
  tabContent: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  tabText: {
    color: '#888',
    fontSize: 13,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#ffffff',
  },
  closeButton: {
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  closeButtonText: {
    color: '#888',
    fontSize: 20,
    fontWeight: '300',
  },
  newTabButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 50,
  },
  newTabButtonText: {
    color: '#4ecdc4',
    fontSize: 18,
    fontWeight: '300',
  },
});

export default TabManager;
