'use server';

import { config } from './config';
import { readContract } from '@wagmi/core';
import { dexAbi } from './abi/dex.abi';

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
};

export const getUserByAddress = async (
  address: string
): Promise<User | null> => {
  const user = (await getAllUsers()).find((user) => user.address === address);
  if (user) {
    return user;
  } else return null;
};

export const getAnalytics = async (): Promise<Analytics> => {
  const analytics = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics`);
  return analytics.json();
};

export const getAnalyticsByAddress = async (
  address: string
): Promise<Analytics> => {
  const analytics = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/analytics/${address}`
  );
  return analytics.json();
};

export const isAdmin = async (address: string): Promise<boolean> => {
  const admin = await readContract(config, {
    address: process.env.NEXT_PUBLIC_DEX_CONTRACT as `0x${string}`,
    abi: dexAbi,
    functionName: 'isAdmin',
    args: [address as `0x${string}`],
  });
  return admin as boolean;
};

export const updateUsername = async (
  id: number,
  newUsername: string,
  address: string
): Promise<User> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: newUsername, address }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update username');
  }

  return response.json();
};
