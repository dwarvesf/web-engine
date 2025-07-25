import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { structureOptions } from '../constants/select';
import { createHubspotContact, sendEmail } from '../services/emailer';
import { cn } from '../utils';
import { SuccessDialog } from './dialog';
import { Column } from './ui';
import Button from './ui/button';
import { FileWithId } from './ui/file-input';
import Input from './ui/input';
import Pell from './ui/pell';
import Select from './ui/select';
import FormPrivacyNote from './form-privacy-note';
import { plausible } from '../services/analytics/plausible';

const teamStructureOptions = structureOptions.map(opt => ({
  value: opt,
  label: opt,
}));

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional().optional(),
  website: z.string().optional().optional(),
  stack: z.string().optional().optional(),
  team: z.string().optional().optional(),
  message: z.string().optional().optional(),
  attachments: z
    .array(z.any()) // Use z.any() because z.file() might not have the necessary File properties for size calculation directly in Zod's type inference
    .optional()
    .refine(files => {
      if (!files || files.length === 0) {
        return true; // No attachments, so no size limit violation
      }
      const totalSize = files.reduce((acc, file) => acc + file.size, 0);
      const fiveMB = 5 * 1024 * 1024; // 5 MB in bytes
      return totalSize <= fiveMB;
    }, 'Attachments total file size is too large, please keep it below 5MB'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  className?: string;
  title?: string;
  description?: string;
}

const ScaleTeamContact: React.FC<ContactFormProps> = ({
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
    reset,
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onChange',
  });

  const watchedFields = watch();

  const onSubmit = async (data: ContactFormData) => {
    try {
      await createHubspotContact({
        ...data,
        source: 'd.foundation/startup/scale',
      });
    } catch (err) {
      console.error(err);
    }
    try {
      await sendEmail(data);
      setShowSuccessDialog(true);
      console.log('Form submitted:', data);
      reset();
    } catch (error) {
      console.error('Form submission error:', error);
    }

    plausible.trackFormSubmission('Scale Form', {
      props: data,
    });
  };

  const handleCloseDialog = () => {
    setShowSuccessDialog(false);
  };

  return (
    <div id="contact" className={cn('h-full', className)}>
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">{title}</h2>
        <p className="text-foreground/70">{description}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Input
              label="What is your name?"
              {...register('name')}
              error={errors.name?.message}
            />
          </div>
          <div>
            <Input
              label="What is your email address?"
              {...register('email')}
              error={errors.email?.message}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Input
              label="Organization"
              {...register('company')}
              error={errors.company?.message}
            />
          </div>
          <div>
            <Input
              label="Website"
              {...register('website')}
              error={errors.website?.message}
            />
          </div>
        </div>
        <div>
          <Select
            label="What is your team structure?"
            options={teamStructureOptions}
            error={errors.team?.message}
            {...register('team')}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="message"
            className="text-foreground text-md block font-normal"
          >
            Let us know your need
          </label>
          <Pell
            {...register('message')}
            error={errors.message?.message}
            id="message"
            onChange={value => {
              setValue('message', value, { shouldValidate: true });
            }}
            withAttachments
            attachmentProps={{
              ...register('attachments'),
              error: errors.attachments?.message,
              value: (watchedFields.attachments || []) as FileWithId[],
              onChange: files => {
                setValue('attachments', files, { shouldValidate: true });
              },
            }}
          />
        </div>
        <Column className="items-center xl:items-start">
          <FormPrivacyNote />
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

export default ScaleTeamContact;
