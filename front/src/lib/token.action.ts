'use server';

export interface Token {
    id: number;
    address: string;
    name: string;
    ticker: string;
    supply: number;
    date: string;
}

export const getAllTokens = async () => {
    const tokens = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/token`);
    return tokens.json();
}
