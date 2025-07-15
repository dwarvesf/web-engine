import { cn } from '../utils';
import Button from './ui/button';

const Contact: React.FC<React.HTMLProps<HTMLElement>> = p => {
  return (
    <section {...p} className={cn('bg-alabaster py-20', p.className)}>
      <div className="dwarves-container text-center">
        <h2 className="dwarves-heading mb-3 text-3xl font-semibold">
          We'd love to work with you.
        </h2>
        <p className="text-foreground mb-6 text-xl">
          Drop us a message if you need any helps from the Dwarves
        </p>
        <Button variant="primary" href="/contact">
          Let's build with us
        </Button>
      </div>
    </section>
  );
};

export default Contact;
