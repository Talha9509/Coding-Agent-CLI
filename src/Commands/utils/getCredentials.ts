import os from 'os'
import path from 'path'
import fs from 'fs'

const configPath = path.join(os.homedir(), '.codagent', '.codagent.json');

export const getCredentials = async () => {
  const fileData = fs.readFileSync(configPath, 'utf-8')
  console.log(fileData)
  const parsedFileData = JSON.parse(fileData)

  const provider = parsedFileData.activeProvider
  const model = parsedFileData.activeModel
  const apiKey = parsedFileData.apiKeys[provider]
  return { provider, model, apiKey }
}