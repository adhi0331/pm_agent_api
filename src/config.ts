import { configDotenv } from "dotenv";

configDotenv();

if (!process.env.PORT || !process.env.PROJECT_ID || !process.env.LOCATION || !process.env.GITHUB_TOKEN
    || !process.env.DB_HOST || !process.env.DB_NAME || !process.env.DB_PORT || !process.env.DB_USER || !process.env.DB_PASSWORD
) {
    throw Error("Env variables are not configured");
}

export const PORT = process.env.PORT;
export const PROJECT_ID = process.env.PROJECT_ID;
export const LOCATION = process.env.LOCATION;
export const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
export const DB_HOST = process.env.DB_HOST;
export const DB_NAME = process.env.DB_NAME;
export const DB_PORT = process.env.DB_PORT;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
