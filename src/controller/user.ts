import { Express, Request, Response, NextFunction } from "express";
import { User } from "../entity";
import { AppDataSource } from "../data-source";


const userRepository = AppDataSource.getRepository(User);


export const createUser = async (req: Request, res: Response, nxt: NextFunction) => {
    const { name, email, githubUserName, githubToken } = req.body
    const user = userRepository.create({ name, email, githubUserName, githubToken })
    const savedUser = await userRepository.save(user);
    res.status(201).send(savedUser);
}

export const getUser = async (req: Request, res: Response, nxt: NextFunction) => {
    const { userId } = req.body;
    const user = await userRepository.findOne({ where: {id: userId}});
    if (!user) {
        throw Error("User not found");
    }
    res.status(200).send(user);
}

export const getAllUsers = async (req: Request, res: Response, nxt: NextFunction) => {
    const users = await userRepository.find();
    if (!users) {
        throw Error("User not found");
    }
    res.status(200).send(users);
}

export const editUser = async (req: Request, res: Response, nxt: NextFunction) => {
    const { userId, name, email, githubUserName, githubToken } = req.body;
    await userRepository.update(userId, {name, email, githubUserName, githubToken});
    const updateUser = await userRepository.findOne({where: {id: userId}});
    res.status(200).send(updateUser);
}

export const deleteUser = async (req: Request, res: Response, nxt: NextFunction) => {
    const { userId } = req.body;
    const success = await userRepository.delete(userId);
    res.status(200).send("User deleted");
}