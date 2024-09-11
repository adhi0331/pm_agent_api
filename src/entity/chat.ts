import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import { Thread } from './thread';
import { User } from './user';

@Entity()
export class Chat {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Thread, (thread) => (thread.chats))
    thread: Thread;

    @ManyToOne(() => User, (user) => (user.chats))
    user: User;

    @Column()
    role: 'user' | 'model';

    // for now not going to store function responses
    @Column()
    text: string;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;

}