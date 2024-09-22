import { DataSource } from "typeorm";
import { DB_HOST, DB_PORT, DB_NAME, DB_PASSWORD, DB_USER } from "./config";
import { User, Chat, Thread } from "./entity";

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: DB_HOST,
    port: Number(DB_PORT),
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    synchronize: true,
    logging: false,
    entities: [User, Chat, Thread],
})