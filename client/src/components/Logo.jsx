import { Link } from 'react-router-dom';

// Renders the original SquadUp artwork from client/public.
//
// `logo.png` (256px) is generated from the 1254px source by cropping to the mark
// (x 376..872, y 342..818) and downscaling: 80 KB instead of 862 KB, and still
// 6x denser than the 40px the navbar renders. The crop drops ~60% empty padding.
//
// The source has no alpha channel and its background is #050405, which sits a
// few RGB steps from the app's #08080a, so no background box shows on dark UI.
const LOGO_SRC = '/logo.png';

const SIZES = {
  xs: { box: 'h-6 w-6', word: 'text-base' },
  sm: { box: 'h-8 w-8', word: 'text-lg' },
  md: { box: 'h-10 w-10', word: 'text-2xl' },
  lg: { box: 'h-16 w-16', word: 'text-4xl' },
};

export function LogoMark({ className = 'h-10 w-10', alt = '' }) {
  return (
    <img
      src={LOGO_SRC}
      alt={alt}
      draggable={false}
      className={`shrink-0 select-none pointer-events-none object-contain ${className}`}
    />
  );
}

export function LogoWord({ className = '' }) {
  return (
    <span className={`font-display font-black tracking-wider text-white ${className}`}>
      SQUAD<span className="text-[#ff5500]">UP</span>
    </span>
  );
}

export function Logo({ size = 'md', showWord = true, className = '' }) {
  const s = SIZES[size] || SIZES.md;

  const content = (
    <span className="flex items-center gap-2.5">
      <LogoMark className={s.box} alt={showWord ? '' : 'SquadUp'} />
      {showWord && <LogoWord className={s.word} />}
    </span>
  );

  if (!showWord) {
    return <span className={`inline-flex shrink-0 ${className}`}>{content}</span>;
  }

  return (
    <Link to="/" className={`inline-flex shrink-0 ${className}`} aria-label="SquadUp home">
      {content}
    </Link>
  );
}
