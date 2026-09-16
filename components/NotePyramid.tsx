/* Top, heart, base — the three rows every bottle carries. */

import type { Notes } from '@/lib/types';

export default function NotePyramid({ notes, style }: { notes: Notes; style?: React.CSSProperties }) {
  const rows: [string, string[]][] = [
    ['Top', notes.top],
    ['Heart', notes.heart],
    ['Base', notes.base]
  ];

  return (
    <div className="pyr" style={style}>
      {rows.map(([label, list]) => (
        <div key={label}>
          <span className="t">{label}</span>
          <span className="n">{list.join(', ')}</span>
        </div>
      ))}
    </div>
  );
}
