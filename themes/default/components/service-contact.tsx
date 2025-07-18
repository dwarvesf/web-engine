import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { cn } from '../utils';
import ContactImageGrid from './contact-image-grid';
import { SuccessDialog } from './dialog';
import Section from './section';
import { Column, Container, H3, Paragraph } from './ui';
import Button from './ui/button';
import Input from './ui/input';
import Pell, { PellRef } from './ui/pell';
import RadioInput from './ui/radio-input';
import Select from './ui/select';
import { createHubspotContact, sendEmail } from '../services/emailer';

export interface TemplateInputField {
  type: string;
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  group?: string;
}

export interface TemplateSelectField {
  label: string;
  name: string;
  options: { label: string; description: string; default?: 'true' | 'false' }[];
  required?: boolean;
  placeholder?: string;
}

function transformBooleanValueFromString(
  value?: string | boolean,
): boolean | undefined {
  if (typeof value === 'boolean') {
    return value;
  }
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  return;
}

const getContactFormSchema = (
  inputFields: TemplateInputField[],
  selectFields: TemplateSelectField[],
) =>
  z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    email:
      inputFields.length > 0
        ? z.email('Please enter a valid email address').optional()
        : z.email('Please enter a valid email address'),
    company: z.string().optional(),
    tel: z.string().optional(),
    location: z.string().min(1, 'Please select a budget range').optional(),
    message: z
      .string()
      .min(10, 'Message must be at least 10 characters')
      .optional(),
    ...Object.fromEntries(
      inputFields.map(field => {
        const isRequired =
          transformBooleanValueFromString(field.required) ?? false;
        const fieldSchema =
          field.name === 'email'
            ? z.email('Please enter a valid email address')
            : z
                .string()
                .min(
                  1,
                  `${field.name.slice(0, 1).toUpperCase() + field.name.slice(1)} is required`,
                );
        return [field.name, isRequired ? fieldSchema : fieldSchema.optional()];
      }),
    ),
    ...Object.fromEntries(
      selectFields.map(field => {
        const isRequired =
          transformBooleanValueFromString(field.required) ?? false;
        const fieldSchema = z
          .string()
          .min(
            1,
            `${field.name.slice(0, 1).toUpperCase() + field.name.slice(1)} is required`,
          );
        return [field.name, isRequired ? fieldSchema : fieldSchema.optional()];
      }),
    ),
  });

function toOptions(field: TemplateSelectField) {
  return field.options.map(option => ({
    label: option.label,
    value: option.label,
    description: option.description,
  }));
}

interface ServiceContactProps {
  className?: string;
  title?: string;
  serviceName: string;
  bgImage?: string;
  showImageGrid?: boolean;
  onlyForm?: boolean;
  templateInputFields?: TemplateInputField[];
  templateSelectFields?: TemplateSelectField[];
  isShowSelectLocation?: boolean;
  additionalInfoFieldLabel?: string;
}

