export default function Icon({ name, size = 20, ...props }) {
  const paths = {
    arrow: <path d="M7 17 17 7M7 7h10v10" />,
    chevron: <path d="m9 5 7 7-7 7" />,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    about: <><circle cx="12" cy="8" r="3.5" /><path d="M5 21v-3a7 7 0 0 1 14 0v3" /></>,
    contact: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m3 7 9 7 9-7" /></>,
    welcome: <text x="12" y="17.5" textAnchor="middle" fill="currentColor" stroke="none" fontSize="19" fontWeight="750" letterSpacing="-.8">d<tspan fill="#0a84ff">.</tspan></text>,
    github: <path fill="currentColor" stroke="none" d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.86c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.82c.85 0 1.71.11 2.51.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />,
    // LinkedIn "in" mark from Simple Icons (CC0), without the outer square.
    linkedin: <path fill="currentColor" stroke="none" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" strokeWidth="3" /></>,
    settings: <><path d="m10 3-.7 2.1-2 .9-2-.8-2 3.5L5 10v2l-1.7 1.3 2 3.5 2-.8 2 .9L10 19h4l.7-2.1 2-.9 2 .8 2-3.5L19 12v-2l1.7-1.3-2-3.5-2 .8-2-.9L14 3Z" /><circle cx="12" cy="11" r="3" /></>,
    controls: <><path d="M3 7h18M3 17h18" /><rect x="6" y="4" width="5" height="6" rx="2" fill="currentColor" /><rect x="14" y="14" width="5" height="6" rx="2" fill="currentColor" /></>,
    wifi: <><path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0" /><path d="M12 19.5h.01" strokeWidth="3" /></>,
    bluetooth: <path d="m7 7 10 10-5 4V3l5 4L7 17" />,
    network: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" /></>,
    energy: <path fill="currentColor" stroke="none" d="M13 2 4 14h7l-1 8 9-12h-7Z" />,
    accessibility: <><circle cx="12" cy="4.5" r="1.8" fill="currentColor" /><path d="M5 8.5 12 10l7-1.5M12 10v4m0 0-3 6.5m3-6.5 3 6.5" /></>,
    appearance: <><circle cx="12" cy="12" r="8" /><path fill="currentColor" d="M12 4a8 8 0 0 1 0 16Z" /></>,
    menubar: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 9h18" /></>,
    dock: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 16h10" strokeWidth="2.5" /></>,
    displays: <><circle cx="12" cy="12" r="4" fill="currentColor" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
    spotlight: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    // Rebyte: a chip inside a circular arrow, for second-hand tech.
    rebyte: <><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><rect x="8.5" y="8.5" width="7" height="7" rx="1.5" /></>,
    code:<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18" />,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] || paths.code}</svg>
}
