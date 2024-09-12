import { Express, Request, Response, NextFunction } from "express";
import { User, Thread, Chat } from "../entity";
import { AppDataSource } from "../data-source";
import { chat } from "../vertexai/chat";


const userRepository = AppDataSource.getRepository(User);
const threadRepository = AppDataSource.getRepository(Thread);
const chatRepository = AppDataSource.getRepository(Chat);


export const createChat = async (req: Request, res: Response, nxt: NextFunction) => {
    const { userId, threadId, text } = req.body;
    const user = await userRepository.findOne({where: {id: userId}});
    if (!user) {
        throw Error("User not found");
    }
    let thread = await threadRepository.findOne({where: {id: threadId}});
    if (!thread) {
        thread = threadRepository.create({title: "New Chat", user });
        thread = await threadRepository.save(thread);
    }
    const chat_history = []
    if (thread.chats) {
        for (const chat of thread.chats) {
            const part = {role: chat.role, parts: [{text: chat.text}]}
            chat_history.push(part);
        } 
    }
    chat_history.push({role: 'user', parts: [{text}]});
    const githubToken = user.githubToken;
    const githubOwner = user.githubUserName;
    chat.setGithubToken(githubToken);
    chat.setGithubOwner(githubOwner);
    const response = await chat.generate_content(chat_history);
    if (!response) {
        throw Error("Error generating response. Try again");
    }
    const userChat = chatRepository.create({thread, user, role: 'user', text});
    const savedUserChat = await chatRepository.save(userChat);
    const modelRes = chatRepository.create({thread, user, role: 'model', text: response});
    const savedModelRes = await chatRepository.save(modelRes)
    res.status(201).send({chat: savedUserChat, res: savedModelRes});
}

export const getChat = async (req: Request, res: Response, nxt: NextFunction) => {
    const { chatId, userId } = req.body;
    const user = await userRepository.findOne({ where: {id: userId}});
    if (!user) {
        throw Error("User not found");
    }
    const chat = await chatRepository.findOne({ where: {id: chatId, user }})
    if (!chat) {
        throw Error("Chat not found");
    }
    res.status(200).send(chat);
}

export const getAllChats = async (req: Request, res: Response, nxt: NextFunction) => {
    const { userId } = req.body;
    const user = await userRepository.findOne({ where: {id: userId}});
    if (!user) {
        throw Error("User not found");
    }
    const chats = await chatRepository.find({ where: {user}});
    if (!chats) {
        throw Error("No threads found");
    }
    res.status(200).send(chats);
}

export const editChat = async (req: Request, res: Response, nxt: NextFunction) => {
    const { userId, chatId, threadId, text } = req.body;
    const user = await userRepository.findOne({ where: {id: userId}})
    if (!user) {
        throw Error("User not found");
    }
    const thread = await threadRepository.findOne({where: {id: threadId}});
    const chatToUpdate = await chatRepository.findOne({where: {id: chatId}});
    if (!chatToUpdate || !thread) {
        throw Error("Resource not found. Check ids");
    }
    if (chatToUpdate.role === "model") {
        throw Error("Cannot update model response");
    }
    const chat_history = []
    var chatIndex = 0
    if (thread.chats) {
        for (const chat of thread.chats) {
            if (chat.id !== chatToUpdate.id) {
                const part = {role: chat.role, parts: [{text: chat.text}]}
                chat_history.push(part);
                chatIndex += 1
            } 
            else {
                break;
            }
        } 
    }
    chat_history.push({role: 'user', parts: [{text}]});
    const githubToken = user.githubToken;
    const githubOwner = user.githubUserName;
    chat.setGithubToken(githubToken);
    chat.setGithubOwner(githubOwner);
    const response = await chat.generate_content(chat_history);
    await chatRepository.update(chatId, {text});
    await chatRepository.update(thread.chats[chatIndex + 1].id, {text: response});
    const updateChat = await chatRepository.findOne({where: {id: chatId, user}});
    const updatedModelRes = await chatRepository.findOne({where: {id: thread.chats[chatIndex+1].id}})
    res.status(200).send({chat: updateChat, res: updatedModelRes});
}

export const deleteChat = async (req: Request, res: Response, nxt: NextFunction) => {
    const { userId, chatId, threadId } = req.body;
    const user = await userRepository.findOne({ where: {id: userId}})
    if (!user) {
        throw Error("User not found");
    }
    const thread = await threadRepository.findOne({where: {id: threadId}});
    if (!thread) {
        throw Error("Thread not found");
    }
    const chatToDelete = await chatRepository.findOne({where: {id: chatId}});
    if (!chatToDelete || chatToDelete.thread !== thread) {
        throw Error("Cannot delete chat. Check chat and thread ids");
    }
    var modelResIndex = 0
    for (const chat of thread.chats) {
        if (chat.id !== chatId) {
            modelResIndex += 1
        } 
        else {
            modelResIndex += 1
            break
        }
    }
    modelResIndex = thread.chats[modelResIndex].id;
    await chatRepository.delete(chatId);
    await chatRepository.delete(modelResIndex);
    res.status(200).send("Chat deleted");
}