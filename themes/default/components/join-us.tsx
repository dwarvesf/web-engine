import { FiveContainer, Image, Section } from '.';

interface JoinUsProps {
  logo: string;
  heroBg: string;
  children: React.ReactNode;
}

export default function JoinUs({ logo, children, heroBg }: JoinUsProps) {
  return (
    <Section>
      <div
        className="mx-auto w-full bg-center bg-no-repeat py-40"
        style={{
          backgroundImage: `url('${heroBg}')`,
          backgroundPosition: 'center bottom -0.4rem',
          maxHeight: '648px',
        }}
      >
        <FiveContainer>
          <div className="flex flex-col items-center justify-center text-center text-xl font-medium">
            <Image src={logo} alt="Dwarves Foundation" className="mb-5" />
            {children}
          </div>
        </FiveContainer>
      </div>
    </Section>
  );
}
