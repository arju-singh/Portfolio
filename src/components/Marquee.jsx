import './Marquee.css';

// Infinite CSS-keyframe marquee — the Framer signature.
export default function Marquee({ items, reverse = false, speed = 38, separator = '✺' }) {
  const row = (
    <ul className="marquee__row" aria-hidden={false}>
      {items.map((item, i) => (
        <li key={i} className="marquee__item">
          <span>{item}</span>
          <span className="marquee__sep">{separator}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="marquee" data-reverse={reverse}>
      <div className="marquee__track" style={{ '--speed': `${speed}s` }}>
        {row}
        <ul className="marquee__row" aria-hidden="true">
          {items.map((item, i) => (
            <li key={`d${i}`} className="marquee__item">
              <span>{item}</span>
              <span className="marquee__sep">{separator}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
