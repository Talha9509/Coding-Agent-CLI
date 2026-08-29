import { z } from 'zod'
import fs from 'fs'
import { tool } from 'ai'
import path from 'path'

// Tool 1: Read a file
export const readFile = tool({
  description: 'Read the contents of a local file',
  parameters: z.object({
    filePath: z.string().optional().describe('The path to the file to read'),
    filename: z.string().optional().describe('Alternative parameter: The name or path of the file to read'),
    path: z.string().optional().describe('Alternative parameter: The path to the file to read'),
  }),
  execute: async ({ filePath, filename, path: fileP }: any): Promise<string> => {
    try {
      const resolvedPath = filePath || filename || fileP;
      if (!resolvedPath) {
        return "Error: No file path or filename provided.";
      }
      const fileWithPath = path.resolve(process.cwd(), resolvedPath);
      console.log(`Agent is reading file: ${fileWithPath}`);
      if (!fs.existsSync(fileWithPath)) {
        return `Error: File does not exist at ${fileWithPath}`;
      }
      return fs.readFileSync(fileWithPath, 'utf-8');
    } catch (error: any) {
      return `Error reading file: ${error.message}`;
    }
  },
})

// Tool 2: Write a file
export const writeFile = tool({
  description: 'Write content to a local file',
  parameters: z.object({
    filePath: z.string().optional().describe('The path to save the file'),
    filename: z.string().optional().describe('Alternative parameter: The name or path of the file to save'),
    path: z.string().optional().describe('Alternative parameter: The path to the file to save'),
    content: z.string().describe('The code or text to write'),
  }),
  execute: async ({ filePath, filename, path: fileP, content }: any): Promise<string> => {
    try {
      const resolvedPath = filePath || filename || fileP;
      if (!resolvedPath) {
        return "Failed to write file: No file path or filename was provided.";
      }
      const fileWithPath = path.resolve(process.cwd(), resolvedPath);
      console.log(`Agent is writing file: ${fileWithPath}`);
      
      const dirPath = path.dirname(fileWithPath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      
      fs.writeFileSync(fileWithPath, content, 'utf-8');
      return "File written successfully.";      
    } catch (error: any) {
      console.log(error.message)
      return "Failed to write file: " + error.message
    }
  },
})

// Tool 3: Edit a file
export const editFile = tool({
  description: 'Edit content of a local file (use it when you need to both read and write to the same file)',
  parameters: z.object({
        filePath: z.string().optional().describe('The path to the file to read'),
    filename: z.string().optional().describe('Alternative parameter: The name or path of the file to read'),
    path: z.string().optional().describe('Alternative parameter: The path to the file to read'),
    // filePath: z.string().describe('The path to the file to edit'),
    replaceData: z.string().describe('The EXACT existing code or text to be replaced.'),
    newData: z.string().describe('The new code or text to write in its place.'),
  }),
  execute: async ({ filePath, filename, fileP, replaceData, newData }: any): Promise<string> => {
    try {
      const resolvedPath = filePath || filename || fileP;
      if (!resolvedPath) {
        return "Failed to edit file: No file path or filename was provided.";
      }
      const fileWithPath = path.resolve(process.cwd(), filePath);
      console.log(`Agent is editing file: ${fileWithPath}`);

      if (!fs.existsSync(fileWithPath)) {
        return `Error: File does not exist at ${fileWithPath}`;
      }
      const oldData = fs.readFileSync(fileWithPath, 'utf-8');
      console.log(oldData)
      console.log(replaceData)
      console.log(newData)
      const modifiedData = oldData.replace(replaceData, newData);
      console.log(modifiedData)
      
      fs.writeFileSync(fileWithPath, modifiedData, 'utf-8');
      return "File edited successfully.";      
    } catch (error: any) {
      console.log(error.message)
      return "Failed to edit file: " + error.message
    }
  },
})

