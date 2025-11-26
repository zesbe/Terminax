package com.termuxterminal

import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.io.*

class ShellModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val reactContext: ReactApplicationContext = reactContext

    override fun getName(): String {
        return "ShellModule"
    }

    @ReactMethod
    fun executeCommand(command: String, workingDir: String, promise: Promise) {
        try {
            val process = Runtime.getRuntime().exec(arrayOf("/system/bin/sh", "-c", command), null, File(workingDir))
            val output = StringBuilder()
            val error = StringBuilder()

            val outputReader = BufferedReader(InputStreamReader(process.inputStream))
            val errorReader = BufferedReader(InputStreamReader(process.errorStream))

            var line: String?
            while (outputReader.readLine().also { line = it } != null) {
                output.append(line).append("\n")
            }

            while (errorReader.readLine().also { line = it } != null) {
                error.append(line).append("\n")
            }

            val exitCode = process.waitFor()

            val result = Arguments.createMap()
            result.putString("output", output.toString())
            result.putString("error", error.toString())
            result.putInt("exitCode", exitCode)

            promise.resolve(result)

        } catch (e: Exception) {
            promise.reject("SHELL_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun listFiles(path: String, promise: Promise) {
        try {
            val directory = File(path)
            if (!directory.exists() || !directory.isDirectory) {
                promise.reject("INVALID_PATH", "Path does not exist or is not a directory")
                return
            }

            val files = directory.listFiles()
            val fileList = Arguments.createArray()

            // Add parent directory entry if not root
            if (path != "/") {
                val parentMap = Arguments.createMap()
                parentMap.putString("name", "..")
                parentMap.putString("path", directory.parent ?: "/")
                parentMap.putString("type", "directory")
                parentMap.putDouble("size", 0.0)
                parentMap.putString("permissions", "")
                parentMap.putDouble("modifiedAt", 0.0)
                fileList.pushMap(parentMap)
            }

            files?.forEach { file ->
                val fileMap = Arguments.createMap()
                fileMap.putString("name", file.name)
                fileMap.putString("path", file.absolutePath)
                fileMap.putString("type", if (file.isDirectory) "directory" else "file")
                fileMap.putDouble("size", file.length().toDouble())
                fileMap.putString("permissions", getPermissions(file))
                fileMap.putDouble("modifiedAt", file.lastModified().toDouble())
                fileList.pushMap(fileMap)
            }

            promise.resolve(fileList)

        } catch (e: Exception) {
            promise.reject("FILE_LIST_ERROR", e.message, e)
        }
    }

    private fun getPermissions(file: File): String {
        val perms = StringBuilder()
        perms.append(if (file.canRead()) "r" else "-")
        perms.append(if (file.canWrite()) "w" else "-")
        perms.append(if (file.canExecute()) "x" else "-")
        return perms.toString()
    }

    @ReactMethod
    fun getCurrentDirectory(promise: Promise) {
        try {
            val currentDir = File(".").absolutePath
            promise.resolve(currentDir)
        } catch (e: Exception) {
            promise.reject("DIR_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun getEnvironmentVariables(promise: Promise) {
        try {
            val envMap = Arguments.createMap()
            val env = System.getenv()
            env.forEach { (key, value) ->
                envMap.putString(key, value)
            }
            promise.resolve(envMap)
        } catch (e: Exception) {
            promise.reject("ENV_ERROR", e.message, e)
        }
    }
}
