import { atom } from 'jotai';

export const tokenAtom = atom({
  value: '',
  oppositeAmount: '',
});

export const allowanceAtom = atom({
  token1: BigInt(0),
  token2: BigInt(0),
});