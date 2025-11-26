import {NativeModules} from 'react-native';

interface ShellModuleType {
  executeCommand(command: string, workingDir: string): Promise<{
    output: string;
    error: string;
    exitCode: number;
  }>;
  executeCommandStreaming(
    command: string,
    workingDir: string,
    commandId: string,
  ): Promise<{exitCode: number}>;
  killCommand(commandId: string): Promise<boolean>;
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
    workingDir: string;
    path: string;
  }>;
  testCommand(): Promise<{
    output: string;
    shell: string;
    workingDir: string;
  }>;
}

const {ShellModule} = NativeModules;

export default ShellModule as ShellModuleType;
