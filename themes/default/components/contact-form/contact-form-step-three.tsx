import React, { useEffect, useRef } from 'react';
import Button from '../ui/button';
import { FiPhone } from 'react-icons/fi';

interface StepThreeFormProps {
  onReset: () => void;
}

export const StepThreeForm: React.FC<StepThreeFormProps> = ({ onReset }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to element on mount
  useEffect(() => {
    setTimeout(() => {
      if (containerRef.current) {
        const yOffset = 80;
        const y =
          containerRef.current.getBoundingClientRect().top +
          window.pageYOffset -
          yOffset;

        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 300);
  }, []);

  // Mock social links - replace with actual implementation
  const socials = [
    {
      label: 'LinkedIn',
      url: 'https://linkedin.com/company/dwarvesf',
      icon: '💼',
    },
    {
      label: 'Twitter',
      url: 'https://twitter.com/dwarvesf',
      icon: '🐦',
    },
    {
      label: 'GitHub',
      url: 'https://github.com/dwarvesf',
      icon: '💻',
    },
  ];

  return (
    <div
      ref={containerRef}
      className="bg-background relative flex h-full flex-col items-center justify-center gap-2 px-6 text-center"
      style={{ minHeight: 768 }}
    >
      <div className="bg-success/10 mb-6 rounded-full p-4">
        <FiPhone className="text-success h-12 w-12" />
      </div>

      <div className="mb-2 text-2xl font-semibold">Thank you!</div>

      <div className="text-muted-foreground mb-6 max-w-md">
        Your inquiry has been sent successfully. Our team is on the move.
      </div>

      <Button type="button" variant="primary" onClick={onReset}>
        Send another inquiry
      </Button>

      <div className="absolute bottom-0 left-0 mb-8 flex w-full flex-col items-center text-center">
        <div className="text-muted-foreground mb-4">Stay connected</div>
        <nav className="block flex-none">
          <ul className="flex items-center gap-4">
            {socials.map(social => (
              <li key={social.label}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="hover:text-primary text-muted-foreground flex transition-colors"
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};
