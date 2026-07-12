import { useMemo, useState } from 'react';
import type { AccessPassData } from '../types';

type AccessPassProps = {
  accessPass: AccessPassData;
  onClose?: () => void;
  mode?: 'page' | 'modal';
  onEdit?: () => void;
  onDelete?: () => void;
  onRegenerate?: () => void;
};

const requirementIcons: Record<string, string> = {
  'Wheelchair User': '♿',
  'Lift Required': '🛗',
  'Accessible Bathroom Required': '🚿',
  'Step-Free Entrance': '🚪',
  'Ground Floor Preferred': '🛏',
  'Companion Traveling': '👥',
  'Visual Assistance Needed': '🦯',
  'Hearing Assistance Needed': '🦻',
  'Medical Equipment': '🩺',
  'Other Accessibility Notes': '✍',
};

function buildQrPattern(value: string) {
  const size = 21;
  const cells = Array.from({ length: size * size }, (_, index) => {
    const charCode = value.charCodeAt(index % value.length);
    const isFinder = (index < 3 * 3 && index % 7 < 3) || (index % 7 === 0 && index % 11 === 0);
    const isDark = isFinder || ((charCode + index) % 3 === 0) || (index % 8 === 0 && index % 13 === 0);
    return isDark;
  });
  return cells;
}

