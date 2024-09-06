import { APIClient } from "../requests";

export class Octobot {

    private api;
    private token;

    constructor (token: string) {

        this.token = token
        this.api = new APIClient("https://api.github.com")
    }

    async createIssue(owner: string, repo: string, title: string, body: string, labels: string[]) {

        const header = {
            'Authorization': `Bearer ${this.token}`,
            'X-Github-Api-Version': "2022-11-28"
        }
        
        const processedBody = this.processUserBody(body);

        const res = await this.api.post(`/repos/${owner}/${repo}/issues`, {
            title,
            body: processedBody,
            labels,
        }, header)

        const issue = {
            id: res.id,
            url: res.url,
            htmlurl: res.html_url,
            title,
            body,
            labels
        }

        return issue;
    }

    private processUserBody(body: string): string {
        return body.replace(/\\n/g, "\n");
    }

}