import { atom } from 'jotai';
import { Token } from './token.action';

export const tokenAtom = atom<{
  value1: bigint;
  value2: bigint;
}>({
  value1: BigInt(0),
  value2: BigInt(0),
});

export const allowanceAtom = atom({
  token1: BigInt(0),
  token2: BigInt(0),
});

export const dialogOpenAtom = atom<{
  open1: boolean;
  open2: boolean;
}>({
  open1: false,
  open2: false,
});

export const activeTokenAtom = atom<{
  token1: Token | undefined;
  token2: Token | undefined;
}>({
  token1: undefined,
  token2: undefined,
});

export const balanceAtom = atom<{
  balance1: bigint | null;
  balance2: bigint | null;
}>({
  balance1: null,
  balance2: null,
});

export const sendAtom = atom<{
  amount: number;
  to: string;
}>({
  amount: 0,
  to: '',
});

export const swapAtom = atom<{
  amount1: number;
  amount2: number;
}>({
  amount1: 0,
  amount2: 0,
});

export const activePoolAddressAtom = atom<`0x${string}` | null>(null);
