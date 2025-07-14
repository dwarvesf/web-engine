import Button from '../../components/ui/button';
import { cn } from '../../utils';

const Contact: React.FC<React.HTMLProps<HTMLElement>> = p => {
  return (
    <section {...p} className={cn('bg-alabaster py-20', p.className)}>
      <div className="dwarves-container text-center">
        <h2 className="dwarves-heading mb-6 text-3xl font-bold">
          We'd love to work with you.
        </h2>
        <p className="text-foreground mb-8 text-lg">
          Drop us a message if you'd like to build with the Dwarves.
        </p>
        <Button variant="primary" href="/contact">
          Let's build
        </Button>
      </div>
    </section>
  );
};

export default Contact;
