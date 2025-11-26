import {NativeModules} from 'react-native';

interface ShellModuleType {
  executeCommand(command: string, workingDir: string): Promise<{
    output: string;
    error: string;
    exitCode: number;
  }>;
  listFiles(path: string): Promise<Array<{
    name: string;
    path: string;
    type: 'file' | 'directory';
    size: number;
    permissions: string;
    modifiedAt: number;
  }>>;
  getCurrentDirectory(): Promise<string>;
  getEnvironmentVariables(): Promise<Record<string, string>>;
  getShellInfo(): Promise<{
    shell: string;
    isTermux: boolean;
    isSystemShell: boolean;
  }>;
}

const {ShellModule} = NativeModules;

export default ShellModule as ShellModuleType;
