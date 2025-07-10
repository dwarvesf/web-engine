import { cn } from '../utils';
import { Button, Icon } from './ui';

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  href?: string;
  className?: string;
}

export default function ServiceCard({
  icon,
  title,
  description,
  href,
  className = '',
}: ServiceCardProps) {
  return (
    <div
      className={cn(
        'bg-card border-border hover:border-border-hover hover:bg-card-hover dwarves-hover-lift group rounded-lg border p-6 transition-all duration-200',
        className,
      )}
    >
      <div className="text-primary mb-4">
        <Icon name={icon} size="lg" />
      </div>
      <h3 className="text-foreground group-hover:text-primary mb-3 text-xl font-semibold transition-colors">
        {title}
      </h3>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        {description}
      </p>
      {href && (
        <Button variant="outline" size="sm" href={href}>
          Learn More
        </Button>
      )}
    </div>
  );
}
