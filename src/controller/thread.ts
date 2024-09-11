import { Express, Request, Response, NextFunction } from "express";
import { User, Thread } from "../entity";
import { AppDataSource } from "../data-source";


const userRepository = AppDataSource.getRepository(User);
const threadRepository = AppDataSource.getRepository(Thread);


export const createThread = async (req: Request, res: Response, nxt: NextFunction) => {
    const { userId, title } = req.body;
    const user = await userRepository.findOne({ where: {id: userId }});
    if (!user) {
        throw Error("User not found");
    }
    const thread = threadRepository.create({ title, user });
    res.status(201).send(thread);
}

export const getThread = async (req: Request, res: Response, nxt: NextFunction) => {
    const { threadId, userId } = req.body;
    const user = await userRepository.findOne({ where: {id: userId}});
    if (!user) {
        throw Error("User not found");
    }
    const thread = await threadRepository.findOne({ where: {id: threadId, user }})
    if (!thread) {
        throw Error("Thread not found");
    }
    res.status(200).send(thread);
}

export const getAllThreads = async (req: Request, res: Response, nxt: NextFunction) => {
    const { userId } = req.body;
    const user = await userRepository.findOne({ where: {id: userId}});
    if (!user) {
        throw Error("User not found");
    }
    const threads = await threadRepository.find({ where: {user}});
    if (!threads) {
        throw Error("No threads found");
    }
    res.status(200).send(threads);
}

export const editThread = async (req: Request, res: Response, nxt: NextFunction) => {
    const { userId, threadId, title } = req.body;
    const user = await userRepository.findOne({ where: {id: userId}})
    if (!user) {
        throw Error("User not found");
    }
    await threadRepository.update(threadId, {title});
    const updateThread = await threadRepository.findOne({where: {id: threadId, user}});
    res.status(200).send(updateThread);
}

export const deleteThread = async (req: Request, res: Response, nxt: NextFunction) => {
    const { userId, threadId } = req.body;
    const user = await userRepository.findOne({ where: {id: userId}})
    if (!user) {
        throw Error("User not found");
    }
    const success = await threadRepository.delete(threadId);
    res.status(200).send("Thread deleted");
}

