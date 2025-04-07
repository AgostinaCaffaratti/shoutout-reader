import Image from 'next/image';
import { ExcelReaderWithCardsComponent } from '@/components/ui/Reader';

export default function Page() {
  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/shout-outs.png"
          alt="team shoutouts"
          width={400}
          height={400}
        />
        <ExcelReaderWithCardsComponent />
      </div>
    </div>
  );
}
