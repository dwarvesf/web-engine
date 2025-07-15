import ContactImageGrid from './contact-image-grid';
import Section from './section';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '../utils';
import Button from './ui/button';
import Input from './ui/input';
import Select from './ui/select';
import RadioInput from './ui/radio-input';
import { H3, Paragraph } from './ui';
import Pell from './ui/pell';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  tel: z.string().optional(),
  location: z.string().min(1, 'Please select a budget range'),
  service: z.string().min(1, 'Please select one'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface ServiceContactProps {
  className?: string;
  title?: string;
  serviceName: string;
  bgImage: string;
  options: {
    label: string;
    value: string;
    'pre-fill-message'?: string;
  }[];
  showImageGrid?: boolean;
}

const ServiceContact: React.FC<ServiceContactProps> = ({
  className,
  title,
  serviceName,
  bgImage,
  options,
  showImageGrid = true,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
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
      console.log('Form submitted:', data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Section
      className={cn('flex flex-col gap-4 py-16', className)}
      id="service-contact-container"
    >
      <H3 className="!pb-12 text-center text-3xl font-semibold">{title}</H3>

      <div className="grid grid-cols-1 gap-12 xl:grid-cols-2">
        {showImageGrid && (
          <div className="hidden xl:block">
            <ContactImageGrid
              className="xl:pr-16"
              images={[{ src: bgImage, alt: serviceName }]}
            />
          </div>
        )}

        <div
          className={cn(
            showImageGrid ? 'xl:col-span-1' : 'mx-auto max-w-2xl xl:col-span-2',
          )}
        >
          <div className={cn('max-w-2xl', className)}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <Input
                      label="Your company or project name"
                      {...register('company')}
                      error={errors.company?.message}
                    />
                  </div>
                  <div>
                    <Input
                      label="What is your name?"
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
                    options={[
                      { value: 'us', label: 'US' },
                      { value: 'uk', label: 'UK' },
                      { value: 'europe', label: 'Europe' },
                      { value: 'asia', label: 'Asia' },
                      { value: 'other', label: 'Other' },
                    ]}
                    error={errors.location?.message}
                    {...register('location')}
                  />
                </div>
                <div>
                  <Select
                    label="What is your budget?"
                    placeholder="Select one"
                    options={options}
                    error={errors.service?.message}
                    {...register('service')}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-foreground text-md block font-normal"
                  >
                    Tell us about your project
                  </label>
                  <Pell
                    id="message"
                    onChange={value => {
                      setValue('message', value, { shouldValidate: true });
                    }}
                  />
                </div>

                <Paragraph className="text-secondary-foreground pb-6 text-xl">
                  By sending this form, you agree with our{' '}
                  <a
                    href="https://www.iubenda.com/privacy-policy/23856015"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="!text-secondary-foreground !no-underline"
                  >
                    Privacy Policy
                  </a>
                </Paragraph>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!watchedFields.email || !watchedFields.company}
                  loading={isSubmitting}
                >
                  Submit
                </Button>
              </>
            </form>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default ServiceContact;
