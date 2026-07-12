import { useEffect, useMemo, useState } from 'react';
import { OnboardingScreen } from './components/OnboardingScreen';
import { StoriesCarousel } from './components/StoriesCarousel';
import { JourneyCompanion } from './components/JourneyCompanion';
import { RecommendationDetail } from './components/RecommendationDetail';
import { LandingPage } from './components/LandingPage';
import { AuthExperience } from './components/AuthExperience';
import { AccessPass } from './components/AccessPass';
import { accessibilityNeeds, accessibilityProfiles, getCompanionQuestions, journeyGoals } from './services/mockData';
import { buildRecommendations } from './services/recommendationEngine';
import type { AccessPassData, JourneyProfile, Recommendation, UserProfile } from './types/index';
import { getConfidenceLabel } from './utils/helpers';

type Screen = 'welcome' | 'auth-login' | 'auth-signup' | 'auth-partner' | 'auth-loading' | 'auth-onboarding-1' | 'auth-onboarding-2' | 'hope' | 'purpose' | 'destination' | 'profile' | 'needs' | 'review' | 'companion' | 'plan' | 'complete';

type CompanionStage = 'idle' | 'guiding' | 'results';

const initialProfile: JourneyProfile = {
  goal: 'Solo Trip',
  destination: 'Kochi',
  accessibilityNeeds: ['Accessible Toilet', 'Lift Required'],
  profileTags: ['Wheelchair User', 'Temporary Injury'],
  additionalRequirements: 'Quiet room and pharmacy nearby',
};

const motivationalLines = [
  'You have already taken the hardest step.',
  'Confidence begins with the first journey.',
  'Dreams do not disappear; they find a new path.',
  'Your next story starts today.',
];

