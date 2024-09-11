import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Thread } from './thread';
import { Chat } from './chat';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    githubUserName: string;

    @Column()
    githubToken: string;

    @OneToMany(() => Thread, (thread) => thread.user)
    threads: Thread[];

    @OneToMany(() => Chat, (chat) => chat.user)
    chats: Chat[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}