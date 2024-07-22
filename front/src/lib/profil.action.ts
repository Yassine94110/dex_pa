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

export interface Analytics {
    swapCount: string;
    totalSwapped: number;
    feesGenerated: number;
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

export const getAnalytics = async (): Promise<Analytics> => {
    const analytics = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics`);
    return analytics.json();
}

export const getAnalyticsByAddress = async (address: string): Promise<Analytics> => {
    const analytics = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/${address}`);
    return analytics.json();
}
    