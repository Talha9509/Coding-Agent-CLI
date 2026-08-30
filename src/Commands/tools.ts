import fs from 'fs'
import path from 'path'
import { type ChatCompletionTool } from "openai/resources/chat/completions";

const readFileToolDef: ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'read_File',
    description: 'Read a text file and return its contents.',
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

export async function readfileTool({"filePath": filePath}: {"filePath": string}) {
  try {
    const fileWithPath = path.resolve(process.cwd(), filePath);
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

export const Tools = [readFileToolDef]
