import React from 'react'
import { Badge } from "@/components/ui/badge"
import { CardHeader, CardContent, Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const Staking = () => {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container grid items-center gap-4 px-4 md:px-6">
                <div className="space-y-3">
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Staking Pools</h2>
                    <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                        Explore and contribute to liquidity pools to earn rewards.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader>
                            <h3 className="text-xl font-semibold">Pool 1</h3>
                            <Badge variant="solid">Active</Badge>
                        </CardHeader>
                        <CardContent>
                            <p>Liquidity: 5,000 ETH</p>
                            <p>24h Volume: 500 ETH</p>
                            <p>24h APR: 0.5%</p>
                            <Button variant="outline">Stake</Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <h3 className="text-xl font-semibold">Pool 2</h3>
                            <Badge variant="solid">Active</Badge>
                        </CardHeader>
                        <CardContent>
                            <p>Liquidity: 3,000 ETH</p>
                            <p>24h Volume: 300 ETH</p>
                            <p>24h APR: 0.7%</p>
                            <Button variant="outline">Stake</Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <h3 className="text-xl font-semibold">Pool 3</h3>
                            <Badge variant="solid">Active</Badge>
                        </CardHeader>
                        <CardContent>
                            <p>Liquidity: 4,000 ETH</p>
                            <p>24h Volume: 400 ETH</p>
                            <p>24h APR: 0.6%</p>
                            <Button variant="outline">Stake</Button>
                        </CardContent>
                    </Card>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center mt-8">
                    <Link
                        className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                        href="/staking/add"
                    >
                        Create Pool
                    </Link>

                </div>
            </div>
        </section>
    )
}

export default Staking