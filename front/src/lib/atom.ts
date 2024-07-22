import { atom } from 'jotai';
import { Token } from './token.action';

export const tokenAtom = atom({
  value: '',
  oppositeAmount: '',
});

export const allowanceAtom = atom({
  token1: BigInt(0),
  token2: BigInt(0),
});

export const activeTokenAtom = atom<Token | undefined>(undefined);

export const dialogOpenAtom = atom(false);

export const balanceAtom = atom<bigint | null>(null);

export const sendAtom = atom<{
  amount: number;
  to: string;
}>({
  amount: 0,
  to: '',
});
