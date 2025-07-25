import React, { useMemo, useState } from 'react';
import { StepOneForm, StepOneFormData } from './contact-form-step-one';
import { StepTwoForm, StepTwoFormData } from './contact-form-step-two';
import { StepThreeForm } from './contact-form-step-three';
import { cn } from '../../utils';
import { createHubspotContact, sendEmail } from '../../services/emailer';
import { plausible } from '../../services/analytics/plausible';

interface ContactFormProps {
  id?: string;
  onSendEmail?: (formData: StepOneFormData & StepTwoFormData) => Promise<void>;
  className?: string;
  title?: string;
  description?: string;
  showPolicyAgreement?: boolean;
}

interface ContactFormData {
  stepOne?: StepOneFormData;
  stepTwo?: StepTwoFormData;
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

    try {
      await createHubspotContact({
        ...allValues,
        source: 'd.foundation/contact',
      });
    } catch (err) {
      console.error(err);
    }

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
        await onSendEmail(
          Object.assign({}, updatedFormData.stepOne, updatedFormData.stepTwo),
        );
      } else {
        await sendEmail(allValues, attachments);
      }

      setStep(o => o + 1);

      // Plausible analytics tracking (optional)
      plausible.trackFormSubmission('Contact Form', {
        props: allValues,
      });
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
    <div id="contact" className={cn('h-full', className)}>
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
