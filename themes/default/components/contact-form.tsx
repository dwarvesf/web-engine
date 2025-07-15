import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '../utils';
import Button from './ui/button';
import Input from './ui/input';
import Select from './ui/select';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  tel: z.string().optional(),
  location: z.string().min(1, 'Please select a budget range'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  className?: string;
  title?: string;
  description?: string;
  locations?: Array<{ value: string; label: string }>;
}

const ContactForm: React.FC<ContactFormProps> = ({
  className,
  title,
  description,
  locations = [
    { value: 'us', label: 'US' },
    { value: 'uk', label: 'UK' },
    { value: 'europe', label: 'Europe' },
    { value: 'asia', label: 'Asia' },
    { value: 'other', label: 'Other' },
  ],
}) => {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    trigger,
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onChange',
  });

  const watchedFields = watch();

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);
      console.log('Form submitted:', data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleReset = () => {
    reset();
    setStep(1);
    setIsSubmitted(false);
  };

  const nextStep = async () => {
    const isValid = await trigger(['name', 'email', 'company']);
    if (isValid) {
      setStep(2);
    }
  };

  if (isSubmitted) {
    return (
      <div className={cn('p-8 text-center', className)}>
        <div className="bg-success/10 mb-6 rounded-lg p-6">
          <div className="bg-success mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-semibold">
            Thank you for your message!
          </h3>
          <p className="text-foreground/70 mb-4">
            We've received your inquiry and will get back to you within 24
            hours.
          </p>
          <Button variant="outline" onClick={handleReset}>
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('max-w-2xl', className)}>
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">{title}</h2>
        <p className="text-foreground/70">{description}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 && (
          <>
            <div>
              <Input
                label="Full Name"
                {...register('name')}
                error={errors.name?.message}
              />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Input
                  label="Email"
                  {...register('email')}
                  error={errors.email?.message}
                />
              </div>
              <div>
                <Input
                  label="Phone number"
                  type="tel"
                  {...register('tel')}
                  error={errors.tel?.message}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Input
                  label="Company"
                  {...register('company')}
                  error={errors.company?.message}
                />
              </div>

              <div>
                <Select
                  label="Location"
                  placeholder="Select your location"
                  options={locations}
                  error={errors.location?.message}
                  {...register('location')}
                />
              </div>
            </div>
            <Button
              type="button"
              variant="primary"
              onClick={nextStep}
              disabled={!watchedFields.email || !watchedFields.company}
            >
              Next
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
