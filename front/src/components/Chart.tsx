'use client';

import { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Pool } from '@/lib/pool.action';

interface ChartProps {
  pool: Pool;
}

export function Chart({ pool }: ChartProps) {
  const { assetOneLock, assetTwoLock, assetOne, assetTwo } = pool;

  const chartData = [
    {
      token: assetOne.name,
      tvl: Number(assetOneLock / BigInt(10 ** 18)),
      fill: 'hsl(var(--chart-1))',
    },
    {
      token: assetTwo.name,
      tvl: Number(assetTwoLock / BigInt(10 ** 18)),
      fill: 'hsl(var(--chart-2))',
    },
  ];

  const chartConfig = {
    tvl: {
      label: 'TVL',
    },
    [assetOne.name]: {
      label: assetOne.symbol,
      color: 'hsl(var(--chart-1))',
    },
    [assetTwo.name]: {
      label: assetTwo.symbol,
      color: 'hsl(var(--chart-2))',
    },
  } satisfies ChartConfig;

  const totalVisitors = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + Number(curr.tvl), 0);
  }, []);

  return (
    <Card className='flex flex-col bg-transparent border-0'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>
          {assetOne.symbol}/{assetTwo.symbol}
          {/* {assetOne.name}({assetOne.symbol}) - {assetTwo.name}({assetTwo.symbol}
          ) */}
        </CardTitle>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square min-h-[600px]'
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey='tvl'
              nameKey='token'
              innerRadius={180}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground'
                        >
                          TVL
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
