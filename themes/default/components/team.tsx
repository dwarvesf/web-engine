import { useState } from 'react';
import { cn } from '../utils';
import Heading, { H4 } from './ui/heading';
import Image from './ui/image';
import Paragraph from './ui/paragraph';
import { Button, Center, Icon } from './ui';
import Section from './section';

interface TeamMember {
  full_name: string;
  role: string;
  avatar: string;
  username?: string;
  number_of_year?: number;
  hasMemo?: boolean;
  socials?: Array<{
    type: string;
    link: string;
  }>;
}

interface TeamData {
  [department: string]: {
    logo: string;
    members: TeamMember[];
  };
}

interface TeamProps {
  className?: string;
  title: string;
  description: string;
  team: TeamData;
}

const Team = ({ title, description, team }: TeamProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const departments = Object.keys(team);

  return (
    <>
      <Section className="dwarves-container">
        <Heading level={2} align="center" className="mb-5">
          {title}
        </Heading>
        <div className="mx-auto text-center text-lg">
          <Paragraph className="mb-3">{description}</Paragraph>
        </div>
      </Section>
      <Section className="dwarves-container">
        <div className="mb-10 flex w-full overflow-x-auto border-b border-solid border-gray-300">
          {departments.map((dept, index) => (
            <button
              key={dept}
              onClick={() => setActiveTab(index)}
              className={cn(
                'inline-flex flex-1 cursor-pointer items-center justify-center border-b-2 border-solid px-4 py-3 font-medium whitespace-nowrap focus:outline-none',
                activeTab === index
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600',
              )}
            >
              <svg width="28" height="28">
                <use href={team[dept]!.logo}></use>
              </svg>
              <span>{dept}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {team[departments[activeTab]!]?.members.map((user, index) => (
            <figure
              key={index}
              className="group relative overflow-hidden rounded transition-all duration-300 hover:shadow-lg"
            >
              <Image
                src={user.avatar}
                alt={user.full_name}
                className="static rounded object-cover"
                objectFit="cover"
                containerClassName="aspect-[2/3] w-full flex"
              />
              <figcaption className="absolute left-0 w-full rounded-b bg-white p-4 transition-transform duration-300 group-hover:-translate-y-full group-hover:transform">
                {user.socials && user.socials.length > 0 && (
                  <ul className="mb-2 text-sm leading-tight text-gray-500">
                    {user.socials.map(social => (
                      <li key={social.type} className="mr-2 inline-block">
                        <a
                          href={social.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex"
                        >
                          <Icon name={`${social.type}Solid`} size="sm" />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
                <strong className="block text-base font-medium">
                  {user.hasMemo ? (
                    <a
                      href={`https://memo.d.foundation/contributor/${user.username}`}
                      className="hover:text-primary"
                    >
                      {user.full_name}
                    </a>
                  ) : (
                    user.full_name
                  )}
                </strong>
                <span className="text-sm text-gray-600">{user.role}</span>
                {user.number_of_year && (
                  <div className="text-sm text-gray-600">
                    Year {user.number_of_year}
                  </div>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>
      <Section className="bg-alabaster">
        <Center className="max-w-none flex-col gap-4 py-8">
          <H4 className="text-center whitespace-pre-line">
            Have the same DNA and want to build world-class products?
          </H4>
          <Button
            href="https://dwarves.careers"
            variant="primary"
            className="mx-auto"
            target="_blank"
            rel="noopener noreferrer"
          >
            Join us
          </Button>
        </Center>
      </Section>
    </>
  );
};

export default Team;
