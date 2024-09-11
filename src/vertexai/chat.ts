import { VertexAI } from "@google-cloud/vertexai";
import { Octobot } from "../github/octobot";
import { functionDecs } from "./function_declerations";
import { systemPrompt } from "./prompt";

export class ChatBot {

    private vertexAI;
    private model;
    // private chatHistory: {
    //     role: string;
    //     parts: any[]
    // }[];
    private functionDec;
    private octobot: Octobot;
    private githubOwner: string;

    constructor(systemPrompt: string) {
        this.vertexAI = new VertexAI({project: "gtp-cloud", location: 'us-west1'});
        this.model = this.vertexAI.getGenerativeModel({
            model: 'gemini-1.5-flash-001',
            systemInstruction: systemPrompt
        });
        // this.chatHistory = []
        this.functionDec = functionDecs as any[]
    }

    setGithubToken(githubToken: string) {
        this.octobot = new Octobot(githubToken);
    }

    setGithubOwner(githubOwner: string) {
        this.githubOwner = githubOwner;
    }

    async generate_content(chatHistory: {role: string, parts: any[]}[]): Promise<string>{
        
        // const questionContent = {role: 'user', parts: [{text: question}]}
        // this.chatHistory.push(questionContent)

        var res = await this.model.generateContent({ contents: chatHistory, tools: this.functionDec});

        if (!res.response.candidates) {
            return "No response, try again!"
        }

        const parts = res.response.candidates[0].content.parts
        if (parts[0].functionCall) {
            for (const part of parts) {
                const functionCall = part.functionCall;
                if (!functionCall) {
                    continue;
                }
                const functionRes = await this.handleFunctionCall(functionCall.name, functionCall.args);
                const functionResParts = [
                    {
                        functionResponse: {
                            name: !functionRes.error ? functionCall.name : "function_not_implemented",
                            response: functionRes
                        }
                    }
                ]
                chatHistory.push({role: 'model', parts: [{functionCall: {name: functionCall.name, args: functionCall.args}}]})
                chatHistory.push({role: 'user', parts: functionResParts});
                res = await this.model.generateContent({ contents: chatHistory, tools: this.functionDec}); 
            }
        }

        if (!res.response.candidates || !res.response.candidates[0].content.parts[0].text) {
            return "No response, try again!";
        }

        chatHistory.push(res.response.candidates[0].content);

        return res.response.candidates[0].content.parts[0].text

    }

    async handleFunctionCall(name: string, args: Object): Promise<any> {
        if (name == "create_github_issue") {
            return await this.createGithubIssue(args);
        }
        return {error: "Cannot find function"};
    }

    async createGithubIssue(args: Object) {
        if (!this.octobot) {
            return {error: "Octobot was not initialized properly"}
        }
        const {repo, title, body, labels} = args as  { repo: string, title: string, body: string, labels: string[]}
        return await this.octobot.createIssue(this.githubOwner, repo, title, body, labels)
    }

}

export const chat = new ChatBot(systemPrompt);