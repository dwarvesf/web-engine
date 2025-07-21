import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Select from '../ui/select';
import Button from '../ui/button';
import Radio from '../ui/radio';
import CheckboxInput from '../ui/checkbox-input';
import Pell from '../ui/pell';
import {
  budgetOptions,
  durationOptions,
  serviceOptions,
  staffOptions,
} from './contact-form-constants';
import { FileWithId } from '../ui/file-input';
import { Column } from '../ui';
import FormPrivacyNote from '../form-privacy-note';

const stepTwoSchema = z
  .object({
    service_type: z.string(),
    budget: z.string().optional(),
    staff: z.array(z.string()).optional(),
    duration: z.string().optional(),
    message: z.string().optional(),
    attachments: z
      .array(z.instanceof(File))
      .optional()
      .refine(files => {
        if (!files || files.length === 0) {
          return true; // No attachments, so no size limit violation
        }
        const totalSize = files.reduce((acc, file) => acc + file.size, 0);
        const fiveMB = 5 * 1024 * 1024; // 5 MB in bytes
        return totalSize <= fiveMB;
      }, 'Attachments total file size is too large, please keep it below 5MB'),
  })
  .refine(
    data => {
      if (data.service_type === serviceOptions[1]) {
        return data.staff && data.staff.length > 0;
      }
      return true;
    },
    {
      message: 'This field is required',
      path: ['staff'],
    },
  );

export type StepTwoFormData = z.infer<typeof stepTwoSchema>;

const defaultValues: StepTwoFormData = {
  service_type: serviceOptions[0] || '',
  budget: budgetOptions[0],
  staff: [],
  duration: durationOptions[0],
  message: '',
  attachments: [],
};

interface StepTwoFormProps {
  id: string;
  onSubmit: (values: StepTwoFormData) => Promise<void>;
  onBack: () => void;
  initialValues?: Partial<StepTwoFormData>;
}

export const StepTwoForm: React.FC<StepTwoFormProps> = ({
  id,
  onSubmit,
  onBack,
  initialValues = defaultValues,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StepTwoFormData>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: { ...defaultValues, ...initialValues },
  });

  const watchedServiceType = watch('service_type');
  const watchedStaff = watch('staff') || [];
  const watchedAttachments = watch('attachments') || [];

  const onSubmitInternal = async (values: StepTwoFormData) => {
    const { service_type, budget, staff, duration, ...rest } = values;

    setIsSubmitting(true);

    try {
      if (service_type === serviceOptions[0]) {
        await onSubmit({
          service_type,
          budget,
          ...rest,
        });
      } else {
        await onSubmit({
          service_type,
          staff,
          duration,
          ...rest,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceSelectOptions = serviceOptions.map(option => ({
    value: option,
    label: option,
  }));

  const handleStaffChange = (staff: string) => {
    const currentStaff = watchedStaff;
    if (currentStaff.includes(staff)) {
      setValue(
        'staff',
        currentStaff.filter(s => s !== staff),
      );
    } else {
      setValue('staff', [...currentStaff, staff]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitInternal)} id={id}>
      <div className="mb-4 md:mb-6">
        <Select
          label="Service"
          options={serviceSelectOptions}
          {...register('service_type')}
          error={errors.service_type?.message}
        />
      </div>

      {watchedServiceType === serviceOptions[0] && (
        <div className="mb-4 md:mb-6">
          <div className="mb-2">
            <label className="text-foreground text-md block font-normal">
              What is your budget?
            </label>
          </div>
          <div className="flex flex-row justify-between gap-4">
            {budgetOptions.map(budget => (
              <Radio
                key={budget}
                label={budget}
                value={budget}
                {...register('budget')}
                error={errors.budget?.message}
              />
            ))}
          </div>
        </div>
      )}

      {watchedServiceType === serviceOptions[1] && (
        <>
          <div className="mb-4 md:mb-6">
            <label className="text-foreground text-md mb-2 block font-normal">
              Who do you need?
              <span className="text-error ml-1">*</span>
            </label>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {staffOptions.map(staff => (
                <CheckboxInput
                  key={staff}
                  label={staff}
                  checked={watchedStaff.includes(staff)}
                  onChange={() => handleStaffChange(staff)}
                  error={errors.staff?.message}
                />
              ))}
            </div>
          </div>

          <div className="mb-4 md:mb-6">
            <div className="mb-2">
              <label className="text-foreground text-md block font-normal">
                How long will you need this team?
              </label>
            </div>
            <div className="flex flex-row justify-between gap-4">
              {durationOptions.map(duration => (
                <Radio
                  key={duration}
                  label={duration}
                  value={duration}
                  {...register('duration')}
                  error={errors.duration?.message}
                />
              ))}
            </div>
          </div>
        </>
      )}

      <div className="mb-4 md:mb-6">
        <Controller
          name="message"
          control={control}
          render={({ field }) => (
            <Pell
              {...field}
              label="Describe your project"
              helperText="What the project is about, how the team currently is, what the tech stack is, etc."
              withAttachments
              attachmentProps={{
                value: watchedAttachments as FileWithId[],
                error: errors.attachments?.message,
                onChange: files =>
                  setValue('attachments', files, { shouldValidate: true }),
                multiple: true,
              }}
              className="min-h-[200px]"
            />
          )}
        />
      </div>

      <Column className="items-center xl:items-start">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={onBack}
          >
            Back
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            Submit
          </Button>
        </div>

        <FormPrivacyNote />
      </Column>
    </form>
  );
};
