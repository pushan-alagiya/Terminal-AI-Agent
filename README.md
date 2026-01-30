# Terminal AI Agent

![Project Overview](https://github.com/pushan-alagiya/Terminal-AI-Agent/blob/main/Screenshots/sample.png?raw=true)

## Overview

**Terminal AI Agent** is a terminal-based conversational AI assistant built using the `LangChain` framework. It leverages the power of large language models (LLMs) to provide intelligent responses and perform real-time web searches using tools like `TavilySearch`. The assistant is designed to handle user queries interactively in the terminal, with support for tool calls and token limitations for optimized performance.

---

## Features & Architecture

![Project Overview](https://github.com/pushan-alagiya/Terminal-AI-Agent/blob/main/Screenshots/architecture.svg?raw=true)

- **Interactive Terminal Interface**: A user-friendly terminal-based interface for interacting with the AI assistant.
- **Tool Integration**: Supports tools like `TavilySearch` for real-time web searches.
- **Token Limitation**: Ensures efficient processing by limiting the number of input tokens.
- **Dynamic Tool Calls**: Handles tool calls iteratively until no further tools are required.
- **Customizable Prompts**: Allows you to define system and user prompts dynamically.
- **Error Handling**: Graceful handling of errors with user-friendly messages.

---

## Technologies Used

- **AI Model**: `llama-3.1-8b-instant` (via `ChatGroq`).
- **Framework**: [LangChain](https://github.com/hwchase17/langchain) for building the conversational agent.
- **Tool**: `TavilySearch` for real-time web search capabilities.
- **Platform**: Node.js runtime with `Bun` for execution.

---

## Prerequisites

Before running the project, ensure you have the following installed:

1. **Node.js**: Version 16 or higher.
2. **Bun**: A fast JavaScript runtime. Install it from [Bun](https://bun.sh/).
3. **Environment Variables**: Create a `.env` file in the root directory with the following keys:
   ```plaintext
   GROQ_API_KEY=<your_groq_api_key>
   TAVILY_API_KEY=<your_tavily_api_key>
   ```
