import { ProfileCard } from '@/components/ProfileCard';
import { AdminCard } from '@/components/AdminCard';

const page = () => {
  return (
    <div className='h-[80vh] overflow-auto grid grid-cols-1 gap-8'>
      <ProfileCard />
      <AdminCard />
    </div>
  );
};

export default page;
