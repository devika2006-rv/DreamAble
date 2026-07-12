import { useMemo, useState } from 'react';
import type { JourneyProfile, Recommendation } from '../types';

type RecommendationDetailProps = {
  recommendation: Recommendation;
  profile: JourneyProfile;
  onClose: () => void;
};

type GalleryTab = 'Rooms' | 'Accessible Bathroom' | 'Entrance' | 'Lift' | 'Parking' | 'Restaurant' | 'Community Photos';

type RoomOption = {
  name: string;
  price: string;
  features: string[];
  occupancy: string;
  cancellation: string;
  availability: string;
};

const galleryTabs: GalleryTab[] = ['Rooms', 'Accessible Bathroom', 'Entrance', 'Lift', 'Parking', 'Restaurant', 'Community Photos'];

const roomOptions: RoomOption[] = [
  {
    name: 'Accessible Deluxe Room',
    price: '₹3,500/night',
    features: ['Roll-in Shower', 'Emergency Call Button', 'Wheelchair Accessible'],
    occupancy: '2 guests',
    cancellation: 'Free cancellation up to 24h',
    availability: '4 rooms left',
  },
  {
    name: 'Premium Accessible Suite',
    price: '₹5,800/night',
    features: ['Companion Friendly', 'Wider Doorways', 'Smart Controls'],
    occupancy: '3 guests',
    cancellation: 'Free cancellation up to 48h',
    availability: '2 rooms left',
  },
];

const nearbyEssentials = [
  { type: 'Accessible Toilet', distance: '90 m', hours: 'Open 24/7', icon: '🚻' },
  { type: 'Hospital', distance: '450 m', hours: '24/7', icon: '🏥' },
  { type: 'Pharmacy', distance: '180 m', hours: '08:00–22:00', icon: '💊' },
  { type: 'Restaurant', distance: '110 m', hours: '11:00–23:00', icon: '🍽️' },
  { type: 'Parking', distance: '60 m', hours: 'Open 24/7', icon: '🅿️' },
  { type: 'Metro Station', distance: '700 m', hours: '06:00–22:00', icon: '🚇' },
];

const emergencyContacts = [
  { label: 'Nearest Hospital', value: 'City Care Hospital' },
  { label: 'Nearest Pharmacy', value: 'LifeLine Pharmacy' },
  { label: 'Emergency Ambulance', value: '108' },
  { label: 'Police Station', value: 'Kochi East Police' },
];

const communityReviews = [
  {
    name: 'Asha',
    type: 'Wheelchair user',
    rating: 5,
    review: 'The entrance and bathroom were genuinely accessible and the staff understood my needs without fuss.',
    date: '2 days ago',
    photo: 'AS',
  },
  {
    name: 'Rohan',
    type: 'Temporary injury',
    rating: 5,
    review: 'I booked this place after seeing the accessibility details and felt calm from arrival to check-out.',
    date: '1 week ago',
    photo: 'RO',
  },
];

