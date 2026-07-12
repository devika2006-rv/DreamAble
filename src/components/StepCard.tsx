import type { ReactNode } from 'react';

interface StepCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export const StepCard = ({ title, description, children }: StepCardProps) => (
  <section className="step-card">
    <div className="step-card__header">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
    <div className="step-card__body">{children}</div>
  </section>
);
