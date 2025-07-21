export default function FormPrivacyNote() {
  return (
    <p className="text-foreground/80 text-base">
      By sending this form, you agree with our{' '}
      <a
        href="https://www.iubenda.com/privacy-policy/23856015"
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground hover:text-primary underline transition-colors"
      >
        Privacy Policy
      </a>
      .
    </p>
  );
}
