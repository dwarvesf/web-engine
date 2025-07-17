import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../ui/input';
import Select from '../ui/select';
import Button from '../ui/button';
import { locationOptions } from './contact-form-constants';
import { Column, Paragraph } from '../ui';

const stepOneSchema = z.object({
  name: z.string().optional(),
  email: z.email({ message: 'Please enter a valid email address' }),
  phone: z.string().optional(),
  company: z.string().min(1, 'Company name is required'),
  location: z.string().optional(),
});

export type StepOneFormData = z.infer<typeof stepOneSchema>;

const defaultValues: StepOneFormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  location: '',
};

interface StepOneFormProps {
  id: string;
  onSubmit: (values: StepOneFormData) => void;
  initialValues?: Partial<StepOneFormData>;
  showPolicyAgreement?: boolean;
}

export const StepOneForm: React.FC<StepOneFormProps> = ({
  id,
  onSubmit,
  initialValues = defaultValues,
  showPolicyAgreement,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StepOneFormData>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: { ...defaultValues, ...initialValues },
  });

  const onSubmitInternal = (values: StepOneFormData) => {
    onSubmit(values);
  };

  const locationSelectOptions = locationOptions.map(option => ({
    value: option,
    label: option,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmitInternal)} id={id}>
      <div className="mb-4 md:mb-6">
        <Input
          label="Full name"
          {...register('name')}
          error={errors.name?.message}
        />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-6 md:mb-6 md:grid-cols-2">
        <div>
          <Input
            label="Email"
            type="email"
            required
            {...register('email')}
            error={errors.email?.message}
          />
        </div>
        <div>
          <Input
            label="Phone number"
            type="tel"
            {...register('phone')}
            error={errors.phone?.message}
          />
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-6 md:mb-6 md:grid-cols-2">
        <div>
          <Input
            label="Company name"
            required
            {...register('company')}
            error={errors.company?.message}
          />
        </div>
        <div>
          <Select
            label="Location"
            placeholder="Select your location"
            options={locationSelectOptions}
            {...register('location')}
            error={errors.location?.message}
          />
        </div>
      </div>

      <Column className="items-center xl:items-start">
        {showPolicyAgreement && (
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
        )}

        <Button type="submit" variant="primary" disabled={isSubmitting}>
          Next
        </Button>
      </Column>
    </form>
  );
};