export function AccessPass({ accessPass, onClose, mode = 'page', onEdit, onDelete, onRegenerate }: AccessPassProps) {
  const [shareState, setShareState] = useState<'idle' | 'shared' | 'error'>('idle');
  const [showReceiverView, setShowReceiverView] = useState(false);

  const qrCells = useMemo(() => buildQrPattern(accessPass.qrValue), [accessPass.qrValue]);
  const visibleRequirements = useMemo(() => {
    const requirements = [...accessPass.accessRequirements];
    return requirements.length > 0 ? requirements : ['Accessibility Profile Shared'];
  }, [accessPass.accessRequirements]);

  const copyShareLink = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(accessPass.qrValue);
      }
      setShareState('shared');
    } catch {
      setShareState('error');
    }
  };

  const handleShare = async () => {
    try {
      if (typeof navigator !== 'undefined' && 'share' in navigator) {
        await navigator.share({
          title: 'DreamAble AccessPass',
          text: `Accessibility profile for ${accessPass.travelerName}`,
          url: accessPass.qrValue,
        });
      } else {
        await copyShareLink();
      }
      setShareState('shared');
    } catch {
      setShareState('error');
    }
  };

  const handleDownloadPdf = () => {
    if (typeof window === 'undefined') return;
    const printWindow = window.open('', '_blank', 'width=900,height=720');
    if (!printWindow) return;

    const html = `
      <html>
        <head>
          <title>DreamAble AccessPass</title>
          <style>
            body { font-family: Inter, Arial, sans-serif; background: #061322; color: #f5fbff; padding: 24px; }
            .card { border-radius: 24px; padding: 24px; background: linear-gradient(135deg, #0f2555, #4b2d9a); box-shadow: 0 24px 60px rgba(0,0,0,0.2); }
            .title { font-size: 24px; margin-bottom: 8px; }
            .pill { display: inline-block; padding: 6px 10px; border-radius: 999px; background: rgba(255,255,255,0.16); margin-right: 8px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1 class="title">DreamAble AccessPass</h1>
            <p>${accessPass.travelerName}</p>
            <p>${accessPass.destination} • ${accessPass.travelDate}</p>
            <p>${accessPass.aiSummary}</p>
            <p>${visibleRequirements.join(' • ')}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const content = (
    <div className={`accesspass-shell ${mode === 'modal' ? 'accesspass-shell--modal' : ''}`}>
      <div className="accesspass-card">
        <div className="accesspass-card__header">
          <div>
            <p className="eyebrow">DreamAble AccessPass™</p>
            <h2>One Tap. Zero Explanations.</h2>
            <p className="muted">Secure, respectful accessibility sharing for every arrival.</p>
          </div>
          {mode === 'modal' && onClose && (
            <button className="glass-btn" onClick={onClose}>Close</button>
          )}
        </div>

        <section className="accesspass-panel accesspass-panel--hero">
          <div className="accesspass-avatar">{accessPass.travelerName.charAt(0)}</div>
          <div>
            <h3>{accessPass.travelerName}</h3>
            <p>{accessPass.destination}</p>
            <div className="accesspass-meta">
              <span>Travel date: {accessPass.travelDate}</span>
              <span>Journey status: {accessPass.journeyStatus}</span>
            </div>
          </div>
        </section>

        <section className="accesspass-panel">
          <div className="detail-card__header">
            <div>
              <p className="detail-eyebrow">Accessibility profile</p>
              <h3>Prepared for a calm arrival</h3>
            </div>
            <span className="badge">Ready to travel</span>
          </div>
          <div className="tag-row">
            {visibleRequirements.map((item) => (
              <span key={item} className="tag">
                {requirementIcons[item] ?? '✦'} {item}
              </span>
            ))}
          </div>
        </section>

        <section className="accesspass-panel">
          <div className="detail-card__header">
            <div>
              <p className="detail-eyebrow">AI summary</p>
              <h3>Supportive, respectful preparation</h3>
            </div>
          </div>
          <p className="detail-card__text">{accessPass.aiSummary}</p>
        </section>

        <section className="accesspass-panel accesspass-panel--qr">
          <div className="qr-card">
            <div className="qr-grid" aria-label="QR code">
              {qrCells.map((filled, index) => (
                <span key={`${filled}-${index}`} className={`qr-cell ${filled ? 'qr-cell--active' : ''}`} />
              ))}
            </div>
            <div>
              <h3>Share this profile</h3>
              <p className="muted">Scan to open the approved accessibility profile.</p>
              <div className="accesspass-actions">
                <button className="primary-btn" onClick={handleShare}>📤 Share AccessPass</button>
                <button className="ghost-btn" onClick={handleDownloadPdf}>📄 Download PDF</button>
                <button className="ghost-btn" onClick={() => setShowReceiverView((value) => !value)}>🖨 Preview hotel view</button>
                {onEdit && <button className="ghost-btn" onClick={onEdit}>✏ Edit Information</button>}
                {onRegenerate && <button className="ghost-btn" onClick={onRegenerate}>🔄 Regenerate</button>}
                {onDelete && <button className="ghost-btn" onClick={onDelete}>🗑 Delete AccessPass</button>}
              </div>
              <p className={`share-state ${shareState === 'shared' ? 'share-state--success' : shareState === 'error' ? 'share-state--error' : ''}`}>
                {shareState === 'shared' ? 'Share link prepared successfully.' : shareState === 'error' ? 'Sharing was skipped; you can still use the link.' : 'Only the traveler-approved details are shared.'}
              </p>
            </div>
          </div>
        </section>

        <section className="accesspass-panel">
          <div className="detail-card__header">
            <div>
              <p className="detail-eyebrow">Privacy & security</p>
              <h3>Traveler-approved sharing</h3>
            </div>
          </div>
          <p className="detail-card__text">{accessPass.privacyNotice}</p>
        </section>

        {showReceiverView && (
          <section className="accesspass-panel">
            <div className="detail-card__header">
              <div>
                <p className="detail-eyebrow">Hotel receiver view</p>
                <h3>Incoming traveler</h3>
              </div>
            </div>
            <div className="receiver-dashboard">
              <div className="receiver-card">
                <p className="detail-eyebrow">Traveler</p>
                <strong>{accessPass.travelerName}</strong>
                <p>Arrival date: {accessPass.travelDate}</p>
                <p>Destination: {accessPass.destination}</p>
              </div>
              <div className="receiver-card">
                <p className="detail-eyebrow">Preparation checklist</p>
                <ul className="checklist-list">
                  <li>✔ Accessible Room Ready</li>
                  <li>✔ Ramp Available</li>
                  <li>✔ Lift Working</li>
                  <li>✔ Accessible Toilet</li>
                  <li>✔ Wheelchair Parking</li>
                  <li>✔ Staff Informed</li>
                </ul>
              </div>
            </div>
            <div className="accesspass-actions">
              <button className="primary-btn">Accept Booking</button>
              <button className="ghost-btn">Contact Traveler</button>
              <button className="ghost-btn">Preparation Completed</button>
            </div>
          </section>
        )}
      </div>
    </div>
  );

  if (mode === 'modal') {
    return <div className="detail-overlay"><div className="detail-sheet accesspass-sheet">{content}</div></div>;
  }

  return content;
}
