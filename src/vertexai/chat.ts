import { VertexAI } from "@google-cloud/vertexai";
import { Octobot } from "../github/octobot";

export class Chat {

    private vertexAI;
    private model;
    private chatHistory: {
        role: string;
        parts: any[]
    }[];
    private functionDec;
    private octobot


    constructor(systemPrompt: string, functionDec: any[], githubToken: string) {
        this.vertexAI = new VertexAI({project: "gtp-cloud", location: 'us-west1'});
        this.model = this.vertexAI.getGenerativeModel({
            model: 'gemini-1.5-flash-001',
            systemInstruction: systemPrompt
        });
        this.chatHistory = []
        this.functionDec = functionDec
        this.octobot = new Octobot(githubToken);
    }

    async generate_content(question: string): Promise<String>{
        
        const questionContent = {role: 'user', parts: [{text: question}]}
        this.chatHistory.push(questionContent)

        var res = await this.model.generateContent({ contents: this.chatHistory, tools: this.functionDec});

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
                this.chatHistory.push({role: 'model', parts: [{functionCall: {name: functionCall.name, args: functionCall.args}}]})
                this.chatHistory.push({role: 'user', parts: functionResParts});
                res = await this.model.generateContent({ contents: this.chatHistory, tools: this.functionDec}); 
            }
        }

        if (!res.response.candidates || !res.response.candidates[0].content.parts[0].text) {
            return "No response, try again!";
        }

        this.chatHistory.push(res.response.candidates[0].content);

        return res.response.candidates[0].content.parts[0].text

    }

    async handleFunctionCall(name: string, args: Object): Promise<any> {
        if (name == "create_github_issue") {
            return await this.createGithubIssue(args);
        }
        return {error: "Cannot find function"};
    }

    async createGithubIssue(args: Object) {
        const {owner, repo, title, body, labels} = args as {owner: string, repo: string, title: string, body: string, labels: string[]}
        return await this.octobot.createIssue(owner, repo, title, body, labels)
    }

}