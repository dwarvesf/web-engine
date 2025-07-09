import { Tag } from '../atoms';

interface WorkCardProps {
  title: string;
  description: string;
  image: string;
  category?: string;
  href?: string;
  tags?: string[];
  className?: string;
}

export default function WorkCard({
  title,
  description,
  image,
  category,
  href,
  tags = [],
  className = '',
}: WorkCardProps) {
  const CardComponent = href ? 'a' : 'div';

  return (
    <CardComponent
      href={href}
      className={`group bg-card border-border hover:border-border-hover hover:bg-card-hover dwarves-hover-lift overflow-hidden rounded-lg border transition-all duration-200 ${className}`}
    >
      <div className="aspect-video overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        {category && (
          <Tag variant="secondary" size="md" className="mb-3">
            {category}
          </Tag>
        )}
        <h3 className="text-foreground group-hover:text-primary mb-3 text-xl font-semibold transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          {description}
        </p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
          </div>
        )}
      </div>
    </CardComponent>
  );
}
