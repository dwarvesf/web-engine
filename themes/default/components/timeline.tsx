import React from 'react';
import { FiveContainer, Section } from '.';

interface TimelineEvent {
  year?: number;
  event: string;
  highlighted: boolean;
}

interface EventProps {
  year?: number;
  event: string;
  highlighted: boolean;
}

const Event: React.FC<EventProps> = ({ year, event, highlighted }) => (
  <div className="relative h-[134px] w-[140px]">
    {highlighted && (
      <div className="absolute top-[-5px] left-[9px] w-[120px]">
        <h6 className="text-primary mb-1 text-xl">{year}</h6>
        <p className="text-foreground text-sm">{event}</p>
      </div>
    )}
    {highlighted && (
      <div className="bg-primary absolute top-0 left-[2px] h-[124px] w-px" />
    )}
    <div className="group absolute -bottom-1 left-[-5px] h-4 w-4 cursor-pointer">
      <div className="bg-primary absolute top-1/2 left-1/2 block h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 transform rounded-full" />
      {!highlighted && (
        <div className="text-muted bg-foreground before:bg-foreground invisible absolute left-1/2 z-[2] w-[170px] -translate-x-1/2 transform rounded-lg p-2 text-center text-sm opacity-0 transition-all duration-200 group-hover:visible group-hover:-translate-y-[calc(100%+10px)] group-hover:opacity-100 before:absolute before:bottom-[-4px] before:left-1/2 before:block before:h-2 before:w-2 before:-translate-x-1/2 before:rotate-45 before:transform">
          {event}
        </div>
      )}
    </div>
  </div>
);

function Timeline({ items }: { items: TimelineEvent[] }) {
  return (
    <Section fullWidth className="pt-20 pb-0" contentClassName="space-y-[40px]">
      <FiveContainer>
        <h2 className="mb-2 text-[26px] font-semibold">The Timeline</h2>
        <p className="text-muted-foreground text-xl">
          Leaving all the hardship of Day 1 aside, the Dwarves timeline is
          optimistic.
        </p>
      </FiveContainer>
      <div className="overflow-x-auto overflow-y-hidden px-[calc(50vw-535px)] py-16 max-[1100px]:px-5">
        <div className="flex" style={{ width: items.length * 140 }}>
          {items.map((item, index) => (
            <Event {...item} key={index} />
          ))}
        </div>
        <div
          className="mt-3 h-2 rounded-l-[4px]"
          style={{
            width: items.length * 140,
            background:
              'linear-gradient(90deg, #ff6b88 0%, #5a48a3 75%, #458fa6 90%, #249cc1 90%, transparent 100%)',
          }}
        />
      </div>
    </Section>
  );
}

export default Timeline;
