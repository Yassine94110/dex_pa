import { Pool } from '@/lib/pool.action';
import { Button } from './ui/button';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { erc20Abi } from 'viem';
import { BaseError } from '@wagmi/core';
import { useAtom } from 'jotai';
import { tokenAtom } from '@/lib/atom';

interface BATProps {
  tokenAddress: string;
  symbol: string;
}

export const ButtonApproveToken = ({ tokenAddress, symbol }: BATProps) => {
  const [token] = useAtom(tokenAtom);
  const { data: hash, isPending, writeContract, error } = useWriteContract();
  const handleApproveToken = async () => {
    writeContract({
      address: tokenAddress as `0x${string}`,
      abi: erc20Abi,
      functionName: 'approve',
      args: [
        process.env.NEXT_PUBLIC_DEX_CONTRACT! as `0x${string}`,
        BigInt(token.value) * BigInt(10 ** 18),
      ],
    });
  };
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  return (
    <>
      <Button
        onClick={() => handleApproveToken()}
        disabled={isPending || isLoading}
      >
        {isPending
          ? 'Confirming...'
          : isLoading
          ? 'Transaction pending...'
          : `Approve ${symbol} token`}
      </Button>
      {error && (
        <div className='text-xs italic text-red-900 mt-4'>
          Error: {(error as BaseError).shortMessage || error.message}
        </div>
      )}
    </>
  );
};
