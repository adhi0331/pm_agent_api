import { Express, Request, Response, NextFunction } from "express";
import { User } from "../entity";
import { AppDataSource } from "../data-source";
import { APIClient } from "../requests";
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "../config";


const userRepository = AppDataSource.getRepository(User);
const githubAPIClient = new APIClient("https://github.com");

export const createUser = async (req: Request, res: Response, nxt: NextFunction) => {
    const { name, email, githubUserName, githubToken } = req.body
    const user = userRepository.create({ name, email, githubUserName, githubToken })
    const savedUser = await userRepository.save(user);
    res.status(201).send(savedUser);
}

export const registerGithubToken = async (req: Request, res: Response, nxt: NextFunction) => {
    const { code, userId } = req.body
    const token = await githubAPIClient.post(`/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}`, {}, {'Accept': 'application/json'});
    console.log(token);
    await userRepository.update(userId, {githubToken: token.access_token});
    res.status(200).send("Token has been updated");
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