import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { cohorts, locations } from '../constants/select';
import { createHubspotContact, sendEmail } from '../services/emailer';
import { cn } from '../utils';
import { SuccessDialog } from './dialog';
import { Column, Paragraph } from './ui';
import Button from './ui/button';
import Input from './ui/input';
import Pell from './ui/pell';
import RadioInput from './ui/radio-input';
import Select from './ui/select';

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
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onChange',
  });

  const watchedFields = watch();

  const onSubmit = async (data: ContactFormData) => {
    try {
      await createHubspotContact({
        ...data,
        source: 'd.foundation/ideate-form',
      });
    } catch (err) {
      console.error(err);
    }
    try {
      await sendEmail(data);
      setShowSuccessDialog(true);
      reset();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleCloseDialog = () => {
    setShowSuccessDialog(false);
  };

  return (
    <div className={cn('h-full', className)}>
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">{title}</h2>
        <p className="text-foreground/70">{description}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              required
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
        <Column className="items-center xl:items-start">
          <Paragraph className="text-secondary-foreground mb-4 text-xl opacity-75 md:mb-6">
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
            disabled={!watchedFields.email}
            loading={isSubmitting}
            className="w-fit"
          >
            Submit
          </Button>
        </Column>
      </form>

      <SuccessDialog
        isOpen={showSuccessDialog}
        closeDialog={handleCloseDialog}
      />
    </div>
  );
};

export default IdeateForm;
