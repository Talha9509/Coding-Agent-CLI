import fs from 'fs'
import path from 'path'
import { type ChatCompletionTool } from "openai/resources/chat/completions";
import { execSync } from "node:child_process";

function safePath(inputPath: string): string {
  const fullPath = path.resolve(process.cwd(), inputPath);
  const RootFolder = fullPath.split('/')[0]
  if (!fullPath.startsWith(RootFolder as string)) {
    throw new Error(`Path '${inputPath}' is outside the allowed working directory.`);
  }
  return fullPath;
}

const readFileToolDef: ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'read_File',
    description: 'Read a file and return its contents.',
    parameters: {
      type: 'object',
      properties: {
        filePath: {
          type: 'string',
          description: 'The path of the file to read its content'
        }
      },
      required: ["filePath"],
    }
  }
};

export async function readfileTool({ "filePath": filePath }: { "filePath": string }) {
  try {
    const safeFilePath = safePath(filePath);
    const fileWithPath = path.resolve(process.cwd(), safeFilePath);
    console.log(`Agent is reading file: ${fileWithPath}`);
    if (!fs.existsSync(fileWithPath)) {
      return `Error: File does not exist at ${fileWithPath}`;
    }
    return fs.readFileSync(fileWithPath, 'utf-8')
  } catch (error: any) {
    console.log("error")
    console.log(error.message)
  }
}

const writeFileToolDef: ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'write_File',
    description: 'Create a new file, or overwrite an existing one, with the given content.',
    parameters: {
      type: 'object',
      properties: {
        filePath: { type: 'string', description: 'The path of the file' },
        content: { type: 'string', description: 'Full content to write to the file' },
      },
      required: ["filePath", "content"],
    }
  }
};

export async function writeFileTool({ "filePath": filePath, "content": content }: { "filePath": string, "content": string }) {
  try {
    const safeFilePath = safePath(filePath);
    const fileWithPath = path.resolve(process.cwd(), safeFilePath);
    console.log(`Agent is writing file: ${fileWithPath}`);

    const dirPath = path.dirname(fileWithPath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(fileWithPath, content, 'utf-8');
    return "File written successfully."; 
  } catch (error: any) {
    console.log("error")
    return "Failed to write file: " + error.message
  }
}

const editFileToolDef: ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'edit_File',
    description: 'Edit content of a file.',
    parameters: {
      type: 'object',
      properties: {
        filePath: { type: 'string', description: 'The path of the file' },
        replaceContent: { type: 'string', description: 'Exact text to find and replace.' },
        newContent: { type: 'string', description: 'The new code or text to write in the place of replaceContent.' },
      },
      required: ["filePath", "replaceContent", "newContent"],
    }
  }
};

export async function editFileTool({ "filePath": filePath, "replaceContent": replaceContent, "newContent": newContent }: { "filePath": string, "content": string, "replaceContent": string, "newContent": string }) {
  try {
    const safeFilePath = safePath(filePath);
    const fileWithPath = path.resolve(process.cwd(), safeFilePath);
    console.log(`Agent is editing file: ${fileWithPath}`);

    if (!fs.existsSync(fileWithPath)) {
      return `Error: File does not exist at ${fileWithPath}`;
    }
    let oldData = fs.readFileSync(fileWithPath, 'utf-8');
    const normalizedOldData = oldData.replace(/\r\n/g, '\n');
    const normalizedReplace = replaceContent.replace(/\r\n/g, '\n');
    const normalizedNew = newContent.replace(/\r\n/g, '\n');

    if (!normalizedOldData.includes(normalizedReplace)) {
      return `Error: Could not find the exact text to replace in ${filePath}. Make sure whitespace and code match exactly. Current file content:\n${normalizedOldData}`;
    }

    const modifiedData = normalizedOldData.replace(normalizedReplace, normalizedNew);
    fs.writeFileSync(fileWithPath, modifiedData, 'utf-8');
    return "File edited successfully."; 
  } catch (error: any) {
    console.log("error")
    return "Failed to edit file: " + error.message
  }
}


const runCommandToolDef: ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'run_command',
    description: 'Run a shell command in the working directory and return stdout, stderr, and exit code',
    parameters: {
      type: 'object',
      properties: {
        command: { type: 'string', description: 'The shell command to run.' },
      },
      required: ["command"],
    }
  }
};

export function runCommandTool({ "command": command }: { "command": string }): string {
  try {
    const stdout = execSync(command, {
      cwd: process.cwd(),
      timeout: 30_000,
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    console.log(stdout)
    return stdout; 
  } catch (error) {
    const e = error as { stdout?: string; stderr?: string; status?: number; signal?: string };
    if (e.signal === "SIGTERM") {
      return "Error: command timed out after 30 seconds";
    }
    let output = e.stdout ?? "";
    if (e.stderr) output += `\n[stderr]\n${e.stderr}`;
    output += `\n[exit code: ${e.status ?? "unknown"}]`;
    return output.trim();
  }
}

const listDirectoryToolDef: ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'list_directory',
    description: 'List the files and folders inside a directory.',
    parameters: {
      type: 'object',
      properties: {
        dirPath: { type: 'string', description: 'Directory to list. Defaults to the working directory.' },
      },
      required: [],
    }
  }
};

export function listDirectoryTool({ "dirPath": dirPath }: { "dirPath": string }): string {
  const fullPath = safePath(dirPath ?? '.')
  const names = fs.readdirSync(fullPath).sort()
  if(names.length == 0) return "Empty Directory"

  console.log(names.map((name) => {
    const isDir = fs.statSync(path.join(fullPath, name)).isDirectory()
    return isDir ? `${name}/` : name
  }).join('\n'))
  return names.map((name) => {
    const isDir = fs.statSync(path.join(fullPath, name)).isDirectory()
    return isDir ? `${name}/` : name
  }).join('\n')
  
  // const RemImpFiles = names.filter((name) => !(name as string).startsWith('.') && !(name as string).startsWith('node_modules'))
  // console.log(RemImpFiles.join('\n'))
  // return RemImpFiles.join('\n')
}