export function RecommendationDetail({ recommendation, profile, onClose }: RecommendationDetailProps) {
  const [activeTab, setActiveTab] = useState<GalleryTab>('Rooms');
  const [selectedRoom, setSelectedRoom] = useState<RoomOption>(roomOptions[0]);
  const [bookingStep, setBookingStep] = useState(0);
  const [guestName, setGuestName] = useState('Aisha');
  const [requests, setRequests] = useState('Ground floor room\nExtra wheelchair space');
  const [saved, setSaved] = useState(false);

  const aiExplanation = useMemo(() => {
    const purpose = profile.goal;
    const destination = profile.destination;
    const needs = profile.accessibilityNeeds.join(', ');
    const profileTags = profile.profileTags.join(', ');
    return `Based on your ${purpose.toLowerCase()} plans for ${destination}, your accessibility profile (${profileTags}), and the needs you selected (${needs}), DreamAble matched you with ${recommendation.name} because it offers the strongest balance of Journey Confidence, comfort, safety, and independence. This recommendation was chosen to help you feel supported from arrival to check-out.`;
  }, [profile, recommendation.name]);

  const matchChecklist = useMemo(() => [
    { label: 'Accessible Entrance', detail: 'Step-free arrival and a calm entry path.', active: true },
    { label: 'Wheelchair Friendly Bathroom', detail: 'Spacious bathroom layout designed for comfort and independence.', active: true },
    { label: 'Lift Available', detail: 'Reliable lift access to upper floors and public areas.', active: true },
    { label: 'Accessible Parking', detail: 'Dedicated parking close to the entrance.', active: true },
    { label: 'Hospital Nearby', detail: 'Medical access is close by for added reassurance.', active: true },
    { label: 'Pharmacy Nearby', detail: 'Convenient support for everyday essentials.', active: true },
    { label: 'Quiet Environment', detail: 'A calmer atmosphere that supports rest and reduce stress.', active: true },
    { label: 'Companion Friendly', detail: 'Easy for support companions to stay with you comfortably.', active: true },
  ], []);

  const comparisonScores = useMemo(() => [
    { label: 'Journey Confidence', value: recommendation.confidence },
    { label: 'Accessibility', value: Math.max(88, recommendation.confidence - 4) },
    { label: 'Safety', value: 90 },
    { label: 'Comfort', value: 92 },
    { label: 'Community Rating', value: Math.round(recommendation.rating * 20) },
    { label: 'Location', value: 94 },
  ], [recommendation]);

  const travelAdvice = useMemo(() => {
    if (profile.accessibilityNeeds.includes('Lift Required')) {
      return 'I noticed you selected lift access as a priority. This stay has dependable lift support, and I recommend requesting a room near the lift for extra ease.';
    }
    if (profile.accessibilityNeeds.includes('Accessible Toilet')) {
      return 'Your preference for accessible toilet access is covered here, which can make your stay feel more secure and predictable.';
    }
    return 'You have chosen a thoughtful, confidence-first trip. This place is designed to make each step feel calmer and more manageable.';
  }, [profile.accessibilityNeeds]);

  const bookingSteps = ['Select Room', 'Guest Details', 'Accessibility Requests', 'Review Booking', 'Payment'];

  const nextStep = () => {
    if (bookingStep < bookingSteps.length - 1) {
      setBookingStep(bookingStep + 1);
    }
  };

  const prevStep = () => {
    if (bookingStep > 0) {
      setBookingStep(bookingStep - 1);
    }
  };

  return (
    <div className="detail-overlay" role="dialog" aria-modal="true">
      <div className="detail-sheet">
        <button className="detail-close" onClick={onClose}>×</button>

        <div className="detail-hero" style={{ backgroundImage: `linear-gradient(135deg, rgba(5,10,23,0.72), rgba(20,36,58,0.6)), url(${recommendation.image})` }}>
          <div className="detail-hero__content">
            <p className="detail-eyebrow">✨ Why is this perfect for me?</p>
            <h2>{recommendation.name}</h2>
            <p>Recommended exclusively for your journey.</p>
            <div className="detail-hero__meta">
              <span>{recommendation.category}</span>
              <span>{recommendation.distance}</span>
              <span>★ {recommendation.rating}</span>
            </div>
          </div>
        </div>

        <div className="detail-body">
          <section className="detail-card">
            <h3>AI explanation</h3>
            <p className="detail-card__text">{aiExplanation}</p>
          </section>

          <section className="detail-card">
            <div className="detail-card__header">
              <div>
                <p className="detail-eyebrow">Personal match analysis</p>
                <h3>Your comfort checklist</h3>
              </div>
              <span className="badge">Journey Confidence {recommendation.confidence}%</span>
            </div>
            <div className="checklist-grid">
              {matchChecklist.map((item) => (
                <div key={item.label} className="checklist-item">
                  <div className="checklist-item__icon">✓</div>
                  <div>
                    <strong>{item.label}</strong>
                    <p>{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="detail-card">
            <div className="detail-card__header">
              <div>
                <p className="detail-eyebrow">AI comparison</p>
                <h3>Compared with 18 nearby alternatives</h3>
              </div>
              <span className="badge">Top match</span>
            </div>
            <div className="comparison-list">
              {comparisonScores.map((item) => (
                <div key={item.label} className="comparison-row">
                  <div className="comparison-row__label">
                    <span>{item.label}</span>
                    <strong>{item.value}%</strong>
                  </div>
                  <div className="progress-bar compact">
                    <div className="progress-bar__fill" style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="detail-card">
            <div className="detail-card__header">
              <div>
                <p className="detail-eyebrow">Community reviews</p>
                <h3>Verified accessibility reviews</h3>
              </div>
              <span className="badge">{recommendation.reviewCount}+ reviews</span>
            </div>
            <div className="review-list">
              {communityReviews.map((review) => (
                <article key={review.name} className="review-card">
                  <div className="review-card__header">
                    <div className="avatar">{review.photo}</div>
                    <div>
                      <strong>{review.name}</strong>
                      <p>{review.type}</p>
                    </div>
                    <div className="review-rating">{'★'.repeat(review.rating)}</div>
                  </div>
                  <p>{review.review}</p>
                  <div className="review-meta">
                    <span>{review.date}</span>
                    <span>Accessibility photo shared</span>
                  </div>
                </article>
              ))}
            </div>
            <button className="ghost-btn secondary-action">Upload accessibility photo</button>
          </section>

          <section className="detail-card">
            <div className="detail-card__header">
              <div>
                <p className="detail-eyebrow">Accessibility gallery</p>
                <h3>See what matters most</h3>
              </div>
            </div>
            <div className="gallery-tabs">
              {galleryTabs.map((tab) => (
                <button key={tab} className={`chip ${activeTab === tab ? 'chip--active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
              ))}
            </div>
            <div className="gallery-grid">
              {[1, 2, 3].map((item) => (
                <div key={`${activeTab}-${item}`} className="gallery-card">
                  <div className="gallery-card__visual" />
                  <p>{activeTab} preview {item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="detail-card">
            <div className="detail-card__header">
              <div>
                <p className="detail-eyebrow">Hotel information</p>
                <h3>Everything you need to verify</h3>
              </div>
            </div>
            <div className="info-grid">
              <div><strong>Hotel Name</strong><p>{recommendation.name}</p></div>
              <div><strong>Full Address</strong><p>42 Harbor Avenue, Kochi</p></div>
              <div><strong>Distance</strong><p>{recommendation.distance}</p></div>
              <div><strong>Phone Number</strong><p>+91 98765 43210</p></div>
              <div><strong>Email</strong><p>stay@harborresidence.com</p></div>
              <div><strong>Official Website</strong><p>harborresidence.com</p></div>
              <div><strong>Check-in / Check-out</strong><p>14:00 / 12:00</p></div>
              <div><strong>Accessibility Certification</strong><p>Verified by DreamAble Team</p></div>
              <div><strong>Journey Confidence Score</strong><p>{recommendation.confidence}%</p></div>
              <div><strong>Last Verified</strong><p>Today</p></div>
              <div><strong>Verified By</strong><p>DreamAble Community</p></div>
            </div>
          </section>

          <section className="detail-card">
            <div className="detail-card__header">
              <div>
                <p className="detail-eyebrow">Book through DreamAble</p>
                <h3>Reserve with confidence</h3>
              </div>
            </div>
            <div className="booking-steps">
              {bookingSteps.map((step, index) => (
                <div key={step} className={`booking-step ${bookingStep === index ? 'booking-step--active' : ''}`}>
                  <span>{index + 1}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>

            <div className="room-grid">
              {roomOptions.map((room) => (
                <button key={room.name} className={`room-card ${selectedRoom.name === room.name ? 'room-card--active' : ''}`} onClick={() => setSelectedRoom(room)}>
                  <strong>{room.name}</strong>
                  <span>{room.price}</span>
                  <p>{room.features.join(' • ')}</p>
                  <small>{room.availability}</small>
                </button>
              ))}
            </div>

            <div className="booking-form">
              {bookingStep === 0 && <p>Select one of the room categories above to continue.</p>}
              {bookingStep === 1 && (
                <>
                  <label>Guest Name</label>
                  <input className="input" value={guestName} onChange={(event) => setGuestName(event.target.value)} />
                </>
              )}
              {bookingStep === 2 && (
                <>
                  <label>Accessibility Requests</label>
                  <textarea className="textarea" value={requests} onChange={(event) => setRequests(event.target.value)} />
                </>
              )}
              {bookingStep === 3 && (
                <div className="booking-summary">
                  <p><strong>Room:</strong> {selectedRoom.name}</p>
                  <p><strong>Guest:</strong> {guestName}</p>
                  <p><strong>Requests:</strong> {requests}</p>
                </div>
              )}
              {bookingStep === 4 && (
                <div className="booking-summary">
                  <p>Your booking is ready. DreamAble will confirm it instantly with the hotel.</p>
                </div>
              )}
            </div>

            <div className="detail-actions">
              <button className="ghost-btn" onClick={prevStep} disabled={bookingStep === 0}>Back</button>
              <button className="primary-btn" onClick={bookingStep === 4 ? () => setBookingStep(0) : nextStep}>
                {bookingStep === 4 ? 'Book Now' : 'Continue'}
              </button>
            </div>
          </section>

          <section className="detail-card">
            <div className="detail-card__header">
              <div>
                <p className="detail-eyebrow">AI personal travel advice</p>
                <h3>Supportive guidance before you confirm</h3>
              </div>
            </div>
            <p className="detail-card__text">{travelAdvice}</p>
          </section>

          <section className="detail-card">
            <div className="detail-card__header">
              <div>
                <p className="detail-eyebrow">Nearby essentials</p>
                <h3>Everything nearby, clearly mapped</h3>
              </div>
            </div>
            <div className="essential-grid">
              {nearbyEssentials.map((item) => (
                <div key={item.type} className="essential-card">
                  <div className="essential-card__icon">{item.icon}</div>
                  <div>
                    <strong>{item.type}</strong>
                    <p>{item.distance}</p>
                    <small>{item.hours}</small>
                  </div>
                  <button className="ghost-btn small">Navigate</button>
                </div>
              ))}
            </div>
          </section>

          <section className="detail-card">
            <div className="detail-card__header">
              <div>
                <p className="detail-eyebrow">Emergency assistance</p>
                <h3>Support is never far away</h3>
              </div>
            </div>
            <div className="emergency-card">
              <div className="emergency-card__list">
                {emergencyContacts.map((item) => (
                  <div key={item.label} className="emergency-item">
                    <strong>{item.label}</strong>
                    <p>{item.value}</p>
                  </div>
                ))}
              </div>
              <button className="primary-btn">Share live location</button>
            </div>
          </section>

          <section className="detail-card">
            <div className="detail-card__header">
              <div>
                <p className="detail-eyebrow">Post journey experience</p>
                <h3>Turn your journey into tomorrow’s inspiration</h3>
              </div>
            </div>
            <div className="post-journey">
              <div>
                <h4>🎉 Congratulations!</h4>
                <p>You completed another independent journey.</p>
              </div>
              <div className="badge">🏆 Dream Achiever Badge</div>
              <p>Would you like to inspire the next traveler?</p>
              <div className="detail-actions">
                <button className="ghost-btn">Upload photos</button>
                <button className="primary-btn">Share experience</button>
              </div>
            </div>
          </section>
        </div>

        <div className="detail-floating-actions">
          <button className="floating-btn">📞 Call</button>
          <button className="floating-btn">💬 WhatsApp</button>
          <button className="floating-btn">📧 Email</button>
          <button className="floating-btn">🌐 Website</button>
          <button className="floating-btn">📍 Maps</button>
          <button className="floating-btn" onClick={() => setSaved((value) => !value)}>{saved ? '❤️ Saved' : '❤️ Save'}</button>
          <button className="floating-btn">🔗 Share</button>
        </div>
      </div>
    </div>
  );
}
