import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';

/**
 * 执行命令并返回 Promise
 */
function execAsync(command: string): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
}

/**
 * 激活 Codex 应用窗口（包括从最小化状态恢复）
 * @returns 是否需要等待（应用刚启动时需要等待）
 */
async function activateCodexWindow(): Promise<boolean> {
    const platform = process.platform;

    if (platform === 'darwin') {
        // macOS: 检查 Codex 是否正在运行
        let isRunning = false;
        try {
            const { stdout } = await execAsync('pgrep -x "Codex"');
            isRunning = stdout.trim().length > 0;
        } catch {
            isRunning = false;
        }

        // 使用 open 命令激活应用（能恢复最小化窗口，速度也快）
        try {
            await execAsync('open -a "Codex"');
        } catch (error) {
            console.log('Failed to activate Codex:', error);
        }

        // 只有应用刚启动时才需要等待
        return !isRunning;
    } else if (platform === 'win32') {
        // Windows: 检查 Codex 是否正在运行
        let isRunning = false;
        try {
            const { stdout } = await execAsync('powershell -Command "Get-Process -Name Codex -ErrorAction SilentlyContinue"');
            isRunning = stdout.trim().length > 0;
        } catch {
            isRunning = false;
        }

        const activateCommand = `powershell -Command "
$process = Get-Process -Name 'Codex' -ErrorAction SilentlyContinue
if ($process) {
    (New-Object -ComObject WScript.Shell).AppActivate('Codex')
} else {
    Start-Process 'Codex'
}
"`;
        try {
            await execAsync(activateCommand);
        } catch (error) {
            console.log('Failed to activate Codex window on Windows');
        }

        return !isRunning;
    } else {
        // Linux
        let isRunning = false;
        try {
            const { stdout } = await execAsync('pgrep -x "codex"');
            isRunning = stdout.trim().length > 0;
        } catch {
            isRunning = false;
        }

        try {
            await execAsync('wmctrl -a "Codex"');
        } catch (error) {
            console.log('wmctrl not available or Codex window not found');
        }

        return !isRunning;
    }
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Codex Opener extension is now active');

    const disposable = vscode.commands.registerCommand('codexOpener.openProject', async () => {
        // 获取当前工作区文件夹
        const workspaceFolders = vscode.workspace.workspaceFolders;

        if (!workspaceFolders || workspaceFolders.length === 0) {
            vscode.window.showErrorMessage('No workspace folder found. Please open a folder first.');
            return;
        }

        // 获取第一个工作区路径
        const workspacePath = workspaceFolders[0].uri.fsPath;

        // 获取配置中的 codex 路径
        const config = vscode.workspace.getConfiguration('codexOpener');
        const codexPath = config.get<string>('codexPath') || 'codex';

        // 显示正在打开的提示
        vscode.window.showInformationMessage(`Opening project in Codex Desktop...`);

        try {
            // 1. 先激活 Codex 窗口（包括从最小化状态恢复）
            const needsWait = await activateCodexWindow();

            // 2. 只有应用刚启动时才等待
            if (needsWait) {
                console.log('Codex was not running, waiting for it to start...');
                await new Promise(resolve => setTimeout(resolve, 1500));
            }

            // 3. 执行 codex app 命令打开项目
            const command = `"${codexPath}" app "${workspacePath}"`;
            const { stdout, stderr } = await execAsync(command);

            if (stderr) {
                console.error(`stderr: ${stderr}`);
            }

            console.log(`stdout: ${stdout}`);
            vscode.window.showInformationMessage(`Opened in Codex Desktop: ${path.basename(workspacePath)}`);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Error: ${errorMessage}`);
            vscode.window.showErrorMessage(`Failed to open Codex: ${errorMessage}`);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
