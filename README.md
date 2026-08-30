# Coding Agent CLI

A powerful autonomous coding assistant that operates in a ReAct (Reason + Act) loop to help you with coding tasks. Integrated with OpenAI APIs, this CLI tool can read, write, edit files, and execute commands autonomously.

## Features

- **Autonomous Agent**: Runs coding tasks autonomously using ReAct (Reason + Act) pattern
- **Multi-Tool Support**: Access to file operations, command execution, and directory navigation
- **AI-Powered**: Leverages OpenAI / OpenRouter language models for intelligent coding assistance
- **Provider Management**: Easy login/logout and provider configuration
- **Model Selection**: Switch between different AI models seamlessly
- **CLI-Based**: Simple and intuitive command-line interface

## ReAct (Reason + Act) Loop

The agent follows a strict step-by-step execution pattern:

1. **Plan**: Analyzes the request and creates a detailed plan
2. **Action**: Executes the first step using an available tool
3. **Observation**: Receives feedback from tool execution
4. **Repeat**: Continues until task completion
5. **Output**: Provides the final result to the user

## Installation

### Clone the Repository & Install Dependencies

```bash
git clone <repository-url>
cd Coding-Agent-CLI && bun install
```

## Quick Start

### 1. Login to a Provider

```bash
codagent provider login
```

This will prompt you to:
- Select or enter your provider (OpenAI, OpenRouter, etc.)
- Enter your API key
- Choose your preferred model

### 2. Run the Agent

```bash
codagent agent -p "Your coding task here"
```

Example:
```bash
codagent agent -p "Create a TypeScript function that checks if a number is prime"
```

## Commands

### Agent Command

Runs the autonomous coding agent with a given prompt.

```bash
codagent agent [options]
```

**Options:**
- `-p, --prompt <prompt>` - The task/prompt for the agent to execute (required)

**Example:**
```bash
codagent agent -p "Create a new file called hello.ts that logs 'Hello World'"
```

### Models Command

List and manage available AI models.

```bash
codagent models [options]
```

**Options:**
- List available models from your provider
- Set default model for agent operations

### Provider Command

Manage authentication providers and credentials.

```bash
codagent provider [subcommand]
```

**Subcommands:**
- `login` - Authenticate with a provider
- `logout` - Remove stored credentials
- `list` - Show current provider configuration

## Configuration

### Credentials Storage

Credentials are securely stored locally after running `provider login`. The system supports:

- **OpenAI** - Direct API integration
- **OpenRouter** - Multi-model provider support
- **Custom Providers** - Compatible with any OpenAI-compatible API

## Project Structure

```
└── src/
    ├── index.ts                    # CLI entry point
    ├── Commands/
    │   ├── agent.ts               # Agent command implementation
    │   ├── models.ts              # Models management command
    │   ├── config.ts              # System prompt and configuration
    │   ├── tools.ts               # Tool definitions for AI
    │   ├── Providers/
    │   │   ├── index.ts           # Provider command routing
    │   │   ├── login.ts           # Login functionality
    │   │   └── logout.ts          # Logout functionality
    │   └── utils/
    │       ├── getCredentials.ts  # Retrieve stored credentials
    │       └── openAIclient.ts    # OpenAI client initialization
    └── index.ts                    # Main entry point
```

## Available Tools

The agent has access to these tools for task execution:

### 1. **read_File**
Reads and returns the contents of a file.
- **Parameters:** `filePath` (string)
- **Returns:** File content as string

### 2. **write_File**
Creates a new file or overwrites an existing one.
- **Parameters:** `filePath` (string), `content` (string)
- **Returns:** Success/error message

### 3. **edit_File**
Edits an existing file by finding exact text and replacing it.
- **Parameters:** `filePath` (string), `replaceContent` (string), `newContent` (string)
- **Returns:** Success/error message

### 4. **run_command**
Executes shell commands in the working directory.
- **Parameters:** `command` (string)
- **Returns:** stdout, stderr, and exit code

### 5. **list_directory**
Lists files and folders in a directory.
- **Parameters:** `dirPath` (string)
- **Returns:** Directory contents as formatted list

## Usage Examples

### Example 1: Create a New File

```bash
codagent agent -p "Create a TypeScript file called greet.ts that exports a function to greet users by name"
```

The agent will:
1. Plan the steps
2. Create the file with appropriate code
3. Verify the file was created successfully

### Example 2: Modify Existing Code

```bash
codagent agent -p "Add a new function to utils.ts that validates email addresses"
```

### Example 3: Complex Task

```bash
codagent agent -p "Create a Node.js script that reads a JSON file, processes the data, and outputs a summary to a new file"
```

The agent will use the tools autonomously to complete the task step-by-step.


