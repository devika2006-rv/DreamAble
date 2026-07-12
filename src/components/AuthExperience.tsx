import { useEffect, useMemo, useState } from 'react';
import type { UserProfile } from '../types';

type AuthMode = 'login' | 'signup' | 'partner' | 'onboarding-1' | 'onboarding-2' | 'loading';

type AuthExperienceProps = {
  mode: AuthMode;
  user?: UserProfile | null;
  onAuthSubmit: (profile: UserProfile) => void;
  onGuestContinue: () => void;
  onSwitchMode: (mode: 'login' | 'signup' | 'partner') => void;
  onBackToLanding: () => void;
  onOnboardingComplete: (profile: UserProfile) => void;
};

type HeroSlide = {
  image: string;
  quote: string;
};

const heroSlides: HeroSlide[] = [
  {
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1400&q=80',
    quote: 'Your accident changed your journey. Not your destination.',
  },
  {
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
    quote: 'Dreams do not disappear because life changes.',
  },
  {
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=80',
    quote: 'Every dream deserves another chance.',
  },
];

const accessibilityOptions = ['Wheelchair User', 'Temporary Injury', 'Visual Impairment', 'Hearing Impairment', 'Cognitive Support', 'Companion Required', 'Medical Equipment', 'Other'];
const travelOptions = ['Adventure', 'Education', 'Business', 'Pilgrimage', 'Family', 'Solo Travel', 'Road Trips', 'Nature', 'Medical Visit', 'Conference'];

