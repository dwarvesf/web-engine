import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createHubspotContact, sendEmail } from '../services/emailer';
import { cn } from '../utils';
import { SuccessDialog } from './dialog';
import { Button, Input, RadioInput, Textarea } from './ui';
import FormPrivacyNote from './form-privacy-note';

// Zod schema for form validation
const csrContactFormSchema = z.object({
  name: z.string().optional(),
  email: z.email({ message: 'Please enter a valid email address' }),
  company: z.string().optional(),
  website: z
    .string()
    .url({ message: 'Please enter a valid website URL' })
    .optional()
    .or(z.literal('')),
  it_team_member: z.enum(['Yes', 'Not yet']).optional(),
  social_cause: z.string().optional(),
  problems: z.string().optional(),
  users: z.string().optional(),
});

export type CSRContactFormData = z.infer<typeof csrContactFormSchema>;

interface CSRContactFormProps {
  id?: string;
  submitText?: string;
  className?: string;
}

const defaultValues: CSRContactFormData = {
  name: '',
  email: '',
  company: '',
  website: '',
  it_team_member: 'Not yet',
  social_cause: '',
  problems: '',
  users: '',
};

const itTeamMemberOptions = [
  { value: 'Yes', label: 'Yes' },
  { value: 'Not yet', label: 'Not yet' },
];

const CSRContactForm: React.FC<CSRContactFormProps> = ({
  id = 'contact',
  submitText = 'Send message',
  className,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CSRContactFormData>({
    resolver: zodResolver(csrContactFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  const onSubmit = async (data: CSRContactFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Create HubSpot contact
      await createHubspotContact({
        ...data,
        source: 'd.foundation/csr',
      });

      // Send email
      await sendEmail(data, []);

      // Show success dialog
      setShowSuccessDialog(true);

      // Reset form
      reset();

      // Analytics tracking
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'gaEvent',
          eventCategory: 'CSR Contact Form',
          eventAction: 'Submit',
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Something went wrong on our end, please try again.';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
  };

  return (
    <>
      <SuccessDialog
        isOpen={showSuccessDialog}
        closeDialog={handleSuccessDialogClose}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        id={id}
        className={cn('-mx-8 flex-wrap lg:flex xl:-mx-16', className)}
      >
        <div className="w-full px-8 lg:w-1/2 xl:px-16">
          <span className="text-muted-foreground mb-8 hidden lg:block">
            Your basic info, to help us get in touch with you.
          </span>

          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="What is your name?"
              {...register('name')}
              error={errors.name?.message}
            />

            <Input
              label="What is your email address?"
              type="email"
              required
              {...register('email')}
              error={errors.email?.message}
            />
          </div>

          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="Organization"
              {...register('company')}
              error={errors.company?.message}
            />

            <Input
              label="Website"
              type="url"
              {...register('website')}
              error={errors.website?.message}
            />
          </div>

          <div className="mb-6">
            <RadioInput
              label="Do you currently have an IT team member?"
              options={itTeamMemberOptions}
              {...register('it_team_member')}
              error={errors.it_team_member?.message}
            />
          </div>
        </div>

        <div className="w-full px-8 lg:w-1/2 xl:px-16">
          <span className="text-muted-foreground mb-8 hidden lg:block">
            Tell us about the problem you're trying to solve.
          </span>

          <div className="space-y-6">
            <Textarea
              label="Describe your social causes"
              rows={1}
              maxHeight={200}
              {...register('social_cause')}
              error={errors.social_cause?.message}
            />

            <Textarea
              label="Describe the problems that need tech solutions"
              rows={1}
              maxHeight={200}
              {...register('problems')}
              error={errors.problems?.message}
            />

            <Input
              label="Describe the users of the tech products"
              {...register('users')}
              error={errors.users?.message}
            />
          </div>

          <div className="mt-8 space-y-4 text-center lg:text-right">
            <FormPrivacyNote />

            {submitError && (
              <div className="text-error bg-error/10 rounded-sm p-3 text-sm">
                {submitError}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              disabled={!isValid || isSubmitting}
              className="w-full lg:w-auto"
            >
              {submitText}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default CSRContactForm;
