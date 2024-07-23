'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { isAdmin } from '@/lib/dex.action';
import { useAccount } from 'wagmi';
import {
  Analytics,
  getAllUsers,
  getAnalytics,
  User,
} from '@/lib/profil.action';
import { createToken } from '@/lib/token.action';
import Link from 'next/link';
import ShinyButton from './ui/shiny-button';
import { toast } from 'sonner';

export const AdminCard = () => {
  const [userIsAdmin, setUserIsAdmin] = useState<boolean>(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allAnalytics, setAllAnalytics] = useState<Analytics | null>(null);
  const [tokenAddress, setTokenAddress] = useState<string>('');

  const account = useAccount();

  useEffect(() => {
    if (account.status === 'connected') {
      isAdmin(account.address).then((admin) => {
        setUserIsAdmin(admin);
      });
    }
  }, [account, account.address]);

  useEffect(() => {
    if (userIsAdmin) {
      getAllUsers()
        .then((users) => {
          setAllUsers(users);
        })
        .catch((error) => {
          console.error('Failed to fetch users:', error);
          setAllUsers([]);
        });

      getAnalytics()
        .then((analytics) => {
          setAllAnalytics(analytics);
        })
        .catch((error) => {
          console.error('Failed to fetch analytics:', error);
          setAllAnalytics(null);
        });
    }
  }, [userIsAdmin]);

  const handleAddToken = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newToken = await createToken(tokenAddress as `0x${string}`);
      toast.success('Token added successfully', newToken);
    } catch (error) {
      toast.error('Failed to add token');
    }
  };

  return (
    <div>
      {userIsAdmin && (
        <div className='bg-background rounded-lg shadow-md p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-2xl font-bold'>Admin Dashboard</h2>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <Card className='bg-muted p-4 text-center'>
              <CardHeader>
                <CardTitle>Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-4xl font-bold'>{allUsers.length}</p>
              </CardContent>
            </Card>
            <Card className='bg-muted p-4 text-center'>
              <CardHeader>
                <CardTitle>Swaps</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-4xl font-bold'>{allAnalytics?.swapCount}</p>
              </CardContent>
            </Card>
            <Card className='bg-muted p-4 text-center'>
              <CardHeader>
                <CardTitle>Volume of token traded</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-4xl font-bold'>
                  {allAnalytics?.totalSwapped}
                </p>
              </CardContent>
            </Card>
            <Card className='bg-muted p-4 text-center'>
              <CardHeader>
                <CardTitle>Total fees generated</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-4xl font-bold'>
                  {allAnalytics?.feesGenerated}
                </p>
              </CardContent>
            </Card>
          </div>
          <Separator className='my-6' />
          <div>
            <h3 className='text-xl font-bold mb-4'>All Users</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>date_inscription</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.address}</TableCell>
                    <TableCell>{user.date_inscription}</TableCell>
                    <TableCell>
                      <Button className='mr-2'>Ban</Button>
                      <Button>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Separator className='my-6' />
          <div>
            <h3 className='text-xl font-bold mb-4'>Add Token</h3>
            <form className='grid gap-4' onSubmit={handleAddToken}>
              <div>
                <Label htmlFor='tokenAddress'>Token Address</Label>
                <Input
                  id='tokenAddress'
                  type='text'
                  placeholder='Enter token address'
                  value={tokenAddress}
                  onChange={(e) => setTokenAddress(e.target.value)}
                />
              </div>
              <Button type='submit' className='w-full'>
                Add Token
              </Button>
            </form>
          </div>
          <Separator className='my-6' />
          <Link href='/create'>
            <ShinyButton text='Create Pool' />
          </Link>
        </div>
      )}
    </div>
  );
};
