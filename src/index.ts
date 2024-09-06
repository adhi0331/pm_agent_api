import { Chat } from "./vertexai/chat";
import { configDotenv } from "dotenv";
import * as readline from 'readline';
import { systemPrompt } from "./vertexai/prompt";
import { functionDecs } from "./vertexai/function_declerations";

configDotenv();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function askQuestion(chat: Chat) {
    rl.question('User: ', async (input) => {
        if (input.toLowerCase() === 'close') {
            console.log('Bot: Goodbye!');
            rl.close();  // Close the readline interface to exit the program
        } else {
            // Here, you can implement any logic you want for responding
            const res = await chat.generate_content(input);
            console.log(`Bot: ${res}`);
            askQuestion(chat);  // Continue asking questions
        }
    });
}

if (process.env.GITHUB_TOKEN) {

    const chat = new Chat(systemPrompt, functionDecs, process.env.GITHUB_TOKEN)
    askQuestion(chat);
}



