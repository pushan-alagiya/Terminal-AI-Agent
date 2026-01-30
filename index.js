import process from "process";
import readline from "readline";
import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { TavilySearch } from "@langchain/tavily";
import { ToolMessage } from "@langchain/core/messages";

// --------------------
// 1. Tool
// --------------------
const tavilyTool = new TavilySearch({
  apiKey: process.env.TAVILY_API_KEY,
  maxResults: 3,
  searchDepth: "basic",
});

// --------------------
// 2. Model
// --------------------
const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.1-8b-instant",
  temperature: 0,
});

const modelWithTools = model.bindTools([tavilyTool]);

// --------------------
// 3. Prompt
// --------------------
const prompt = ChatPromptTemplate.fromMessages([
  {
    role: "system",
    content:
      "You are a personal AI assistant. Use tools when you need real-time or unknown information.",
  },
  { role: "human", content: "{input}" },
]);

// --------------------
// 4. Function to handle tool calls
// --------------------
async function handleToolCalls(response) {
  let toolResult;
  let toolCall = response.tool_calls?.[0];

  while (toolCall) {
    const { name, args, id } = toolCall;

    if (name === "tavily_search") {
      toolResult = await tavilyTool.invoke(args);
    } else {
      throw new Error(`Unknown tool: ${name}`);
    }

    // Send tool result back to the model
    response = await model.invoke([
      {
        role: "system",
        content: "You are a helpful AI assistant.",
      },
      new ToolMessage({
        tool_call_id: id,
        content: JSON.stringify(toolResult),
      }),
    ]);

    // Check if there are more tool calls
    toolCall = response.tool_calls?.[0];
  }

  return response;
}

// --------------------
// 5. Main function to handle user input
// --------------------
async function processUserInput(userInput) {
  try {
    // First call to the model
    let response = await prompt.pipe(modelWithTools).invoke({
      input: userInput,
    });

    // Handle tool calls if any
    if (response.tool_calls && response.tool_calls.length > 0) {
      response = await handleToolCalls(response);
    }

    // Return the final response
    console.log("\n\033[1;32mAI Response:\033[0m", response.content); // Green text for AI response
    console.log("");
  } catch (error) {
    console.error("\n\x1b[1;31mError:\x1b[0m", error.message); // Red text for errors
  }
}

// --------------------
// 6. Enhanced Terminal-based user input (TUI)
// --------------------
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "\x1b[1;34mYou> \x1b[0m", // Blue text for user prompt
});

console.log("\x1b[1;36mWelcome to your AI Assistant!\x1b[0m");
console.log("\x1b[1;33mType your query below. Type 'exit' to quit.\x1b[0m\n");
rl.prompt();

rl.on("line", async (line) => {
  const userInput = line.trim();

  if (userInput.toLowerCase() === "exit") {
    rl.question(
      "\x1b[1;33mAre you sure you want to exit? (yes/no): \x1b[0m",
      (answer) => {
        if (answer.toLowerCase() === "yes") {
          console.log("\x1b[1;36mGoodbye! Have a great day!\x1b[0m");
          rl.close();
          process.exit(0);
        } else {
          rl.prompt();
        }
      }
    );
  } else {
    console.log("\x1b[1;34mProcessing your query...\x1b[0m"); // Blue text for processing message
    await processUserInput(userInput);
    rl.prompt();
  }
});

rl.on("close", () => {
  console.log("\x1b[1;36mSession ended. Goodbye!\x1b[0m");
  process.exit(0);
});
