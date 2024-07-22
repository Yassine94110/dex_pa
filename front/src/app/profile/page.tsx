'use client';
import ShinyButton from '@/components/ui/shiny-button';
import Link from 'next/link';
import { useAccount, useReadContract } from 'wagmi';
import { dexAbi } from '@/lib/abi/dex.abi';
import { getAllUsers, getUserByAddress, getAnalytics, getAnalyticsByAddress, User, Analytics, isAdmin } from '@/lib/profil.action';

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from 'react';

const page = () => {
  const { address, isConnected } = useAccount();
  const [User, setUser] = useState<User | null>(null);
  const [Analytics, setAnalytics] = useState<Analytics | null>(null);
  const [AllUsers, setAllUsers] = useState<User[]>([]);
  const [AllAnalytics, setAllAnalytics] = useState<Analytics | null>(null);
  const [UserIsAdmin, setUserIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (isConnected) {
      getUserByAddress(address ?? '').then((user) => {
        setUser(user);
      });
      getAnalyticsByAddress(address ?? '').then((analytics) => {
        setAnalytics(analytics);
      });
      isAdmin(address ?? '').then((admin) => {
        setUserIsAdmin(admin);
      });
    }
  }, [isConnected]);

  

  if (UserIsAdmin) {
    getAllUsers().then((users) => {
      setAllUsers(users);
    });
    getAnalytics().then((analytics) => {
      setAllAnalytics(analytics);
    });
  }


    

  return (
    <div className='overflow-auto'>
    <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8">
      <h2 className="text-2xl font-bold">Profil</h2>
        <div className="bg-background rounded-lg shadow-md p-6">
          
          <div className="flex items-center mb-4">
            
            <div>
            <div className="flex items-center">
                <Input type="text" defaultValue={User?.username} className="text-xl font-bold mr-2" />
                <Button variant="outline" size="sm">
                  Update
                </Button>
              </div>
              <p className="text-muted-foreground">{User?.username}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-2xl font-bold">{Analytics?.swapCount}</p>
              <p className="text-muted-foreground">Swaps</p>
            </div>
            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-2xl font-bold">{Analytics?.totalSwapped}</p>
              <p className="text-muted-foreground">Volume of token traded</p>
            </div>
            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-2xl font-bold">{Analytics?.feesGenerated}</p>
              <p className="text-muted-foreground">Fees paid (Eth)</p>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="grid gap-2">
            <div>
              <p className="text-muted-foreground">Address</p>
              <p>{User?.address}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Date Joined</p>
              <p>{User?.date_inscription}</p>
            </div>
          </div>
        </div>
        <div className="bg-background rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-muted p-4 text-center">
              <CardHeader>
                <CardTitle>Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{AllUsers.length}</p>
              </CardContent>
            </Card>
            <Card className="bg-muted p-4 text-center">
              <CardHeader>
                <CardTitle>Swaps</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{AllAnalytics?.swapCount}</p>
              </CardContent>
            </Card>
            <Card className="bg-muted p-4 text-center">
              <CardHeader>
                <CardTitle>Volume of token traded</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{AllAnalytics?.totalSwapped}</p>
              </CardContent>
            </Card>
            <Card className="bg-muted p-4 text-center">
              <CardHeader>
                <CardTitle>Total fees generated</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{AllAnalytics?.feesGenerated}</p>
              </CardContent>
            </Card>
          </div>
          <Separator className="my-6" />
          <div>
            <h3 className="text-xl font-bold mb-4">All Users</h3>
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
                {AllUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.address}</TableCell>
                    <TableCell>{user.date_inscription}</TableCell>
                    <TableCell>
                      <Button className="mr-2">Ban</Button>
                      <Button>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Separator className="my-6" />
          <div>
            <h3 className="text-xl font-bold mb-4">Add Token</h3>
            <form className="grid gap-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" type="text" placeholder="Enter username" />
              </div>
              <div>
                <Label htmlFor="tokens">Tokens</Label>
                <Input id="tokens" type="number" placeholder="Enter tokens" />
              </div>
              <Button type="submit" className="w-full">
                Add Token
              </Button>
            </form>
          </div>
          <Separator className="my-6" />
          <Link href='/add'>
            <ShinyButton text='+ Create Pool' />
          </Link>
        </div>
      </div>
    </div>
  </div>
  );
};

export default page;
