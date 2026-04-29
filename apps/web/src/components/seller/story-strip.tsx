import Image from 'next/image';

interface StoryItem {
  id: string;
  sellerName: string;
  mediaUrl: string;
}

const stories: StoryItem[] = [
  { id: '1', sellerName: 'Aunty Imtisunep', mediaUrl: '/next.svg' },
  { id: '2', sellerName: 'Ao Shawl House', mediaUrl: '/next.svg' },
  { id: '3', sellerName: 'Smoked Pork Co.', mediaUrl: '/next.svg' },
];

export default function StoryStrip() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {stories.map((story) => (
        <div key={story.id} className="flex min-w-[90px] flex-col items-center gap-2">
          <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-bazar-accent">
            <Image src={story.mediaUrl} alt={story.sellerName} fill className="object-cover" />
          </div>
          <span className="text-xs text-center text-bazar-text/70">{story.sellerName}</span>
        </div>
      ))}
    </div>
  );
}
