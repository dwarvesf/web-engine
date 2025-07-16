import { cn } from '../utils';
import Section, { SectionProps } from './section';
import Button from './ui/button';

const Contact: React.FC<SectionProps> = p => {
  return (
    <Section fullWidth {...p} className={cn('bg-alabaster py-20', p.className)}>
      <div className="dwarves-container space-y-[1.5rem] text-center">
        <h2 className="dwarves-heading text-3xl font-semibold">
          We'd love to work with you.
        </h2>
        <p className="text-foreground text-xl">
          Drop us a message if you need any helps from the Dwarves
        </p>
        <Button variant="primary" href="/contact">
          Let's build with us
        </Button>
      </div>
    </Section>
  );
};

export default Contact;