export function AuthExperience({ mode, user, onAuthSubmit, onGuestContinue, onSwitchMode, onOnboardingComplete }: AuthExperienceProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [remember, setRemember] = useState(true);
  const [accepted, setAccepted] = useState(false);
  const [accessibilityProfile, setAccessibilityProfile] = useState<string[]>(user?.accessibilityProfile ?? []);
  const [travelPreferences, setTravelPreferences] = useState<string[]>(user?.travelPreferences ?? []);
  const [formMessage, setFormMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) return;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const handleLoginSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      setFormMessage('Please enter your email and password.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setFormMessage('Please enter a valid email address.');
      return;
    }
    setFormMessage(null);
    onAuthSubmit({
      name: user?.name ?? 'DreamAble Explorer',
      email,
      accessibilityProfile,
      travelPreferences,
      previousTrips: user?.previousTrips ?? [],
      favoritePlaces: user?.favoritePlaces ?? [],
      dreamAchieverBadge: user?.dreamAchieverBadge ?? true,
      savedAccessibilityPreferences: accessibilityProfile,
    });
  };

  const handleSignupSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!name.trim() || !normalizedEmail || !password || password !== confirm || !accepted) {
      setFormMessage('Please complete every required field and agree to the policy.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setFormMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setFormMessage('Password should be at least 8 characters long.');
      return;
    }
    setFormMessage(null);
    onAuthSubmit({
      name,
      email,
      accessibilityProfile,
      travelPreferences,
      previousTrips: user?.previousTrips ?? [],
      favoritePlaces: user?.favoritePlaces ?? [],
      dreamAchieverBadge: true,
      savedAccessibilityPreferences: accessibilityProfile,
    });
  };

  const toggleSelection = (value: string, list: string[], setter: (next: string[]) => void) => {
    if (list.includes(value)) {
      setter(list.filter((item) => item !== value));
    } else {
      setter([...list, value]);
    }
  };

  const handleOnboardingNext = () => {
    if (mode === 'onboarding-1') {
      if (accessibilityProfile.length === 0) {
        setFormMessage('Choose at least one support option to continue.');
        return;
      }
      setFormMessage(null);
      onOnboardingComplete({
        name: user?.name ?? name,
        email: user?.email ?? email,
        accessibilityProfile,
        travelPreferences,
        previousTrips: user?.previousTrips ?? [],
        favoritePlaces: user?.favoritePlaces ?? [],
        dreamAchieverBadge: user?.dreamAchieverBadge ?? true,
        savedAccessibilityPreferences: accessibilityProfile,
      });
      return;
    }
    if (travelPreferences.length === 0) {
      setFormMessage('Choose at least one travel preference to continue.');
      return;
    }
    setFormMessage(null);
    onOnboardingComplete({
      name: user?.name ?? name,
      email: user?.email ?? email,
      accessibilityProfile,
      travelPreferences,
      previousTrips: user?.previousTrips ?? [],
      favoritePlaces: user?.favoritePlaces ?? [],
      dreamAchieverBadge: user?.dreamAchieverBadge ?? true,
      savedAccessibilityPreferences: accessibilityProfile,
    });
  };

  const authTitle = useMemo(() => {
    if (mode === 'login') return 'Welcome Back 👋';
    if (mode === 'signup') return 'Create Your DreamAble Account';
    if (mode === 'partner') return 'Register Your Business';
    if (mode === 'onboarding-1') return 'Tell us how we can support you.';
    if (mode === 'onboarding-2') return 'What kind of journeys inspire you?';
    return 'Preparing your journey';
  }, [mode]);

  const authSubtitle = useMemo(() => {
    if (mode === 'login') return 'Continue your journey with confidence.';
    if (mode === 'signup') return "Let's build your journey together.";
    if (mode === 'partner') return 'Help your property or service become more discoverable and accessible.';
    if (mode === 'onboarding-1') return 'Choose the experiences that describe you best.';
    if (mode === 'onboarding-2') return 'Select the travel moments that feel most meaningful to you.';
    return 'We are preparing your personal AI Journey Companion.';
  }, [mode]);

  const renderAuthCard = () => {
    if (mode === 'loading') {
      return (
        <div className="auth-panel auth-panel--loading">
          <div className="loading-orb" />
          <h2>🎉 Welcome to DreamAble!</h2>
          <p>Preparing your personal AI Journey Companion...</p>
          <div className="loading-steps">
            {['Creating Profile', 'Preparing Accessibility Preferences', 'Building Your Journey', 'Ready!'].map((step, index) => (
              <div key={step} className="loading-step">
                <span className={`loading-step__dot ${index < 3 ? 'loading-step__dot--active' : ''}`} />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (mode === 'partner') {
      return (
        <div className="auth-panel">
          <button className="text-link" onClick={() => onSwitchMode('login')}>← Back to sign in</button>
          <h2>{authTitle}</h2>
          <p className="auth-panel__subtitle">{authSubtitle}</p>
          <div className="partner-grid">
            <div className="partner-card">
              <strong>Hotels</strong>
              <p>Register rooms and accessibility details.</p>
            </div>
            <div className="partner-card">
              <strong>Restaurants</strong>
              <p>Upload accessible amenities and photos.</p>
            </div>
            <div className="partner-card">
              <strong>Hospitals</strong>
              <p>Share verified medical access information.</p>
            </div>
            <div className="partner-card">
              <strong>Transport</strong>
              <p>Document step-free routes and pickup support.</p>
            </div>
          </div>
          <label className="auth-label">Business Name</label>
          <input className="input" placeholder="Your business name" />
          <label className="auth-label">Email</label>
          <input className="input" placeholder="business@example.com" />
          <button className="primary-btn auth-btn">Register Business</button>
        </div>
      );
    }

    if (mode === 'onboarding-1') {
      return (
        <div className="auth-panel">
          <div className="progress-pill">Step 1 of 2</div>
          <h2>{authTitle}</h2>
          <p className="auth-panel__subtitle">{authSubtitle}</p>
          <div className="option-grid auth-grid">
            {accessibilityOptions.map((option) => (
              <button key={option} className={`option-card ${accessibilityProfile.includes(option) ? 'option-card--active' : ''}`} onClick={() => toggleSelection(option, accessibilityProfile, setAccessibilityProfile)}>
                {option}
              </button>
            ))}
          </div>
          <button className="primary-btn auth-btn" onClick={handleOnboardingNext}>Continue →</button>
        </div>
      );
    }

    if (mode === 'onboarding-2') {
      return (
        <div className="auth-panel">
          <div className="progress-pill">Step 2 of 2</div>
          <h2>{authTitle}</h2>
          <p className="auth-panel__subtitle">{authSubtitle}</p>
          <div className="option-grid auth-grid">
            {travelOptions.map((option) => (
              <button key={option} className={`option-card ${travelPreferences.includes(option) ? 'option-card--active' : ''}`} onClick={() => toggleSelection(option, travelPreferences, setTravelPreferences)}>
                {option}
              </button>
            ))}
          </div>
          <button className="primary-btn auth-btn" onClick={handleOnboardingNext}>✨ Start My Journey</button>
        </div>
      );
    }

    if (mode === 'signup') {
      return (
        <form className="auth-panel" onSubmit={handleSignupSubmit}>
          <h2>{authTitle}</h2>
          <p className="auth-panel__subtitle">{authSubtitle}</p>
          <label className="auth-label" htmlFor="signup-name">Full Name</label>
          <input id="signup-name" className="input" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" />
          <label className="auth-label" htmlFor="signup-email">Email Address</label>
          <input id="signup-email" className="input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" />
          <label className="auth-label" htmlFor="signup-password">Password</label>
          <input id="signup-password" className="input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Create a password" />
          <label className="auth-label" htmlFor="signup-confirm">Confirm Password</label>
          <input id="signup-confirm" className="input" type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} placeholder="Confirm password" />
          <label className="auth-checkbox"><input type="checkbox" checked={accepted} onChange={() => setAccepted((value) => !value)} /> I agree to the Terms & Privacy Policy.</label>
          {formMessage && <p className="form-message">{formMessage}</p>}
          <button className="primary-btn auth-btn" type="submit">✨ Create My Account</button>
          <p className="auth-footer">Already have an account? <button className="text-link" type="button" onClick={() => onSwitchMode('login')}>Sign In →</button></p>
        </form>
      );
    }

    return (
      <form className="auth-panel" onSubmit={handleLoginSubmit}>
        <h2>{authTitle}</h2>
        <p className="auth-panel__subtitle">{authSubtitle}</p>
        <label className="auth-label" htmlFor="login-email">Email Address</label>
        <input id="login-email" className="input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" />
        <label className="auth-label" htmlFor="login-password">Password</label>
        <input id="login-password" className="input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" />
        <div className="auth-row">
          <label className="auth-checkbox"><input type="checkbox" checked={remember} onChange={() => setRemember((value) => !value)} /> Remember Me</label>
          <button className="text-link" type="button">Forgot Password?</button>
        </div>
        {formMessage && <p className="form-message">{formMessage}</p>}
        <button className="primary-btn auth-btn" type="submit">✨ Continue My Journey</button>
        <button className="ghost-btn auth-btn" type="button" onClick={onGuestContinue}>Continue as Guest</button>
        <div className="auth-divider">OR</div>
        <button className="google-btn" type="button">Continue with Google</button>
        <p className="auth-footer">Don’t have an account? <button className="text-link" type="button" onClick={() => onSwitchMode('signup')}>Create an Account →</button></p>
        <button className="small-link" type="button" onClick={() => onSwitchMode('partner')}>🏨 Register Your Business</button>
      </form>
    );
  };

  return (
    <section className="auth-shell">
      <div className="auth-hero">
        <div className="auth-hero__image" style={{ backgroundImage: `url(${heroSlides[activeSlide].image})` }} />
        <div className="auth-hero__overlay">
          <p>“{heroSlides[activeSlide].quote}”</p>
        </div>
      </div>
      <div className="auth-panel-wrap">{renderAuthCard()}</div>
    </section>
  );
}
