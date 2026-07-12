import { useEffect, useMemo, useState } from 'react';

type LandingPageProps = {
  onBegin: () => void;
};

type HeroSlide = {
  image: string;
  quote: string;
  alt: string;
};

type StoryCard = {
  name: string;
  image: string;
  achievement: string;
  quote: string;
  story: string;
};

const heroSlides: HeroSlide[] = [
  {
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1400&q=80',
    quote: 'An accident may change your body. It should never change your dreams.',
    alt: 'Inspiring traveler smiling confidently outdoors',
  },
  {
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
    quote: 'Dreams do not disappear because life changes.',
    alt: 'Adventurer on a mountain trail with a determined expression',
  },
  {
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=80',
    quote: 'Independence begins with confidence.',
    alt: 'Person traveling through a city with confidence',
  },
];

const stats = [
  { label: 'Accessible Places', value: '5,000+' },
  { label: 'Community Verified', value: '98%' },
  { label: 'Hospitals & Emergency Centers', value: '1,200+' },
  { label: 'Dreams Enabled', value: '2,400+' },
];

const steps = [
  { icon: '🧭', title: 'Tell us your destination.', copy: 'Choose the place you dream of visiting and let DreamAble start shaping a calm route around your needs.' },
  { icon: '♿', title: 'Tell us what support you need.', copy: 'Share your accessibility preferences, comfort essentials, and the little things that make travel feel safe.' },
  { icon: '✨', title: 'DreamAble AI creates your plan.', copy: 'We build a confidence-first Independence Plan with supportive recommendations, routes, and care points.' },
  { icon: '🧳', title: 'Travel confidently with verified choices.', copy: 'Every recommendation is designed to feel thoughtful, dependable, and empowering from the first step.' },
];

const stories: StoryCard[] = [
  {
    name: 'Arunima Sinha',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
    achievement: 'First female amputee to climb Mount Everest',
    quote: 'The mountains do not ask for perfection. They ask for courage.',
    story: 'Arunima’s story reminds us that a life-changing event can become the start of an extraordinary new chapter.',
  },
  {
    name: 'Erik Weihenmayer',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    achievement: 'First blind person to summit Everest',
    quote: 'Vision is not only what you see. It is what you believe.',
    story: 'Erik’s journey shows how trust, preparation, and persistence can transform fear into freedom.',
  },
  {
    name: 'Muniba Mazari',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    achievement: 'Wheelchair user, artist, and speaker',
    quote: 'You are not your disability. You are your story.',
    story: 'Muniba has turned vulnerability into inspiration, proving that dignity and confidence can lead the way.',
  },
];

export function LandingPage({ onBegin }: LandingPageProps) {
  const [activeHero, setActiveHero] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [selectedStory, setSelectedStory] = useState<StoryCard | null>(null);

  const fullCompanionText = useMemo(() => [
    'Hello!',
    "Today, we're not just planning a trip.",
    "We're helping you continue your dreams.",
    "I'll take care of the accessibility details so you can focus on enjoying your journey.",
    "Whenever you're ready, let's begin.",
  ].join(' '), [
  ]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) {
      setTypedText(fullCompanionText);
      return;
    }

    let index = 0;
    const interval = window.setInterval(() => {
      setTypedText(() => {
        const next = fullCompanionText.slice(0, index + 1);
        index += 1;
        if (index >= fullCompanionText.length) {
          window.clearInterval(interval);
        }
        return next;
      });
    }, 24);

    return () => window.clearInterval(interval);
  }, [fullCompanionText]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) return;

    const timer = window.setInterval(() => {
      setActiveHero((current) => (current + 1) % heroSlides.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, []);

  const handleExploreStories = () => {
    document.getElementById('dreams-without-barriers')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="landing-shell">
      <div className="ambient ambient--one" />
      <div className="ambient ambient--two" />
      <div className="ambient ambient--three" />

      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">DreamAble</p>
          <h1>Your accident changed your journey.<br />Not your destination.</h1>
          <p className="hero-copy__text">DreamAble helps people with disabilities travel independently by intelligently planning accessible routes, accommodations, nearby facilities, and personalized support using AI.</p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={onBegin}>✨ Begin My Independence Journey</button>
            <button className="ghost-btn" onClick={handleExploreStories}>▶ Explore Stories of Courage</button>
          </div>
        </div>

        <div className="hero-visual" aria-label="Inspirational travel carousel">
          <div className="hero-image" style={{ backgroundImage: `url(${heroSlides[activeHero].image})` }} />
          <div className="hero-overlay">
            <p>“{heroSlides[activeHero].quote}”</p>
          </div>
        </div>
      </section>

      <section className="stats-grid" aria-label="DreamAble impact statistics">
        {stats.map((item, index) => (
          <article key={item.label} className="stat-card" style={{ animationDelay: `${index * 110}ms` }}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </section>

      <section className="feature-grid">
        <article className="companion-card companion-card--landing">
          <div className="companion-card__header">
            <span className="badge">Trusted companion</span>
            <h3>Welcome to your journey companion</h3>
          </div>
          <p className="companion-card__text">{typedText || 'Hello! Today, we are not just planning a trip. We are helping you continue your dreams.'}</p>
          <div className="companion-card__footer">
            <span>Every step is designed around confidence and independence.</span>
          </div>
        </article>

        <article className="landing-panel">
          <p className="eyebrow">How DreamAble Works</p>
          <div className="steps-list">
            {steps.map((step, index) => (
              <div key={step.title} className="step-card" style={{ animationDelay: `${index * 90}ms` }}>
                <div className="step-card__icon">{step.icon}</div>
                <div>
                  <h4>{step.title}</h4>
                  <p>{step.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section id="dreams-without-barriers" className="stories-section">
        <div className="section-heading">
          <p className="eyebrow">Dreams Without Barriers</p>
          <h2>Stories that turn courage into possibility.</h2>
        </div>
        <div className="story-row">
          {stories.map((story) => (
            <article key={story.name} className="story-card landing-story-card">
              <img src={story.image} alt={story.name} className="story-card__image" />
              <div className="story-card__body">
                <div>
                  <h3>{story.name}</h3>
                  <p className="story-card__achievement">{story.achievement}</p>
                  <blockquote>“{story.quote}”</blockquote>
                </div>
                <button className="ghost-btn" onClick={() => setSelectedStory(story)}>Read Story</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="brand-message">
        <p>DreamAble doesn’t simply help people travel. It restores confidence, dignity, and the freedom to dream again.</p>
      </section>

      {selectedStory && (
        <div className="detail-overlay" role="dialog" aria-modal="true" aria-label={`Story about ${selectedStory.name}`}>
          <div className="story-modal">
            <button className="detail-close" onClick={() => setSelectedStory(null)} aria-label="Close story">×</button>
            <img src={selectedStory.image} alt={selectedStory.name} className="story-modal__image" />
            <div className="story-modal__content">
              <p className="eyebrow">Story of courage</p>
              <h3>{selectedStory.name}</h3>
              <p className="story-card__achievement">{selectedStory.achievement}</p>
              <blockquote>“{selectedStory.quote}”</blockquote>
              <p>{selectedStory.story}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
