import express from "express";
import { PORT, DB_HOST } from "./config";
import { AppDataSource } from "./data-source";
import router from "./routes";
import "reflect-metadata";

const app = express();

app.use(express.json());

AppDataSource.initialize()
    .then(() => {
        console.log(`DB has been initialized at port ${DB_HOST}`);
    })
    .catch((err) => {
        console.error('Error during DB initialization', err);
    })

app.use("/api", router);

app.listen(PORT, () => {
    console.log(`Server is running at PORT: ${PORT}`);
})

