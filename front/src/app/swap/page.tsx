import { Send } from '@/components/Send';
import { Swap } from '@/components/Swap';
import { Tabs } from '@/components/ui/tabs';
import { getAllTokens } from '@/lib/token.action';

export default async function Home() {
  const tokens = await getAllTokens();

  const tabs = [
    // {
    //   title: 'Swap',
    //   value: 'swap',
    //   content: <Swap />,
    // },
    {
      title: 'Send',
      value: 'send',
      content: <Send tokens={tokens} />,
    },
  ];

  return (
    <div className='flex items-center flex-col justify-center w-full h-full -translate-y-20'>
      <div className='h-[20rem] md:h-[40rem] [perspective:1000px] relative flex flex-col min-w-96 max-w-5xl mx-auto items-start justify-start my-40'>
        <Tabs tabs={tabs} />
      </div>
    </div>
  );
}
