import { Swap } from '@/components/Swap';
import { Tabs } from '@/components/ui/tabs';

export default function Home() {
  const tabs = [
    {
      title: 'Swap',
      value: 'swap',
      content: <Swap />,
    },
    {
      title: 'Send',
      value: 'send',
      content: (
        <div>
          <p>Send</p>
        </div>
      ),
    },
  ];

  return (
    <div className='h-[20rem] md:h-[40rem] [perspective:1000px] relative flex flex-col min-w-96 max-w-5xl mx-auto items-start justify-start my-40'>
      <Tabs tabs={tabs} />
    </div>
  );
}
