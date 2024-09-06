export class APIClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async request(method: string, endpoint: string, body?: any, headers?: any) {
        const url = `${this.baseUrl}${endpoint}`;

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: body ? JSON.stringify(body) : undefined
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        return response.json();
    }

    async get(endpoint: string, headers?: any) {
        return this.request('GET', endpoint, null, headers);
    }

    async post(endpoint: string, body: any, headers?: any) {
        return this.request('POST', endpoint, body, headers);
    }

    async put(endpoint: string, body: any, headers?: any) {
        return this.request('PUT', endpoint, body, headers);
    }

    async delete(endpoint: string, headers?: any) {
        return this.request('DELETE', endpoint, null, headers);
    }

    async patch(endpoint: string, body: any, headers?: any) {
        return this.request('PATCH', endpoint, body, headers);
    }
}