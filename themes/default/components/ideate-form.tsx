import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '../utils';
import Button from './ui/button';
import Input from './ui/input';
import Select from './ui/select';
import RadioInput from './ui/radio-input';
import { cohorts, locations } from '../constants/location';
import Pell from './ui/pell';

const cohortOptions = cohorts.map(option => ({
  value: option,
  label: option,
}));

const locationOptions = locations.map(location => ({
  value: location,
  label: location,
}));

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  tel: z.string().optional(),
  location: z.string().min(1, 'Please select a budget range'),
  service: z.string().min(1, 'Please select a service'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  className?: string;
  title?: string;
  description?: string;
}

const IdeateForm: React.FC<ContactFormProps> = ({
  className,
  title,
  description,
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
    setValue,
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
    <div
      className={cn('max-w-2xl min-w-md sm:min-w-md md:min-w-lg', className)}
    >
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">{title}</h2>
        <p className="text-foreground/70">{description}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 && (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Select
                  label="Service"
                  placeholder="Select service"
                  options={cohortOptions}
                  error={errors.service?.message}
                  {...register('service')}
                />
              </div>
              <div>
                <Input
                  label="Full Name"
                  {...register('name')}
                  error={errors.name?.message}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Input
                  label="What is your email address?"
                  {...register('email')}
                  error={errors.email?.message}
                />
              </div>
              <div>
                <Input
                  label="What is your phone number?"
                  type="tel"
                  {...register('tel')}
                  error={errors.tel?.message}
                />
              </div>
            </div>
            <div>
              <RadioInput
                label="Which location is closest to you?"
                options={locationOptions}
                error={errors.location?.message}
                {...register('location')}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="message"
                className="text-foreground text-md block font-normal"
              >
                Tell us about your ideas
              </label>
              <Pell
                id="message"
                onChange={value => {
                  setValue('message', value, { shouldValidate: true });
                }}
              />
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

export default IdeateForm;
