'use client';
import ShinyButton from '@/components/ui/shiny-button';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { getAllUsers, getUserByAddress, User } from '@/lib/profil.action';

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

  useEffect(() => {
    if (isConnected) {
      getUserByAddress(address ?? '').then((user) => {
        setUser(user);
      });
    }
  }, [isConnected]);


    

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
              <p className="text-2xl font-bold">125</p>
              <p className="text-muted-foreground">Posts</p>
            </div>
            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-2xl font-bold">2.3K</p>
              <p className="text-muted-foreground">Followers</p>
            </div>
            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-2xl font-bold">512</p>
              <p className="text-muted-foreground">Following</p>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="grid gap-2">
            <div>
              <p className="text-muted-foreground">Address</p>
              <p>123 Main St, San Francisco, CA 94105</p>
            </div>
            <div>
              <p className="text-muted-foreground">Date Joined</p>
              <p>June 1, 2023</p>
            </div>
          </div>
        </div>
        <div className="bg-background rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-muted p-4 text-center">
              <CardHeader>
                <CardTitle>Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">12,345</p>
              </CardContent>
            </Card>
            <Card className="bg-muted p-4 text-center">
              <CardHeader>
                <CardTitle>Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">9,876</p>
              </CardContent>
            </Card>
            <Card className="bg-muted p-4 text-center">
              <CardHeader>
                <CardTitle>Tokens Issued</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">5,432</p>
              </CardContent>
            </Card>
          </div>
          <Separator className="my-6" />
          <div>
            <h3 className="text-xl font-bold mb-4">All Users</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tokens</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>@johndoe</TableCell>
                  <TableCell>johndoe@example.com</TableCell>
                  <TableCell>25</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>@janedoe</TableCell>
                  <TableCell>janedoe@example.com</TableCell>
                  <TableCell>15</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>@bobsmith</TableCell>
                  <TableCell>bobsmith@example.com</TableCell>
                  <TableCell>30</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
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
        </div>
      </div>
    </div>
  </div>
  );
};

export default page;
