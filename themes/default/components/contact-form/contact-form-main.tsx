import React, { useMemo, useState } from 'react';
import { StepOneForm, StepOneFormData } from './contact-form-step-one';
import { StepTwoForm, StepTwoFormData } from './contact-form-step-two';
import { StepThreeForm } from './contact-form-step-three';
import { cn } from '../../utils';

interface ContactFormProps {
  id?: string;
  onSendEmail?: (formData: FormData) => Promise<void>;
  className?: string;
  title?: string;
  description?: string;
  showPolicyAgreement?: boolean;
}

interface ContactFormData {
  stepOne?: StepOneFormData;
  stepTwo?: StepTwoFormData;
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export const ContactFormMain: React.FC<ContactFormProps> = ({
  id = 'contact-form',
  onSendEmail,
  className = '',
  title,
  description,
  showPolicyAgreement,
}) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<ContactFormData>({});

  const onReset = () => {
    setFormData({});
    setStep(0);
  };

  const onStepSubmit = (values: StepOneFormData) => {
    setFormData(prev => ({
      ...prev,
      stepOne: values,
    }));
    setStep(o => o + 1);
  };

  const onFinalStepSubmit = async (stepValues: StepTwoFormData) => {
    const updatedFormData = {
      ...formData,
      stepTwo: stepValues,
    };

    const { attachments = [], ...allValues } = {
      ...updatedFormData.stepOne,
      ...updatedFormData.stepTwo,
    };

    const submitFormData = new FormData();
    // form fields
    Object.entries(allValues).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item =>
            submitFormData.append(`${key}[]`, String(item)),
          );
        } else {
          submitFormData.append(key, String(value));
        }
      }
    });
    // files
    attachments.forEach((file: File) =>
      submitFormData.append('attachments[]', file),
    );
    // also includes submit datetime
    submitFormData.append('date', new Date().toString());

    try {
      // Send email using provided handler or default implementation
      if (onSendEmail) {
        await onSendEmail(submitFormData);
      } else {
        // Default implementation - can be replaced with actual email service
        console.log('Form data:', submitFormData);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setStep(o => o + 1);

      // Analytics tracking (optional)
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'gaEvent',
          eventCategory: 'Contact Form',
          eventAction: 'Submit',
        });
      }
    } catch (err) {
      const errMsg =
        err instanceof Error
          ? err.message
          : 'Something went wrong on our end, please try again.';
      alert(errMsg);
      console.error(err);
    }
  };

  const stepRender = useMemo(() => {
    switch (step) {
      case 0: {
        return (
          <StepOneForm
            id={`${id}--step-one`}
            onSubmit={onStepSubmit}
            initialValues={formData.stepOne}
            showPolicyAgreement={showPolicyAgreement}
          />
        );
      }
      case 1: {
        return (
          <StepTwoForm
            id={`${id}--step-two`}
            onSubmit={onFinalStepSubmit}
            onBack={() => setStep(o => o - 1)}
            initialValues={formData.stepTwo}
          />
        );
      }
      case 2: {
        return <StepThreeForm onReset={onReset} />;
      }
      default: {
        return null;
      }
    }
  }, [step, formData, id]);

  return (
    <div
      className={cn('max-w-2xl min-w-md sm:min-w-md md:min-w-lg', className)}
    >
      {title || description ? (
        <div className="mb-8">
          {title ? <h2 className="text-2xl font-bold">{title}</h2> : null}
          {description ? (
            <p className="mt-2 text-gray-600">{description}</p>
          ) : null}
        </div>
      ) : null}

      <div className="h-full" key={JSON.stringify(formData)}>
        {stepRender}
      </div>
    </div>
  );
};
