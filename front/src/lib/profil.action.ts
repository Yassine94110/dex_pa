'use server';

import { get } from 'http';
import { config } from './config';
import { readContract } from '@wagmi/core';

export interface User {
    id: number;
    address: string;
    username: string;
    date_inscription: string;
    date_derniere_connexion: string;
}

export const getAllUsers = async (): Promise<User[]> => {
    const users = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`);
    return users.json();
}

export const getUserByAddress = async (address: string): Promise<User> => {
    const user = (await getAllUsers()).find((user) => user.address === address);
    if (user) {
        return user;
    }
    throw new Error('User not found');
}