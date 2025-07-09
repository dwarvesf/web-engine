import { ClientLogo } from '../molecules';

interface Client {
  name: string;
  logo: string;
  href?: string;
}

interface ClientShowcaseProps {
  title?: string;
  clients: Client[];
  className?: string;
}

export default function ClientShowcase({
  title = 'Trusted by',
  clients,
  className = '',
}: ClientShowcaseProps) {
  return (
    <section className={`py-16 ${className}`}>
      <div className="mx-auto max-w-6xl px-4">
        {title && (
          <h2 className="text-foreground mb-12 text-center text-2xl font-bold md:text-3xl">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-2 items-center gap-8 md:grid-cols-4 lg:grid-cols-6">
          {clients.map((client, index) => (
            <ClientLogo
              key={index}
              name={client.name}
              logo={client.logo}
              href={client.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
