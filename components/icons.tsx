/* The site's icon set — the same paths the old site.js held in its ICON
   map, as components. Every one inherits currentColor and is hidden from
   assistive technology: the button around it carries the label. */

import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;

/* `solid` picks the filled cut of an icon over the outlined one. */
function Icon({
  size = 18,
  solid = false,
  children,
  ...rest
}: Omit<P, 'children'> & { size?: number; solid?: boolean; children?: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={solid ? 'currentColor' : 'none'}
      stroke={solid ? undefined : 'currentColor'}
      strokeWidth={solid ? undefined : 1.4}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const BagIcon = (p: P) => (
  <Icon size={19} {...p}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </Icon>
);

export const SearchIcon = (p: P) => (
  <Icon size={18} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Icon>
);

export const MenuIcon = (p: P) => (
  <Icon size={20} {...p}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </Icon>
);

export const CloseIcon = (p: P) => (
  <Icon size={18} {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Icon>
);

export const EyeIcon = (p: P) => (
  <Icon size={16} {...p}>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
);

export const WhatsAppIcon = (p: P) => (
  <Icon size={22} solid {...p}>
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.2 14.1c-.2.6-1.2 1.2-1.7 1.2-.4 0-1.6-.1-3.6-1.4-2.2-1.4-3.6-3.9-3.7-4.1-.3-.5-.6-1.4-.3-2.2.2-.6.9-1.1 1.2-1.1h.6c.2 0 .4 0 .6.5l.7 1.7c0 .2 0 .3-.1.5l-.4.5c-.1.2-.2.3-.1.5.3.6.8 1.3 1.4 1.8.7.6 1.3.9 1.6 1 .2 0 .3 0 .5-.2l.7-.8c.2-.2.3-.1.5-.1l1.6.8c.2.1.4.2.4.3.1.2.1.8 0 1.1Z" />
  </Icon>
);

export const MuteIcon = (p: P) => (
  <Icon size={17} {...p}>
    <path d="M11 5 6 9H2v6h4l5 4Z" />
    <path d="m17 9 4 6M21 9l-4 6" />
  </Icon>
);

export const UnmuteIcon = (p: P) => (
  <Icon size={17} {...p}>
    <path d="M11 5 6 9H2v6h4l5 4Z" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7" />
    <path d="M18.5 5.5a9 9 0 0 1 0 13" />
  </Icon>
);

export const HeartIcon = (p: P) => (
  <Icon size={18} {...p}>
    <path d="M12 20s-7-4.4-7-9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7 3.5C19 15.6 12 20 12 20Z" />
  </Icon>
);

export const HeartFullIcon = (p: P) => (
  <Icon size={18} solid {...p}>
    <path d="M12 20s-7-4.4-7-9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7 3.5C19 15.6 12 20 12 20Z" />
  </Icon>
);

export const ScalesIcon = (p: P) => (
  <Icon size={16} {...p}>
    <path d="M12 3v18M5 7h14M7 7l-3 7h6Zm10 0-3 7h6Z" />
  </Icon>
);

export const SparkIcon = (p: P) => (
  <Icon size={20} {...p}>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z" />
    <path d="M18 16l.8 2.2L21 19l-2.2.8L18 22l-.8-2.2L15 19l2.2-.8Z" />
  </Icon>
);

export const MoonIcon = (p: P) => (
  <Icon size={17} {...p}>
    <path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10Z" />
  </Icon>
);

export const SunIcon = (p: P) => (
  <Icon size={17} {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
  </Icon>
);

export const PlayIcon = (p: P) => (
  <Icon size={17} solid {...p}>
    <path d="M7 4l13 8-13 8Z" />
  </Icon>
);

export const PauseIcon = (p: P) => (
  <Icon size={17} solid {...p}>
    <path d="M7 4h4v16H7zM13 4h4v16h-4z" />
  </Icon>
);
