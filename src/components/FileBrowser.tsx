import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import {FileItem} from '../types';

interface FileBrowserProps {
  visible: boolean;
  currentPath: string;
  onClose: () => void;
  onSelectFile: (path: string) => void;
  onSelectDirectory: (path: string) => void;
  onGetFiles: (path: string) => Promise<FileItem[]>;
}

const FileBrowser: React.FC<FileBrowserProps> = ({
  visible,
  currentPath,
  onClose,
  onSelectFile,
  onSelectDirectory,
  onGetFiles,
}) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState(currentPath);

  useEffect(() => {
    if (visible) {
      loadFiles(path);
    }
  }, [visible, path]);

  const loadFiles = async (directory: string) => {
    setLoading(true);
    try {
      const fileList = await onGetFiles(directory);
      setFiles(fileList);
    } catch (error) {
      Alert.alert('Error', 'Failed to load files');
    }
    setLoading(false);
  };

  const handleFilePress = (item: FileItem) => {
    if (item.type === 'directory') {
      if (item.name === '..') {
        // Go up one directory
        const parentPath = path.split('/').slice(0, -1).join('/') || '/';
        setPath(parentPath);
      } else {
        setPath(item.path);
      }
    } else {
      onSelectFile(item.path);
      onClose();
    }
  };

  const handleDirectorySelect = () => {
    onSelectDirectory(path);
    onClose();
  };

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const renderFileItem = ({item}: {item: FileItem}) => {
    const isDirectory = item.type === 'directory';
    const icon = isDirectory ? '\ud83d\udcc1' : '\ud83d\udcc4';

    return (
      <TouchableOpacity
        style={styles.fileItem}
        onPress={() => handleFilePress(item)}>
        <View style={styles.fileInfo}>
          <Text style={styles.fileIcon}>{icon}</Text>
          <View style={styles.fileDetails}>
            <Text style={[styles.fileName, isDirectory && styles.directoryName]}>
              {item.name}
            </Text>
            <Text style={styles.fileMetadata}>
              {!isDirectory && formatSize(item.size)} • {item.permissions}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>File Browser</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
        </View>

        {/* Current Path */}
        <View style={styles.pathContainer}>
          <Text style={styles.pathText}>{path}</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={handleDirectorySelect}>
            <Text style={styles.selectButtonText}>Select This Dir</Text>
          </TouchableOpacity>
        </View>

        {/* File List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <FlatList
            data={files}
            renderItem={renderFileItem}
            keyExtractor={item => item.path}
            style={styles.fileList}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#2a2a2a',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    color: '#4ecdc4',
    fontSize: 16,
    fontWeight: '500',
  },
  pathContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#252525',
  },
  pathText: {
    flex: 1,
    color: '#00ff00',
    fontFamily: 'monospace',
    fontSize: 12,
  },
  selectButton: {
    backgroundColor: '#4ecdc4',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  selectButtonText: {
    color: '#1e1e1e',
    fontSize: 12,
    fontWeight: '600',
  },
  fileList: {
    flex: 1,
  },
  fileItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 3,
  },
  directoryName: {
    color: '#4ecdc4',
    fontWeight: '500',
  },
  fileMetadata: {
    color: '#888',
    fontSize: 11,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default FileBrowser;
