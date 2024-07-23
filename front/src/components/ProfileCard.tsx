'use client';

import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Analytics,
  getAnalyticsByAddress,
  getUserByAddress,
  updateUsername,
  User,
} from '@/lib/profil.action';
import { Separator } from './ui/separator';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';

export const ProfileCard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [newUsername, setNewUsername] = useState<string>('');
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  const account = useAccount();

  useEffect(() => {
    if (account.status === 'connected') {
      getUserByAddress(account.address).then((user) => {
        console.log('user:', user);
        setUser(user);
      });

      getAnalyticsByAddress(account.address)
        .then((analytics) => {
          setAnalytics(analytics);
        })
        .catch((error) => {
          console.error('Failed to get analytics:', error);
          setAnalytics(null);
        });
    }
  }, [account.address, account]);

  const handleUpdateUsername = async () => {
    if (user && newUsername !== user.username) {
      try {
        const updatedUser = await updateUsername(
          user.id,
          newUsername,
          user.address
        );
        setUser(updatedUser);
        toast.success('Username updated');
      } catch (error) {
        console.error('Failed to update username:', error);
        toast.error('Failed to update username');
      }
    }
  };

  return (
    <div className='bg-background rounded-lg shadow-md p-6'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-2xl font-bold'>Profile</h2>
      </div>
      <div className='flex items-center mb-4'>
        <div>
          <div className='flex items-center'>
            <Input
              type='text'
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className='text-xl font-bold mr-2'
            />
            <Button variant='outline' size='sm' onClick={handleUpdateUsername}>
              Update
            </Button>
          </div>
          <p className='text-muted-foreground'>{user?.username}</p>
        </div>
      </div>
      <div className='grid grid-cols-3 gap-4'>
        <div className='bg-muted rounded-lg p-4 text-center'>
          <p className='text-2xl font-bold'>{analytics?.swapCount}</p>
          <p className='text-muted-foreground'>Swaps</p>
        </div>
        <div className='bg-muted rounded-lg p-4 text-center'>
          <p className='text-2xl font-bold'>{analytics?.totalSwapped}</p>
          <p className='text-muted-foreground'>Volume of token traded</p>
        </div>
        <div className='bg-muted rounded-lg p-4 text-center'>
          <p className='text-2xl font-bold'>{analytics?.feesGenerated}</p>
          <p className='text-muted-foreground'>Fees paid (Eth)</p>
        </div>
      </div>
      <Separator className='my-6' />
      <div className='grid gap-2'>
        <div>
          <p className='text-muted-foreground'>Address</p>
          <p>{user?.address}</p>
        </div>
        <div>
          <p className='text-muted-foreground'>Date Joined</p>
          <p>{user?.date_inscription}</p>
        </div>
      </div>
    </div>
  );
};
