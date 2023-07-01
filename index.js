import openai from "./open-ai.js";
import readlineSync from "readline-sync";
import chalk from "chalk";

async function main() {
  console.log(
    chalk.bold.green(
      "Welcome to the Chatbot Command Line, start chatting with the Bot!"
    )
  );

  const chatHistory = []; // Memory conversation history

  while (true) {
    const userInput = readlineSync.question(chalk.yellow("You: "));

    try {
      // Construct messages by iterating over the history
      const messages = chatHistory.map(([role, content]) => ({
        role,
        content,
      }));

      // Add latest user input
      messages.push({ role: "user", content: userInput });

      // Call the API with user input & history
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
      });

      // Get completion text/content
      const completionText = completion.data.choices[0].message.content;

      if (userInput.toLowerCase() === "exit") {
        console.log(chalk.green("Bot: ") + completionText);
        return;
      }

      console.log(chalk.green("Bot: ") + completionText);

      // Update history with user input and assistant response
      chatHistory.push(["user", userInput]);
      chatHistory.push(["assistant", completionText]);
    } catch (error) {
      console.error(chalk.red(error));
    }
  }
}

main();
