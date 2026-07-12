interface OnboardingScreenProps {
  title: string;
  subtitle: string;
  buttonText: string;
  onContinue: () => void;
  onCancel?: () => void;
  children: React.ReactNode;
}

export const OnboardingScreen = ({ title, subtitle, buttonText, onContinue, onCancel, children }: OnboardingScreenProps) => (
  <section className="screen-card">
    <div className="screen-content">
      <div className="screen-heading">
        <p className="eyebrow">DreamAble</p>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {children}
      <div className="screen-actions">
        {onCancel && <button className="ghost-btn" onClick={onCancel}>Cancel</button>}
        <button className="primary-btn" onClick={onContinue}>{buttonText}</button>
      </div>
    </div>
  </section>
);
