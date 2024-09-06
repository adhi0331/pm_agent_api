import { FunctionDeclarationSchemaType } from "@google-cloud/vertexai";

const createGithubIssueDecleration = {
    name: 'create_github_issue',
    description: 'This method creates an issue on github with the specified title, body, labels. The owner is the username for the github account and the repo is the repository that we want to add an issue to. If an issue is an EPIC it should have the EPIC label and if it is a Task it should have the Task label. Note that the body should be in markdown format',
    parameters: {
        type: FunctionDeclarationSchemaType.OBJECT,
        properties: {
            owner: {type: FunctionDeclarationSchemaType.STRING},
            repo: {type: FunctionDeclarationSchemaType.STRING},
            title: {type: FunctionDeclarationSchemaType.STRING},
            body: {type: FunctionDeclarationSchemaType.STRING},
            labels: {type: FunctionDeclarationSchemaType.ARRAY}
        },
        required: ['owner', 'repo', 'title', 'body', 'labels']
    },
}

export const functionDecs = [{
    function_declarations: [createGithubIssueDecleration]
}]