function App() {
  const [screen, setScreen] = useState<Screen>(() => {
    if (typeof window === 'undefined') return 'welcome';
    const savedScreen = window.localStorage.getItem('dreamable-screen') as Screen | null;
    return savedScreen ?? 'welcome';
  });
  const [screenHistory, setScreenHistory] = useState<Screen[]>(() => {
    if (typeof window === 'undefined') return ['welcome'];
    const savedHistory = window.localStorage.getItem('dreamable-screen-history');
    return savedHistory ? JSON.parse(savedHistory) : ['welcome'];
  });
  const [authUser, setAuthUser] = useState<UserProfile | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = window.localStorage.getItem('dreamable-user');
    return stored ? JSON.parse(stored) : null;
  });
  const [profile, setProfile] = useState<JourneyProfile>(() => {
    if (typeof window === 'undefined') return initialProfile;
    const stored = window.localStorage.getItem('dreamable-profile');
    return stored ? JSON.parse(stored) : initialProfile;
  });
  const [, setCompanionStage] = useState<CompanionStage>('idle');
  const [questionIndex, setQuestionIndex] = useState(() => {
    if (typeof window === 'undefined') return 0;
    const stored = window.localStorage.getItem('dreamable-question-index');
    return stored ? Number(JSON.parse(stored)) : 0;
  });
  const [companionAnswers, setCompanionAnswers] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    const stored = window.localStorage.getItem('dreamable-companion-answers');
    return stored ? JSON.parse(stored) : [];
  });
  const [selectedExplanation, setSelectedExplanation] = useState<Recommendation | null>(null);
  const [lastRecommendation, setLastRecommendation] = useState<Recommendation | null>(null);
  const [accessPass, setAccessPass] = useState<AccessPassData | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = window.localStorage.getItem('dreamable-access-pass');
    return stored ? JSON.parse(stored) : null;
  });
  const [isAccessPassPromptOpen, setIsAccessPassPromptOpen] = useState(false);
  const [isAccessPassModalOpen, setIsAccessPassModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('dreamable-screen', screen);
    window.localStorage.setItem('dreamable-screen-history', JSON.stringify(screenHistory));
    window.localStorage.setItem('dreamable-profile', JSON.stringify(profile));
    window.localStorage.setItem('dreamable-question-index', JSON.stringify(questionIndex));
    window.localStorage.setItem('dreamable-companion-answers', JSON.stringify(companionAnswers));
    window.localStorage.setItem('dreamable-access-pass', JSON.stringify(accessPass));
  }, [screen, screenHistory, profile, questionIndex, companionAnswers, accessPass]);

  const questions = useMemo(() => getCompanionQuestions(profile.goal), [profile.goal]);
  const currentQuestion = questions[questionIndex];
  const recommendationsToShow = useMemo(() => {
    if (screen !== 'plan') return [];
    return buildRecommendations(profile, companionAnswers);
  }, [companionAnswers, profile, screen]);

  const updateField = <K extends keyof JourneyProfile>(field: K, value: JourneyProfile[K]) => {
    setProfile((prev: JourneyProfile) => ({ ...prev, [field]: value }));
  };

  const toggleMultiSelect = (value: string, field: 'accessibilityNeeds' | 'profileTags') => {
    const values = profile[field];
    const next = values.includes(value) ? values.filter((item: string) => item !== value) : [...values, value];
    updateField(field, next);
  };

  const handleCompanionAnswer = (answer: string) => {
    const nextAnswers = [...companionAnswers, answer];
    setCompanionAnswers(nextAnswers);
    if (questionIndex >= questions.length - 1) {
      setCompanionStage('results');
      setScreen('plan');
      return;
    }
    setQuestionIndex((prev) => prev + 1);
  };

  const navigateToScreen = (nextScreen: Screen, pushToHistory = true) => {
    if (screen === nextScreen) return;
    if (pushToHistory) {
      setScreenHistory((prev) => [...prev, screen]);
    }
    setScreen(nextScreen);
  };

  const handleBack = () => {
    if (screenHistory.length === 0 || screen === 'welcome') {
      setScreen('welcome');
      return;
    }
    const previousScreen = screenHistory[screenHistory.length - 1];
    setScreenHistory((prev) => prev.slice(0, -1));
    setScreen(previousScreen);
  };

  const finishProfile = () => {
    setCompanionStage('guiding');
    navigateToScreen('companion');
  };

  const saveUserProfile = (profileToSave: UserProfile) => {
    setAuthUser(profileToSave);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('dreamable-user', JSON.stringify(profileToSave));
    }
  };

  const handleBeginJourney = () => {
    if (authUser) {
      navigateToScreen('auth-loading', false);
      window.setTimeout(() => navigateToScreen('auth-onboarding-1', false), 2200);
      return;
    }
    navigateToScreen('auth-login');
  };

  const handleLogout = () => {
    setAuthUser(null);
    setScreen('welcome');
    setScreenHistory(['welcome']);
    setQuestionIndex(0);
    setCompanionAnswers([]);
    setSelectedExplanation(null);
    setLastRecommendation(null);
    setAccessPass(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('dreamable-user');
      window.localStorage.removeItem('dreamable-access-pass');
    }
  };

  const generateAccessPass = (recommendation: Recommendation) => {
    const travelDate = new Date().toLocaleDateString('en', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const approvedRequirements = Array.from(new Set([
      ...profile.accessibilityNeeds,
      ...(profile.profileTags.includes('Wheelchair User') ? ['Wheelchair User'] : []),
      ...(profile.accessibilityNeeds.includes('Lift Required') ? ['Lift Required'] : []),
      ...(profile.accessibilityNeeds.includes('Accessible Toilet') ? ['Accessible Bathroom Required'] : []),
      ...(profile.accessibilityNeeds.includes('Ramp Required') ? ['Step-Free Entrance'] : []),
      ...(profile.accessibilityNeeds.includes('Companion Friendly') ? ['Companion Traveling'] : []),
      ...(profile.profileTags.includes('Visual Impairment') ? ['Visual Assistance Needed'] : []),
      ...(profile.profileTags.includes('Hearing Impairment') ? ['Hearing Assistance Needed'] : []),
      ...(profile.additionalRequirements ? ['Other Accessibility Notes'] : []),
    ]));

    const aiSummary = `Hello!\n\nThis traveler uses ${profile.profileTags[0] ?? 'a supported travel profile'} and requires ${approvedRequirements.slice(0, 3).join(', ')}. Preparing these facilities before arrival will ensure a comfortable and independent travel experience. Thank you for supporting accessible tourism.`;

    const pass: AccessPassData = {
      id: `dreamable-${recommendation.id}-${Date.now()}`,
      travelerName: authUser?.name ?? 'DreamAble Explorer',
      destination: profile.destination || 'Your destination',
      travelDate,
      journeyStatus: 'Ready to Travel',
      accessRequirements: approvedRequirements,
      aiSummary,
      privacyNotice: 'DreamAble only shares the accessibility information approved by the traveler. Medical information is always optional and requires explicit permission before sharing.',
      qrValue: `https://dreamable.app/access-pass/${recommendation.id}/${Date.now()}`,
    };

    setAccessPass(pass);
    setLastRecommendation(recommendation);
    setIsAccessPassPromptOpen(true);
    setIsAccessPassModalOpen(false);
  };

  const handleSelectRecommendation = (recommendation: Recommendation) => {
    setSelectedExplanation(recommendation);
    generateAccessPass(recommendation);
  };

  const handleEditAccessPass = () => {
    if (!accessPass) return;
    setAccessPass({
      ...accessPass,
      aiSummary: `${accessPass.aiSummary}\n\nUpdated by traveler before arrival.`,
    });
  };

  const handleDeleteAccessPass = () => {
    setAccessPass(null);
    setIsAccessPassPromptOpen(false);
    setIsAccessPassModalOpen(false);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('dreamable-access-pass');
    }
  };

  const handleRegenerateAccessPass = () => {
    if (lastRecommendation) {
      generateAccessPass(lastRecommendation);
    }
  };

  const handleViewAccessPass = () => {
    setIsAccessPassPromptOpen(false);
    setIsAccessPassModalOpen(true);
  };

  const handleShareWithHotel = async () => {
    setIsAccessPassPromptOpen(false);
    setIsAccessPassModalOpen(true);
    if (accessPass && typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: 'DreamAble AccessPass',
          text: `Accessibility profile for ${accessPass.travelerName}`,
          url: accessPass.qrValue,
        });
      } catch {
        // Sharing can be skipped and the profile remains available.
      }
    }
  };

  const handleDownloadPdf = () => {
    setIsAccessPassPromptOpen(false);
    setIsAccessPassModalOpen(true);
  };

  const handleAuthSubmit = (profileToSave: UserProfile) => {
    saveUserProfile(profileToSave);
    navigateToScreen('auth-loading', false);
    window.setTimeout(() => navigateToScreen('auth-onboarding-1', false), 2200);
  };

  const handleAuthGuest = () => {
    navigateToScreen('hope');
  };

  const handleAuthModeSwitch = (nextMode: 'login' | 'signup' | 'partner') => {
    navigateToScreen(nextMode === 'login' ? 'auth-login' : nextMode === 'signup' ? 'auth-signup' : 'auth-partner');
  };

  const handleOnboardingComplete = (profileToSave: UserProfile) => {
    saveUserProfile(profileToSave);
    navigateToScreen('hope');
  };

  const createPlan = () => {
    setCompanionStage('results');
    navigateToScreen('plan');
  };

  const breadcrumbItems = useMemo<Array<{ label: string; screen: Screen }>>(() => {
    if (screen === 'welcome') return [{ label: 'Home', screen: 'welcome' }];
    if (screen === 'auth-login' || screen === 'auth-signup' || screen === 'auth-partner' || screen === 'auth-loading' || screen === 'auth-onboarding-1' || screen === 'auth-onboarding-2') {
      return [{ label: 'Home', screen: 'welcome' }, { label: 'Account', screen: screen === 'auth-login' ? 'auth-login' : screen === 'auth-signup' ? 'auth-signup' : screen === 'auth-partner' ? 'auth-partner' : screen === 'auth-loading' ? 'auth-login' : screen === 'auth-onboarding-1' ? 'auth-onboarding-1' : 'auth-onboarding-2' }];
    }
    if (screen === 'hope') return [{ label: 'Home', screen: 'welcome' }, { label: 'Stories', screen: 'hope' }];
    if (screen === 'purpose') return [{ label: 'Home', screen: 'welcome' }, { label: 'Plan Journey', screen: 'purpose' }];
    if (screen === 'destination') return [{ label: 'Home', screen: 'welcome' }, { label: 'Plan Journey', screen: 'purpose' }, { label: 'Destination', screen: 'destination' }];
    if (screen === 'profile') return [{ label: 'Home', screen: 'welcome' }, { label: 'Plan Journey', screen: 'purpose' }, { label: 'Accessibility', screen: 'profile' }];
    if (screen === 'needs') return [{ label: 'Home', screen: 'welcome' }, { label: 'Plan Journey', screen: 'purpose' }, { label: 'Needs', screen: 'needs' }];
    if (screen === 'review') return [{ label: 'Home', screen: 'welcome' }, { label: 'Plan Journey', screen: 'purpose' }, { label: 'Review', screen: 'review' }];
    if (screen === 'companion') return [{ label: 'Home', screen: 'welcome' }, { label: 'Plan Journey', screen: 'purpose' }, { label: 'Companion', screen: 'companion' }];
    if (screen === 'plan') return [{ label: 'Home', screen: 'welcome' }, { label: 'Plan Journey', screen: 'purpose' }, { label: 'Recommendations', screen: 'plan' }];
    if (screen === 'complete') return [{ label: 'Home', screen: 'welcome' }, { label: 'Plan Journey', screen: 'purpose' }, { label: 'Complete', screen: 'complete' }];
    return [{ label: 'Home', screen: 'welcome' }];
  }, [screen]);

  const journeyProgress = useMemo(() => {
    switch (screen) {
      case 'purpose':
        return { step: 1, total: 4, label: 'Purpose' };
      case 'destination':
        return { step: 2, total: 4, label: 'Destination' };
      case 'profile':
      case 'needs':
      case 'review':
        return { step: 3, total: 4, label: screen === 'profile' ? 'Accessibility' : screen === 'needs' ? 'Accessibility Needs' : 'Review' };
      case 'companion':
      case 'plan':
      case 'complete':
        return { step: 4, total: 4, label: screen === 'companion' ? 'Companion' : screen === 'plan' ? 'Recommendations' : 'Complete' };
      default:
        return null;
    }
  }, [screen]);

  return (
    <div className="app-shell">
      {screen !== 'welcome' && (
        <div className="top-nav">
          <div className="top-nav__actions">
            <button className="glass-btn" onClick={handleBack} aria-label="Go back">
              ← Back
            </button>
            {accessPass && (
              <button className="glass-btn" onClick={handleViewAccessPass}>
                My AccessPass™
              </button>
            )}
          </div>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            {breadcrumbItems.map((item, index) => (
              <span key={item.label} className="breadcrumb-item">
                {index > 0 && <span className="breadcrumb-divider">/</span>}
                <button className="breadcrumb-link" onClick={() => navigateToScreen(item.screen)}>{item.label}</button>
              </span>
            ))}
          </nav>
        </div>
      )}

      {journeyProgress && (
        <div className="journey-progress-card" aria-label="Journey progress">
          <div>
            <p className="eyebrow">Journey progress</p>
            <strong>Step {journeyProgress.step} of {journeyProgress.total}</strong>
            <p>{journeyProgress.label}</p>
          </div>
          <div className="progress-bar wide">
            <div className="progress-bar__fill" style={{ width: `${(journeyProgress.step / journeyProgress.total) * 100}%` }} />
          </div>
        </div>
      )}

      <div className="progress-bar">
        <div className="progress-bar__fill" style={{ width: `${Math.max(8, (['welcome','hope','purpose','destination','profile','needs','review','companion','plan','complete'].indexOf(screen) + 1) * 10)}%` }} />
      </div>

      {isAccessPassPromptOpen && accessPass && (
        <div className="detail-overlay accesspass-prompt-overlay">
          <div className="accesspass-prompt">
            <p className="eyebrow">DreamAble AccessPass™</p>
            <h3>Your DreamAble AccessPass™ is ready!</h3>
            <p>Your accessibility profile is prepared for a calm, confident arrival.</p>
            <div className="accesspass-actions">
              <button className="primary-btn" onClick={handleViewAccessPass}>View AccessPass</button>
              <button className="ghost-btn" onClick={handleShareWithHotel}>Share with Hotel</button>
              <button className="ghost-btn" onClick={handleDownloadPdf}>Download PDF</button>
            </div>
          </div>
        </div>
      )}

      {isAccessPassModalOpen && accessPass && (
        <AccessPass accessPass={accessPass} onClose={() => setIsAccessPassModalOpen(false)} mode="modal" onEdit={handleEditAccessPass} onDelete={handleDeleteAccessPass} onRegenerate={handleRegenerateAccessPass} />
      )}

      <main className="journey-layout">
        <section className="journey-main">
          {screen === 'welcome' && <LandingPage onBegin={handleBeginJourney} />}

          {(screen === 'auth-login' || screen === 'auth-signup' || screen === 'auth-partner' || screen === 'auth-loading' || screen === 'auth-onboarding-1' || screen === 'auth-onboarding-2') && (
            <AuthExperience
              mode={screen === 'auth-login' ? 'login' : screen === 'auth-signup' ? 'signup' : screen === 'auth-partner' ? 'partner' : screen === 'auth-loading' ? 'loading' : screen === 'auth-onboarding-1' ? 'onboarding-1' : 'onboarding-2'}
              user={authUser}
              onAuthSubmit={handleAuthSubmit}
              onGuestContinue={handleAuthGuest}
              onSwitchMode={handleAuthModeSwitch}
              onBackToLanding={() => setScreen('welcome')}
              onOnboardingComplete={handleOnboardingComplete}
            />
          )}

          {screen === 'hope' && <StoriesCarousel onContinue={() => setScreen('purpose')} />}

          {screen === 'purpose' && (
            <OnboardingScreen title="What dream are we helping you achieve today?" subtitle="Choose one purpose for this journey." buttonText="Continue" onContinue={() => navigateToScreen('destination')} onCancel={() => setScreen('welcome')}>
              <div className="option-grid large">
                {journeyGoals.map((goal) => (
                  <button key={goal} className={`option-card ${profile.goal === goal ? 'option-card--active' : ''}`} onClick={() => updateField('goal', goal)}>
                    {goal}
                  </button>
                ))}
              </div>
            </OnboardingScreen>
          )}

          {screen === 'destination' && (
            <OnboardingScreen title="Where are you heading?" subtitle="A calm, supportive destination search is ready for you." buttonText="Continue" onContinue={() => navigateToScreen('profile')} onCancel={() => setScreen('welcome')}>
              <div className="search-shell">
                <input className="input" value={profile.destination} onChange={(event) => updateField('destination', event.target.value)} placeholder="Search destination" />
                <div className="search-hint">Mock Google Places architecture is ready for your MVP experience.</div>
              </div>
            </OnboardingScreen>
          )}

          {screen === 'profile' && (
            <OnboardingScreen title="How can we support you best?" subtitle="Select the experiences that describe you." buttonText="Continue" onContinue={() => navigateToScreen('needs')} onCancel={() => setScreen('welcome')}>
              <div className="option-grid">
                {accessibilityProfiles.map((item) => (
                  <label key={item} className={`option-card ${profile.profileTags.includes(item) ? 'option-card--active' : ''}`}>
                    <input type="checkbox" checked={profile.profileTags.includes(item)} onChange={() => toggleMultiSelect(item, 'profileTags')} />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </OnboardingScreen>
          )}

          {screen === 'needs' && (
            <OnboardingScreen title="What would make this journey comfortable?" subtitle="Choose your comfort essentials." buttonText="Review My Plan" onContinue={() => navigateToScreen('review')} onCancel={() => setScreen('welcome')}>
              <div className="option-grid">
                {accessibilityNeeds.map((item) => (
                  <label key={item} className={`option-card ${profile.accessibilityNeeds.includes(item) ? 'option-card--active' : ''}`}>
                    <input type="checkbox" checked={profile.accessibilityNeeds.includes(item)} onChange={() => toggleMultiSelect(item, 'accessibilityNeeds')} />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
              <textarea className="textarea" value={profile.additionalRequirements} onChange={(event) => updateField('additionalRequirements', event.target.value)} placeholder="Any custom accessibility requirement?" />
            </OnboardingScreen>
          )}

          {screen === 'review' && (
            <OnboardingScreen title="Your journey is being understood." subtitle="Review your selections and create your independence plan." buttonText="✨ Create My Independence Plan" onContinue={finishProfile} onCancel={() => setScreen('welcome')}>
              <div className="summary-card">
                <div><span className="summary-label">Purpose</span><strong>{profile.goal}</strong></div>
                <div><span className="summary-label">Destination</span><strong>{profile.destination}</strong></div>
                <div><span className="summary-label">Profile</span><strong>{profile.profileTags.join(', ')}</strong></div>
                <div><span className="summary-label">Needs</span><strong>{profile.accessibilityNeeds.join(', ')}</strong></div>
              </div>
            </OnboardingScreen>
          )}

          {screen === 'companion' && (
            <OnboardingScreen title="Your Journey Companion is preparing your plan." subtitle="Thoughtful guidance is underway." buttonText="Continue" onContinue={createPlan} onCancel={() => setScreen('welcome')}>
              <div className="loading-card">
                <div className="loading-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <p>Finding accessible places...</p>
                <p>Checking hospitals...</p>
                <p>Comparing accessibility...</p>
              </div>
            </OnboardingScreen>
          )}

          {screen === 'plan' && (
            <section className="plan-screen">
              <div className="plan-header">
                <div>
                  <p className="eyebrow">Your Independence Plan</p>
                  <h2>Your journey is ready.</h2>
                  <p>A supportive route and confidence-first plan are prepared just for you.</p>
                </div>
                <button className="primary-btn" onClick={() => navigateToScreen('complete')}>See Final Encouragement</button>
              </div>

              {recommendationsToShow.length === 0 ? (
                <div className="empty-state-card">
                  <p className="eyebrow">No exact match yet</p>
                  <h3>We’re still finding the best fit for this destination.</h3>
                  <p>DreamAble will widen the search to nearby accessible options and suggest the most supportive alternatives for your trip.</p>
                </div>
              ) : (
                <div className="recommendation-grid">
                  {recommendationsToShow.map((item) => (
                  <article key={item.id} className="recommendation-card">
                    <img src={item.image} alt={item.name} className="recommendation-card__image" />
                    <div className="recommendation-card__content">
                      <div className="recommendation-card__top">
                        <div>
                          <h3>{item.name}</h3>
                          <p>{item.category} • {item.distance}</p>
                        </div>
                        <div className="score-pill">
                          <strong>{item.confidence}%</strong>
                          <span>{getConfidenceLabel(item.confidence)}</span>
                        </div>
                      </div>
                      <div className="stars">{'★'.repeat(Math.round(item.rating))}</div>
                      <p className="muted">{item.description}</p>
                      <div className="tag-row">
                        {item.tags.map((tag: string) => <span key={tag} className="tag">{tag}</span>)}
                      </div>
                      <div className="recommendation-actions">
                        <button className="primary-btn" onClick={() => handleSelectRecommendation(item)}>Select & Generate AccessPass</button>
                        <button className="ghost-btn" onClick={() => setSelectedExplanation(item)}>Why this recommendation?</button>
                      </div>
                    </div>
                  </article>
                  ))}
                </div>
              )}

              {selectedExplanation && (
                <RecommendationDetail recommendation={selectedExplanation} profile={profile} onClose={() => setSelectedExplanation(null)} />
              )}
            </section>
          )}

          {screen === 'complete' && (
            <OnboardingScreen title="Your dream is still possible." subtitle={motivationalLines[Math.floor(Math.random() * motivationalLines.length)]} buttonText="💙 Yes, I Can Do This" onContinue={() => navigateToScreen('welcome')} onCancel={() => setScreen('welcome')}>
              <div className="complete-card">
                <p>Every journey begins with believing it is possible.</p>
              </div>
            </OnboardingScreen>
          )}
        </section>

        <aside className="journey-sidebar">
          <JourneyCompanion
            goal={profile.goal}
            destination={profile.destination}
            profileTags={profile.profileTags}
            needs={profile.accessibilityNeeds}
            stage={screen === 'companion' || screen === 'plan' ? 'guiding' : 'idle'}
            currentQuestion={currentQuestion}
            questionIndex={questionIndex}
            totalQuestions={questions.length}
            onAnswer={handleCompanionAnswer}
          />
        </aside>
      </main>
    </div>
  );
}

export default App;