const ServiceContact: React.FC<ServiceContactProps> = ({
  className,
  title,
  serviceName,
  bgImage,
  showImageGrid = true,
  onlyForm,
  templateInputFields = [],
  templateSelectFields = [],
  isShowSelectLocation = true,
  additionalInfoFieldLabel,
}) => {
  const contactFormSchema = getContactFormSchema(
    templateInputFields,
    templateSelectFields,
  );

  const groupedInputFields = templateInputFields.reduce<
    Record<string, TemplateInputField[]>
  >((acc, field) => {
    if (field.group) {
      if (!acc[field.group]) {
        acc[field.group] = [];
      }
      acc[field.group]!.push(field);
    } else {
      if (!acc['default']) {
        acc['default'] = [];
      }
      acc['default']!.push(field);
    }
    return acc;
  }, {});

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const defaultValues = templateSelectFields.reduce(
    (acc, field) => {
      const fieldOpt = field.options.find(opt =>
        transformBooleanValueFromString(opt.default),
      );
      if (!fieldOpt) {
        return acc;
      }
      acc[field.name as keyof z.infer<typeof contactFormSchema>] =
        fieldOpt.label ?? '';
      if (fieldOpt?.description) {
        acc.message = fieldOpt.description ?? '';
      }
      return acc;
    },
    {} as Record<keyof z.infer<typeof contactFormSchema>, string>,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onChange',
    defaultValues,
  });

  const pellRef = useRef<PellRef>(null);

  const watchedFields = watch();

  useEffect(() => {
    if (defaultValues.message) {
      pellRef.current?.change(defaultValues.message);
    }
  }, []);

  const onSubmit = async (data: z.infer<typeof contactFormSchema>) => {
    try {
      await createHubspotContact({
        ...data,
        source: `d.foundation/${serviceName}-form`,
      });
    } catch (err) {
      console.error(err);
    }
    try {
      // Simulate API call
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
    <Section
      className={cn('mb-16 flex flex-col gap-4 py-16', className)}
      id="contact"
      contentClassName="!mx-0 xl:!mx-auto"
    >
      {title ? (
        <H3 className="!pb-12 text-3xl font-semibold">{title}</H3>
      ) : null}
      <Container className="max-w-none flex-1 flex-shrink-0">
        <div
          className={cn({
            'grid grid-cols-1 gap-12 xl:grid-cols-2': !onlyForm,
          })}
        >
          {showImageGrid && bgImage && !onlyForm && (
            <div className="hidden xl:block">
              <ContactImageGrid
                className="xl:pr-16"
                images={[{ src: bgImage, alt: serviceName }]}
              />
            </div>
          )}

          <div
            className={cn(
              showImageGrid || onlyForm
                ? 'max-w-2xl xl:col-span-1'
                : 'max-w-2xl xl:col-span-2',
            )}
          >
            <div className={cn('h-full', className)}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <>
                  {Object.keys(groupedInputFields).length > 0 ? (
                    Object.entries(groupedInputFields).map(
                      ([group, fields]) => {
                        if (fields.length === 0) {
                          return null;
                        }
                        if (fields.length === 2) {
                          return (
                            <div
                              className="grid grid-cols-1 gap-6 md:grid-cols-2"
                              key={[group, ...fields.map(f => f.name)].join(
                                '-',
                              )}
                            >
                              {fields.map(field => (
                                <div key={field.name}>
                                  <Input
                                    label={field.label}
                                    placeholder={field.placeholder}
                                    {...register(
                                      field.name as keyof z.infer<
                                        typeof contactFormSchema
                                      >,
                                    )}
                                    error={
                                      errors[
                                        field.name as keyof z.infer<
                                          typeof contactFormSchema
                                        >
                                      ]?.message
                                    }
                                    required={transformBooleanValueFromString(
                                      field.required,
                                    )}
                                  />
                                </div>
                              ))}
                            </div>
                          );
                        }

                        return (
                          <div
                            key={[group, ...fields.map(f => f.name)].join('-')}
                          >
                            {fields.map(field => (
                              <div key={field.name}>
                                <Input
                                  label={field.label}
                                  placeholder={field.placeholder}
                                  {...register(
                                    field.name as keyof z.infer<
                                      typeof contactFormSchema
                                    >,
                                  )}
                                  error={
                                    errors[
                                      field.name as keyof z.infer<
                                        typeof contactFormSchema
                                      >
                                    ]?.message
                                  }
                                  required={transformBooleanValueFromString(
                                    field.required,
                                  )}
                                />
                              </div>
                            ))}
                          </div>
                        );
                      },
                    )
                  ) : (
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
                    </>
                  )}
                  {isShowSelectLocation && (
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
                  )}
                  {templateSelectFields.map(field => (
                    <div>
                      <Select
                        label={field.label}
                        placeholder={field.placeholder ?? 'Select one'}
                        options={toOptions(field)}
                        error={
                          errors[
                            field.name as keyof z.infer<
                              typeof contactFormSchema
                            >
                          ]?.message
                        }
                        {...register(
                          field.name as keyof z.infer<typeof contactFormSchema>,
                        )}
                        onChange={e => {
                          const optsMsg = e.target.value;
                          const selectedOption = field.options.find(
                            option => option.label === optsMsg,
                          );
                          register(
                            field.name as keyof z.infer<
                              typeof contactFormSchema
                            >,
                          ).onChange(e);
                          if (selectedOption) {
                            const msg = selectedOption['description'] || '';
                            if (msg) {
                              setValue('message', msg || '', {
                                shouldValidate: true,
                              });
                              pellRef.current?.change(msg);
                            }
                          }
                        }}
                        required={field.required}
                      />
                    </div>
                  ))}
                  <div className="space-y-2">
                    <Pell
                      id="message"
                      label={
                        additionalInfoFieldLabel || 'Tell us about your project'
                      }
                      value={watchedFields.message || ''}
                      ref={pellRef}
                      onChange={value => {
                        setValue('message', value, { shouldValidate: true });
                      }}
                    />
                  </div>
                  <Column>
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
                      disabled={!watchedFields.email}
                      loading={isSubmitting}
                      className="w-fit"
                    >
                      Submit
                    </Button>
                  </Column>
                </>
              </form>
            </div>
          </div>
        </div>
      </Container>
      <SuccessDialog
        isOpen={showSuccessDialog}
        closeDialog={handleCloseDialog}
      />
    </Section>
  );
};

export default ServiceContact;
