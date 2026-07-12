import type { CompanionQuestion } from '../types/index';

interface JourneyCompanionProps {
  goal: string;
  destination: string;
  profileTags: string[];
  needs: string[];
  stage: 'idle' | 'guiding' | 'results';
  currentQuestion?: CompanionQuestion;
  questionIndex: number;
  totalQuestions: number;
  onAnswer?: (answer: string) => void;
}

export const JourneyCompanion = ({
  goal,
  destination,
  profileTags,
  needs,
  stage,
  currentQuestion,
  questionIndex,
  totalQuestions,
  onAnswer,
}: JourneyCompanionProps) => {
  const isActive = stage !== 'idle';

  return (
    <aside className={`companion-card ${isActive ? 'companion-card--active' : ''}`}>
      <div className="companion-card__header">
        <div className="badge">✦ Journey Companion</div>
        <h3>{stage === 'results' ? 'Your independence plan is ready.' : 'I’m shaping a calm, confident route for you.'}</h3>
      </div>

      {stage === 'idle' ? (
        <>
          <p>
            After you complete your profile, I’ll guide you through the next steps and highlight the best-fit places for your journey.
          </p>
          <p className="muted">
            Your {goal.toLowerCase()} plan for {destination} is already being prepared in the background.
          </p>
        </>
      ) : stage === 'guiding' && currentQuestion ? (
        <>
          <p>
            I’m tailoring your {goal.toLowerCase()} plan for <strong>{destination}</strong> around <strong>{profileTags.join(', ')}</strong>.
          </p>
          <div className="companion-progress">
            <span>Question {questionIndex + 1} of {totalQuestions}</span>
          </div>
          <p className="question-title">{currentQuestion.prompt}</p>
          <div className="option-grid">
            {currentQuestion.choices.map((choice: string) => (
              <button key={choice} className="option-btn" onClick={() => onAnswer?.(choice)}>
                {choice}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <p>
            I’ve prepared a confident shortlist centered on <strong>{needs.slice(0, 3).join(', ')}</strong>.
          </p>
          <p className="muted">
            These recommendations are matched to your comfort, confidence, and travel priorities.
          </p>
        </>
      )}
    </aside>
  );
};
