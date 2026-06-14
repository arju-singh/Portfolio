import './Mockup.css';

// Real, styled app-UI mockups (not PNGs). The `kind` picks the layout;
// `accent` tints it per-project.
export default function Mockup({ kind = 'dashboard', accent = '#c8ff4d', title = 'App' }) {
  return (
    <div className="mk" style={{ '--mk-accent': accent }}>
      <div className="mk__bar">
        <span className="mk__dots"><i /><i /><i /></span>
        <span className="mk__url">{title.toLowerCase().replace(/\s+/g, '')}.app</span>
      </div>
      <div className="mk__body">{renderKind(kind)}</div>
    </div>
  );
}

function renderKind(kind) {
  switch (kind) {
    case 'petcare':
      return <PetCareUI />;
    case 'legal':
      return <LegalUI />;
    case 'map':
      return <MapUI />;
    case 'kanban':
      return <KanbanUI />;
    case 'analytics':
      return <AnalyticsUI />;
    case 'game':
      return <GameUI />;
    case 'site':
      return <SiteUI />;
    default:
      return <DashboardUI />;
  }
}

// Modeled on the live petscare.club — cream canvas, gold accent, a top nav with
// the brand + Join button, the four service categories, and a product row.
function PetCareUI() {
  const cats = ['Medical', 'Grooming', 'Training', 'Products'];
  return (
    <div className="mk-pet">
      <div className="mk-pet__nav">
        <span className="mk-pet__brand">petscare<b>.club</b></span>
        <span className="mk-pet__links">
          <i>Store</i><i>Near Shop</i><i>Community</i>
        </span>
        <span className="mk-pet__search" />
        <span className="mk-pet__join">Join</span>
      </div>
      <div className="mk-pet__cats">
        {cats.map((c) => (
          <div key={c} className="mk-pet__cat">
            <span className="mk-pet__ico" />
            <b>{c}</b>
          </div>
        ))}
      </div>
      <div className="mk-pet__row">
        {[0, 1, 2].map((i) => (
          <div key={i} className="mk-pet__prod">
            <span className="mk-pet__thumb" />
            <span className="mk-line mk-line--xs" />
            <span className="mk-pet__price" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Modeled on the live lawms.in — clean white, scales-of-justice mark, the real
// nav (Cases / Clients / Documents / Finance) and a case table with status pills.
function LegalUI() {
  const rows = [
    { n: 'Mehta v. State', s: 'Active', c: 'ok' },
    { n: 'Acme Corp — NDA', s: 'Review', c: 'warn' },
    { n: 'Estate of Rao', s: 'Filed', c: 'info' },
    { n: 'Sharma Property', s: 'Closed', c: 'mute' }
  ];
  return (
    <div className="mk-law">
      <div className="mk-law__nav">
        <span className="mk-law__brand"><i className="mk-law__seal" />LawMS</span>
        <span className="mk-law__links">
          <b className="is-active">Cases</b><b>Clients</b><b>Documents</b><b>Finance</b>
        </span>
        <span className="mk-law__g">Continue with Google</span>
      </div>
      <div className="mk-law__table">
        <div className="mk-law__thead"><span>Case</span><span>Client</span><span>Status</span></div>
        {rows.map((r) => (
          <div key={r.n} className="mk-law__tr">
            <span className="mk-law__case">{r.n}</span>
            <span className="mk-line mk-line--xs" />
            <span className={`mk-law__badge mk-law__badge--${r.c}`}>{r.s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardUI() {
  return (
    <div className="mk-dash">
      <aside className="mk-dash__nav">
        <span className="mk-chip" />
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={`mk-line ${i === 1 ? 'mk-line--active' : ''}`} />
        ))}
      </aside>
      <div className="mk-dash__main">
        <div className="mk-row">
          {[0, 1, 2].map((i) => (
            <div key={i} className="mk-stat">
              <span className="mk-line mk-line--sm" />
              <strong className="mk-num" />
              <span className="mk-line mk-line--xs" />
            </div>
          ))}
        </div>
        <div className="mk-chart">
          <div className="mk-bars">
            {[40, 70, 50, 90, 65, 80, 55].map((h, i) => (
              <span key={i} style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsUI() {
  return (
    <div className="mk-an">
      <div className="mk-an__head">
        <span className="mk-line mk-line--md" />
        <span className="mk-pill" />
      </div>
      <svg className="mk-an__line" viewBox="0 0 300 120" preserveAspectRatio="none">
        <polyline points="0,90 40,70 80,82 120,45 160,58 200,30 240,42 300,12" />
        <polyline className="mk-an__line2" points="0,105 40,95 80,100 120,80 160,88 200,70 240,78 300,55" />
      </svg>
      <div className="mk-row">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="mk-donut" />
        ))}
      </div>
    </div>
  );
}

function MapUI() {
  return (
    <div className="mk-map">
      <div className="mk-map__grid" />
      <span className="mk-pin mk-pin--1" />
      <span className="mk-pin mk-pin--2" />
      <span className="mk-pin mk-pin--3" />
      <div className="mk-map__card">
        <span className="mk-line mk-line--sm" />
        <span className="mk-line mk-line--xs" />
        <span className="mk-tagrow">
          <i /><i />
        </span>
      </div>
    </div>
  );
}

function KanbanUI() {
  const cols = [3, 2, 4];
  return (
    <div className="mk-kan">
      {cols.map((n, c) => (
        <div key={c} className="mk-kan__col">
          <span className="mk-line mk-line--sm" />
          {Array.from({ length: n }).map((_, i) => (
            <div key={i} className="mk-card">
              <span className="mk-line mk-line--xs" />
              <span className="mk-line mk-line--xxs" />
              <span className="mk-dotrow"><i /><i /></span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function GameUI() {
  return (
    <div className="mk-game">
      <div className="mk-game__sky">
        <span className="mk-bird" />
        <span className="mk-pipe mk-pipe--a"><i /><i /></span>
        <span className="mk-pipe mk-pipe--b"><i /><i /></span>
        <span className="mk-score">12</span>
      </div>
    </div>
  );
}

function SiteUI() {
  return (
    <div className="mk-site">
      <div className="mk-site__hero">
        <span className="mk-line mk-line--md" />
        <span className="mk-line mk-line--sm" />
        <span className="mk-pill" />
      </div>
      <div className="mk-row">
        {[0, 1, 2].map((i) => (
          <div key={i} className="mk-tile" />
        ))}
      </div>
    </div>
  );
}
