import { useEffect, useMemo, useState } from 'react';

interface StoryCard {
  name: string;
  title: string;
  achievement: string;
  quote: string;
  image: string;
  accent: string;
}

const stories: StoryCard[] = [
  {
    name: 'Arunima Sinha 🇮🇳',
    title: 'The Mountain Couldn\'t Stop Her',
    achievement: 'Lost her left leg in a train accident and became the first female amputee to climb Mount Everest.',
    quote: 'Nothing is impossible. The word itself says “I\'m Possible.”',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    accent: 'linear-gradient(135deg, rgba(179, 90, 255, 0.65), rgba(40, 120, 255, 0.6))',
  },
  {
    name: 'Erik Weihenmayer',
    title: 'He Couldn\'t See the Mountain. He Still Conquered It.',
    achievement: 'Blind since his teenage years, he became the first blind person to summit Mount Everest.',
    quote: 'The only limits are the ones we accept.',
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80',
    accent: 'linear-gradient(135deg, rgba(55, 151, 255, 0.7), rgba(25, 74, 176, 0.65))',
  },
  {
    name: 'Jessica Cox',
    title: 'She Never Needed Arms to Reach the Sky',
    achievement: 'Born without arms, she became the world\'s first licensed armless pilot.',
    quote: 'Disability does not define ability.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    accent: 'linear-gradient(135deg, rgba(255, 145, 77, 0.7), rgba(170, 90, 255, 0.65))',
  },
  {
    name: 'Mark Inglis',
    title: 'Two Prosthetic Legs. One Extraordinary Dream.',
    achievement: 'Lost both legs due to frostbite and climbed Mount Everest with prosthetic legs.',
    quote: 'Your limitations exist only if you believe they do.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    accent: 'linear-gradient(135deg, rgba(92, 112, 255, 0.7), rgba(0, 184, 255, 0.6))',
  },
  {
    name: 'Bethany Hamilton',
    title: 'One Arm. Endless Waves.',
    achievement: 'Lost her left arm in a shark attack and returned to professional surfing.',
    quote: 'Courage doesn\'t mean you don\'t get afraid.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    accent: 'linear-gradient(135deg, rgba(16, 205, 170, 0.65), rgba(0, 114, 255, 0.6))',
  },
  {
    name: 'Muniba Mazari',
    title: 'Life Didn\'t End. It Began Differently.',
    achievement: 'A wheelchair user after a life-changing accident, she became an artist, TV host, model and speaker.',
    quote: 'You are stronger than your circumstances.',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
    accent: 'linear-gradient(135deg, rgba(255, 100, 140, 0.7), rgba(115, 194, 255, 0.65))',
  },
];

interface StoriesCarouselProps {
  onContinue: () => void;
}

export const StoriesCarousel = ({ onContinue }: StoriesCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const prefersReducedMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);

  useEffect(() => {
    if (prefersReducedMotion || paused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % stories.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [paused, prefersReducedMotion]);

  const currentStory = stories[activeIndex];

  return (
    <section className="screen-card stories-screen" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="stories-screen__content">
        <div className="stories-screen__header">
          <div>
            <p className="eyebrow">Dreams Without Barriers</p>
            <h1>Real people. Real courage. Real journeys.</h1>
            <p>Every dream deserves a chance.</p>
          </div>
          <button className="ghost-btn" onClick={onContinue}>I’m Ready</button>
        </div>

        <div className="story-card" style={{ ['--story-accent' as string]: currentStory.accent }}>
          <div className="story-card__image" style={{ backgroundImage: `url(${currentStory.image})` }} />
          <div className="story-card__body">
            <div className="story-card__text">
              <p className="story-card__eyebrow">Inspiration</p>
              <h2>{currentStory.name}</h2>
              <h3>{currentStory.title}</h3>
              <p>{currentStory.achievement}</p>
              <blockquote>“{currentStory.quote}”</blockquote>
            </div>
            <div className="story-card__footer">
              <div className="story-dots" aria-label="Story progress">
                {stories.map((story, index) => (
                  <button
                    key={story.name}
                    className={`story-dot ${index === activeIndex ? 'story-dot--active' : ''}`}
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Show ${story.name}`}
                  />
                ))}
              </div>
              <button className="primary-btn" onClick={onContinue}>✨ Begin My Journey</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
